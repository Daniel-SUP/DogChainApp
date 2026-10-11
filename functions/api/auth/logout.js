import { deleteSession, hasSameOrigin, jsonError } from "../../_lib/auth.js";

export async function onRequestPost(context) {
  if (!hasSameOrigin(context)) return jsonError("Недопустимый источник запроса.", 403);
  const cookie = await deleteSession(context);
  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookie, "Cache-Control": "no-store" } });
}
