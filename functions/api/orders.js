import { getSession, hasSameOrigin, jsonError } from "../_lib/auth.js";

export async function onRequestGet(context) {
  const { env } = context;
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  const { results } = await env.DB
    .prepare(`
      SELECT orders.id, orders.pet_id, pets.name AS pet_name,
             orders.description, orders.status, orders.created_at
      FROM orders
      JOIN pets ON pets.id = orders.pet_id AND pets.user_id = orders.user_id
      WHERE orders.user_id = ?
      ORDER BY orders.id DESC
    `)
    .bind(user.id)
    .all();

  return Response.json(results, { headers: { "Cache-Control": "private, no-store" } });
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

  if (!body || typeof body !== "object" || !Number.isInteger(body.pet_id) || body.pet_id < 1) {
    return jsonError("Укажите корректный pet_id.");
  }
  if (typeof body.description !== "string" || !body.description.trim()) {
    return jsonError("Укажите описание заказа.");
  }

  const pet = await env.DB
    .prepare("SELECT id FROM pets WHERE id = ? AND user_id = ?")
    .bind(body.pet_id, user.id)
    .first();

  if (!pet) return jsonError("Питомец не найден.", 404);

  const result = await env.DB
    .prepare("INSERT INTO orders (pet_id, description, user_id) VALUES (?, ?, ?)")
    .bind(body.pet_id, body.description.trim(), user.id)
    .run();

  return Response.json({ id: result.meta.last_row_id }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
