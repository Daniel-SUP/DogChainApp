function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB
    .prepare("SELECT id, name, species, breed, notes, created_at FROM pets ORDER BY id DESC")
    .all();

  return Response.json(results);
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Тело запроса должно быть JSON.");
  }

  if (typeof body.name !== "string" || !body.name.trim()) {
    return jsonError("Укажите имя питомца.");
  }

  const result = await env.DB
    .prepare("INSERT INTO pets (name, species, breed, notes) VALUES (?, ?, ?, ?)")
    .bind(
      body.name.trim(),
      typeof body.species === "string" ? body.species.trim() || null : null,
      typeof body.breed === "string" ? body.breed.trim() || null : null,
      typeof body.notes === "string" ? body.notes.trim() || null : null,
    )
    .run();

  return Response.json({ id: result.meta.last_row_id }, { status: 201 });
}
