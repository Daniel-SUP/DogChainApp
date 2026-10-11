function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB
    .prepare(`
      SELECT orders.id, orders.pet_id, pets.name AS pet_name,
             orders.description, orders.status, orders.created_at
      FROM orders
      JOIN pets ON pets.id = orders.pet_id
      ORDER BY orders.id DESC
    `)
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

  if (!Number.isInteger(body.pet_id) || body.pet_id < 1) {
    return jsonError("Укажите корректный pet_id.");
  }
  if (typeof body.description !== "string" || !body.description.trim()) {
    return jsonError("Укажите описание заказа.");
  }

  const pet = await env.DB
    .prepare("SELECT id FROM pets WHERE id = ?")
    .bind(body.pet_id)
    .first();

  if (!pet) return jsonError("Питомец не найден.", 404);

  const result = await env.DB
    .prepare("INSERT INTO orders (pet_id, description) VALUES (?, ?)")
    .bind(body.pet_id, body.description.trim())
    .run();

  return Response.json({ id: result.meta.last_row_id }, { status: 201 });
}
