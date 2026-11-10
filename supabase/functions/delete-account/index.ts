import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return json({ error: "No autorizado" }, 401);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) return json({ error: "No autorizado" }, 401);
  const id = user.id;
  // Borrar datos del usuario antes de la cuenta.
  await admin.from("comments").delete().eq("user_id", id);
  await admin.from("post_likes").delete().eq("user_id", id);
  await admin.from("posts").delete().eq("user_id", id);
  await admin.from("favorites").delete().eq("user_id", id);
  await admin.from("documents").delete().eq("user_id", id);
  await admin.from("story_collaborators").delete().eq("owner_id", id);
  const { error: delErr } = await admin.auth.admin.deleteUser(id);
  if (delErr) return json({ error: delErr.message }, 500);
  return json({ ok: true });
});
