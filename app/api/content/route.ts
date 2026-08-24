import { env } from "cloudflare:workers";
import { isAdminSession } from "../../lib/admin-session";

async function ensureTable() {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS portfolio_content (id INTEGER PRIMARY KEY, content TEXT NOT NULL, updated_at TEXT NOT NULL)`).run();
}

export async function GET() {
  await ensureTable();
  const row = await env.DB.prepare("SELECT content FROM portfolio_content WHERE id = 1").first<{content:string}>();
  if (!row) return Response.json({ content: null });
  try { return Response.json(JSON.parse(row.content)); } catch { return Response.json({ content: null }); }
}

export async function PUT(request: Request) {
  if (!(await isAdminSession())) return Response.json({ error: "Sign in required" }, { status: 401 });
  const body = await request.json();
  if (!body?.content?.en || !body?.content?.ar || !body?.links) return Response.json({ error: "Invalid content" }, { status: 400 });
  await ensureTable();
  await env.DB.prepare("INSERT INTO portfolio_content (id, content, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at")
    .bind(JSON.stringify(body), new Date().toISOString()).run();
  return Response.json({ ok: true });
}
