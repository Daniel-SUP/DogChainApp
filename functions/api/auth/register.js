import { checkAuthRateLimit, createSession, hasSameOrigin, hashPassword, jsonError } from "../../_lib/auth.js";

export async function onRequestPost(context) {
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  if (!await checkAuthRateLimit(context, "register", 5)) return jsonError("Слишком много попыток. Повторите через 15 минут.", 429);

  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonError("Передайте данные в формате JSON.");
  }

  if (!body || typeof body !== "object") return jsonError("Некорректные данные регистрации.");
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 80) return jsonError("Имя должно содержать от 2 до 80 символов.");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("Укажите корректный адрес электронной почты.");
  if (password.length < 12 || password.length > 128) return jsonError("Пароль должен содержать от 12 до 128 символов.");

  const passwordHash = await hashPassword(password);
  try {
    const result = await context.env.DB
      .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
      .bind(name, email, passwordHash)
      .run();
    const userId = result.meta.last_row_id;
    const cookie = await createSession(context, userId);
    return Response.json(
      { user: { id: userId, name, email } },
      { status: 201, headers: { "Set-Cookie": cookie, "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (String(error.message).includes("UNIQUE constraint failed")) {
      return jsonError("Аккаунт с таким адресом уже зарегистрирован.", 409);
    }
    throw error;
  }
}
