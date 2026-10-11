const SESSION_COOKIE = "dogchain_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
// Cloudflare's workerd runtime currently caps PBKDF2 at 100,000 iterations.
const PBKDF2_ITERATIONS = 100_000;

function base64UrlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function base64UrlDecode(value) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function hasSameOrigin(context) {
  const origin = context.request.headers.get("Origin");
  return origin === new URL(context.request.url).origin;
}

export async function hashPassword(password, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return `pbkdf2-sha256$${PBKDF2_ITERATIONS}$${base64UrlEncode(salt)}$${base64UrlEncode(new Uint8Array(derived))}`;
}

export async function verifyPassword(password, encodedHash) {
  const [algorithm, iterationText, saltText, hashText] = encodedHash.split("$");
  const iterations = Number(iterationText);
  if (algorithm !== "pbkdf2-sha256" || !Number.isInteger(iterations) || iterations < 10_000 || iterations > 100_000) {
    return false;
  }
  const expected = base64UrlDecode(hashText);
  const computedHash = await hashPasswordWithIterations(password, base64UrlDecode(saltText), iterations);
  if (expected.length !== computedHash.length) return false;
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) mismatch |= expected[index] ^ computedHash[index];
  return mismatch === 0;
}

async function hashPasswordWithIterations(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256,
  );
  return new Uint8Array(derived);
}

async function digestToken(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return base64UrlEncode(new Uint8Array(digest));
}

export async function checkAuthRateLimit(context, scope, maxAttempts) {
  const address = context.request.headers.get("CF-Connecting-IP") || "local";
  const keyHash = await digestToken(`${scope}:${address}`);
  const now = Math.floor(Date.now() / 1000);
  const windowStartedAt = Math.floor(now / 900) * 900;

  await context.env.DB
    .prepare(`
      INSERT INTO auth_rate_limits (key_hash, window_started_at, attempts)
      VALUES (?, ?, 1)
      ON CONFLICT(key_hash) DO UPDATE SET
        attempts = CASE
          WHEN auth_rate_limits.window_started_at = excluded.window_started_at
          THEN auth_rate_limits.attempts + 1
          ELSE 1
        END,
        window_started_at = excluded.window_started_at
    `)
    .bind(keyHash, windowStartedAt)
    .run();

  const row = await context.env.DB
    .prepare("SELECT attempts FROM auth_rate_limits WHERE key_hash = ?")
    .bind(keyHash)
    .first();
  return (row?.attempts || 0) <= maxAttempts;
}

function readCookie(request, cookieName) {
  const cookieHeader = request.headers.get("Cookie") || "";
  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name === cookieName) return valueParts.join("=");
  }
  return null;
}

export async function getSession(context) {
  const token = readCookie(context.request, SESSION_COOKIE);
  if (!token) return null;

  const tokenHash = await digestToken(token);
  const session = await context.env.DB
    .prepare(`
      SELECT users.id, users.name, users.email, sessions.expires_at
      FROM sessions JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?
    `)
    .bind(tokenHash)
    .first();

  if (!session || session.expires_at <= Math.floor(Date.now() / 1000)) {
    await context.env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
    return null;
  }
  return { id: session.id, name: session.name, email: session.email };
}

export async function createSession(context, userId) {
  const token = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash = await digestToken(token);
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;

  await context.env.DB
    .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(tokenHash, userId, expiresAt)
    .run();

  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${new URL(context.request.url).protocol === "https:" ? "; Secure" : ""}`;
}

export async function deleteSession(context) {
  const token = readCookie(context.request, SESSION_COOKIE);
  if (token) {
    await context.env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await digestToken(token)).run();
  }
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${new URL(context.request.url).protocol === "https:" ? "; Secure" : ""}`;
}
