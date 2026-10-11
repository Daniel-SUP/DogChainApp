import { checkAuthRateLimit, createSession, hasSameOrigin, jsonError, verifyPassword } from "../../_lib/auth.js";

const DUMMY_PASSWORD_HASH = "pbkdf2-sha256$100000$MDEyMzQ1Njc4OWFiY2RlZg$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export async function onRequestPost(context) {
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  if (!await checkAuthRateLimit(context, "login", 10)) return jsonError("Слишком много попыток. Повторите через 15 минут.", 429);

  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonError("Передайте данные в формате JSON.");
  }

  if (!body || typeof body !== "object") return jsonError("Некорректные данные для входа.");
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (email.length > 254 || !email || password.length < 1 || password.length > 128) {
    return jsonError("Неверный email или пароль.", 401);
  }

  const user = await context.env.DB
    .prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?")
    .bind(email)
    .first();
  const validPassword = await verifyPassword(password, user?.password_hash || DUMMY_PASSWORD_HASH);

  if (!user || !validPassword) return jsonError("Неверный email или пароль.", 401);

  const cookie = await createSession(context, user.id);
  return Response.json(
    { user: { id: user.id, name: user.name, email: user.email } },
    { headers: { "Set-Cookie": cookie, "Cache-Control": "no-store" } },
  );
}
