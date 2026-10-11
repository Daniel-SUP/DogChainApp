import { getSession, hasSameOrigin, jsonError } from "../_lib/auth.js";

const PASSPORTS = new Set(["RB", "RF", "EU"]);

function validatePet(body) {
  if (!body || typeof body !== "object" || typeof body.name !== "string" || !body.name.trim()) {
    return "Укажите имя питомца.";
  }
  if (!Number.isFinite(body.weightKg) || body.weightKg <= 0 || body.weightKg > 250) return "Укажите корректный вес.";
  if (!Number.isFinite(body.heightCm) || body.heightCm <= 0 || body.heightCm > 250) return "Укажите корректную высоту в холке.";
  if (!Number.isInteger(body.tempMin) || !Number.isInteger(body.tempMax) || body.tempMin < -50 || body.tempMax > 60 || body.tempMin > body.tempMax) {
    return "Проверьте диапазон комфортной температуры.";
  }
  if (!PASSPORTS.has(body.vetPassport)) return "Выберите тип ветпаспорта.";
  if (body.photoUrl != null && body.photoUrl !== "") {
    if (typeof body.photoUrl !== "string" || body.photoUrl.length > 550_000) return "Фото слишком большое. Выберите изображение меньшего размера.";
    const isImageData = /^data:image\/(jpeg|png|webp);base64,/.test(body.photoUrl);
    const isHttpsUrl = /^https:\/\//i.test(body.photoUrl);
    if (!isImageData && !isHttpsUrl) return "Можно сохранить только изображение или HTTPS-ссылку на фото.";
  }
  return null;
}

function petValues(body) {
  return [
    body.name.trim(),
    typeof body.species === "string" ? body.species.trim() || null : null,
    typeof body.category === "string" ? body.category.trim() || null : null,
    typeof body.breed === "string" ? body.breed.trim() || null : null,
    typeof body.notes === "string" ? body.notes.trim() || null : null,
    body.weightKg,
    body.heightCm,
    body.tempMin,
    body.tempMax,
    typeof body.photoUrl === "string" ? body.photoUrl.trim() || null : null,
    typeof body.coatType === "string" ? body.coatType : null,
    typeof body.temperament === "string" ? body.temperament : null,
    body.requiresCrate ? 1 : 0,
    body.vaccinated ? 1 : 0,
    body.vetPassport,
  ];
}

function serializePet(pet) {
  return {
    ...pet,
    weightKg: pet.weight_kg,
    heightCm: pet.height_cm,
    tempMin: pet.temp_min,
    tempMax: pet.temp_max,
    photoUrl: pet.photo_url,
    coatType: pet.coat_type,
    requiresCrate: Boolean(pet.requires_crate),
    vaccinated: Boolean(pet.vaccinated),
    vetPassport: pet.vet_passport,
  };
}

const SELECT_PETS = `SELECT id, name, species, category, breed, notes, weight_kg, height_cm,
  temp_min, temp_max, photo_url, coat_type, temperament, requires_crate,
  vaccinated, vet_passport, created_at FROM pets`;

export async function onRequestGet(context) {
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  const { results } = await context.env.DB.prepare(`${SELECT_PETS} WHERE user_id = ? ORDER BY id DESC`).bind(user.id).all();
  return Response.json(results.map(serializePet), { headers: { "Cache-Control": "private, no-store" } });
}

export async function onRequestPost(context) {
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  let body;
  try { body = await context.request.json(); } catch { return jsonError("Тело запроса должно быть JSON."); }
  const error = validatePet(body);
  if (error) return jsonError(error);

  const result = await context.env.DB.prepare(`
    INSERT INTO pets (name, species, category, breed, notes, weight_kg, height_cm,
      temp_min, temp_max, photo_url, coat_type, temperament, requires_crate,
      vaccinated, vet_passport, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(...petValues(body), user.id).run();
  return Response.json({ id: result.meta.last_row_id }, { status: 201, headers: { "Cache-Control": "no-store" } });
}

export async function onRequestPut(context) {
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  let body;
  try { body = await context.request.json(); } catch { return jsonError("Тело запроса должно быть JSON."); }
  const id = Number(body?.id);
  if (!Number.isSafeInteger(id) || id <= 0) return jsonError("Не удалось определить питомца.");
  const error = validatePet(body);
  if (error) return jsonError(error);

  const result = await context.env.DB.prepare(`
    UPDATE pets SET name = ?, species = ?, category = ?, breed = ?, notes = ?,
      weight_kg = ?, height_cm = ?, temp_min = ?, temp_max = ?, photo_url = ?,
      coat_type = ?, temperament = ?, requires_crate = ?, vaccinated = ?, vet_passport = ?
    WHERE id = ? AND user_id = ?
  `).bind(...petValues(body), id, user.id).run();
  if (!result.meta.changes) return jsonError("Питомец не найден.", 404);
  return Response.json({ ok: true, id }, { headers: { "Cache-Control": "no-store" } });
}

export async function onRequestDelete(context) {
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  const id = Number(new URL(context.request.url).searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return jsonError("Не удалось определить питомца.");
  const result = await context.env.DB.prepare("DELETE FROM pets WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  if (!result.meta.changes) return jsonError("Питомец не найден.", 404);
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
