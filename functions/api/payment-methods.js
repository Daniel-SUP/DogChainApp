import { getSession, hasSameOrigin, jsonError } from "../_lib/auth.js";

function publicPaymentMethod(row) {
  return {
    id: `card-${row.id}`,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle,
    last4: row.last4,
    isDefault: Boolean(row.is_default),
  };
}

export async function onRequestGet(context) {
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  const { results } = await context.env.DB
    .prepare("SELECT id, type, title, subtitle, last4, is_default FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, id DESC")
    .bind(user.id)
    .all();
  return Response.json(results.map(publicPaymentMethod), { headers: { "Cache-Control": "private, no-store" } });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  let body;
  try { body = await request.json(); } catch { return jsonError("Тело запроса должно быть JSON."); }

  if (!/^\d{4}$/.test(body?.last4 || "")) return jsonError("Не удалось прочитать последние четыре цифры карты.");
  if (!/^\d{2}\/\d{2}$/.test(body?.expiry || "") || Number(body.expiry.slice(0, 2)) < 1 || Number(body.expiry.slice(0, 2)) > 12) {
    return jsonError("Укажите срок действия карты в формате ММ/ГГ.");
  }

  await env.DB.prepare("UPDATE payment_methods SET is_default = 0 WHERE user_id = ?").bind(user.id).run();
  const result = await env.DB.prepare(`
    INSERT INTO payment_methods (user_id, type, title, subtitle, last4, is_default)
    VALUES (?, 'card', ?, ?, ?, 1)
  `).bind(user.id, `Карта •••• ${body.last4}`, `Действует до ${body.expiry}`, body.last4).run();

  return Response.json({
    paymentMethod: {
      id: `card-${result.meta.last_row_id}`,
      type: "card",
      title: `Карта •••• ${body.last4}`,
      subtitle: `Действует до ${body.expiry}`,
      last4: body.last4,
      isDefault: true,
    },
  }, { status: 201, headers: { "Cache-Control": "no-store" } });
}

export async function onRequestPut(context) {
  const { request, env } = context;
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  let body;
  try { body = await request.json(); } catch { return jsonError("Тело запроса должно быть JSON."); }

  if (body?.id === "cash-driver") {
    await env.DB.prepare("UPDATE payment_methods SET is_default = 0 WHERE user_id = ?").bind(user.id).run();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const id = Number(String(body?.id || "").replace(/^card-/, ""));
  if (!Number.isSafeInteger(id) || id < 1) return jsonError("Не удалось определить способ оплаты.");
  await env.DB.prepare("UPDATE payment_methods SET is_default = 0 WHERE user_id = ?").bind(user.id).run();
  const result = await env.DB.prepare("UPDATE payment_methods SET is_default = 1 WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  if (!result.meta.changes) return jsonError("Карта не найдена.", 404);
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function onRequestDelete(context) {
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  const user = await getSession(context);
  if (!user) return jsonError("Сначала войдите в аккаунт.", 401);
  const rawId = new URL(context.request.url).searchParams.get("id") || "";
  const id = Number(rawId.replace(/^card-/, ""));
  if (!Number.isSafeInteger(id) || id < 1) return jsonError("Не удалось определить карту.");
  const result = await context.env.DB.prepare("DELETE FROM payment_methods WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  if (!result.meta.changes) return jsonError("Карта не найдена.", 404);
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
