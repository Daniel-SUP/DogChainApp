import { getSession } from "../../_lib/auth.js";

export async function onRequestGet(context) {
  const user = await getSession(context);
  return Response.json({ user }, { headers: { "Cache-Control": "no-store" } });
}
