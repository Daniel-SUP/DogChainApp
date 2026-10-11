import { getSession, hasSameOrigin, jsonError } from "../_lib/auth.js";

export async function onRequestGet(context) {
  const { env } = context;
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  const { results } = await env.DB
    .prepare(`
      SELECT id, name, species, category, breed, notes, weight_kg, height_cm,
             temp_min, temp_max, photo_url, coat_type, temperament,
             requires_hammock, requires_crate, created_at
      FROM pets WHERE user_id = ? ORDER BY id DESC
    `)
    .bind(user.id)
    .all();

  return Response.json(results.map((pet) => ({
    ...pet,
    weightKg: pet.weight_kg,
    heightCm: pet.height_cm,
    tempMin: pet.temp_min,
    tempMax: pet.temp_max,
    photoUrl: pet.photo_url,
    coatType: pet.coat_type,
    requiresHammock: Boolean(pet.requires_hammock),
    requiresCrate: Boolean(pet.requires_crate),
  })), { headers: { "Cache-Control": "private, no-store" } });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Тело запроса должно быть JSON.");
  }

  if (!body || typeof body !== "object" || typeof body.name !== "string" || !body.name.trim()) {
    return jsonError("Укажите имя питомца.");
  }

  const result = await env.DB
    .prepare(`
      INSERT INTO pets (
        name, species, category, breed, notes, weight_kg, height_cm,
        temp_min, temp_max, photo_url, coat_type, temperament,
        requires_hammock, requires_crate, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      body.name.trim(),
      typeof body.species === "string" ? body.species.trim() || null : null,
      typeof body.category === "string" ? body.category.trim() || null : null,
      typeof body.breed === "string" ? body.breed.trim() || null : null,
      typeof body.notes === "string" ? body.notes.trim() || null : null,
      Number.isFinite(body.weightKg) ? body.weightKg : null,
      Number.isFinite(body.heightCm) ? body.heightCm : null,
      Number.isInteger(body.tempMin) ? body.tempMin : null,
      Number.isInteger(body.tempMax) ? body.tempMax : null,
      typeof body.photoUrl === "string" ? body.photoUrl : null,
      typeof body.coatType === "string" ? body.coatType : null,
      typeof body.temperament === "string" ? body.temperament : null,
      body.requiresHammock ? 1 : 0,
      body.requiresCrate ? 1 : 0,
      user.id,
    )
    .run();

  return Response.json({ id: result.meta.last_row_id }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
