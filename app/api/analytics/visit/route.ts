import { env } from "cloudflare:workers";
import { isAdminSession } from "../../../lib/admin-session";

async function ensureTable() {
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS portfolio_visits (
      visit_date TEXT PRIMARY KEY,
      visits INTEGER NOT NULL DEFAULT 0
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS portfolio_visit_dimensions (
      visit_date TEXT NOT NULL,
      dimension TEXT NOT NULL,
      value TEXT NOT NULL,
      visits INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (visit_date, dimension, value)
    )`),
  ]);
}

function riyadhDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function browserFrom(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/CriOS\//i.test(userAgent)) return "Chrome";
  if (/Chrome\//i.test(userAgent)) return "Chrome";
  if (/Safari\//i.test(userAgent)) return "Safari";
  return "Other";
}

function osFrom(userAgent: string) {
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function deviceFrom(userAgent: string) {
  if (/iPad|Tablet/i.test(userAgent) || (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent))) return "Tablet";
  if (/Mobile|iPhone|iPod|Android/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

function sourceFrom(value: unknown, ownHost: string) {
  const source = String(value || "").trim().slice(0, 300);
  if (!source) return "Direct";
  try {
    const host = new URL(source).hostname.toLowerCase().replace(/^www\./, "");
    if (!host || host === ownHost) return "Direct";
    if (host.includes("google.")) return "Google";
    if (host.includes("linkedin.")) return "LinkedIn";
    if (host.includes("facebook.") || host === "fb.com") return "Facebook";
    if (host.includes("instagram.")) return "Instagram";
    if (host.includes("x.com") || host.includes("twitter.")) return "X / Twitter";
    return host.slice(0, 80);
  } catch {
    return source.replace(/[^a-zA-Z0-9 ._/-]/g, "").slice(0, 80) || "Direct";
  }
}

export async function POST(request: Request) {
  await ensureTable();
  const date = riyadhDate();
  const userAgent = request.headers.get("user-agent") || "";
  const body = await request.json().catch(() => ({})) as { source?: unknown };
  const cf = (request as Request & { cf?: { country?: string } }).cf;
  const dimensions = {
    device: deviceFrom(userAgent),
    os: osFrom(userAgent),
    browser: browserFrom(userAgent),
    country: String(cf?.country || "Unknown").slice(0, 8),
    source: sourceFrom(body.source, new URL(request.url).hostname),
  };

  await env.DB.batch([
    env.DB.prepare(`INSERT INTO portfolio_visits (visit_date, visits) VALUES (?, 1)
      ON CONFLICT(visit_date) DO UPDATE SET visits = visits + 1`).bind(date),
    ...Object.entries(dimensions).map(([dimension, value]) => env.DB.prepare(`
      INSERT INTO portfolio_visit_dimensions (visit_date, dimension, value, visits)
      VALUES (?, ?, ?, 1)
      ON CONFLICT(visit_date, dimension, value) DO UPDATE SET visits = visits + 1
    `).bind(date, dimension, value)),
  ]);
  return Response.json({ ok: true });
}

export async function GET() {
  if (!(await isAdminSession())) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }

  await ensureTable();
  const date = riyadhDate();
  const dimensionNames = ["device", "os", "browser", "country", "source"] as const;
  const [totalRow, todayRow, ...dimensionRows] = await Promise.all([
    env.DB.prepare("SELECT COALESCE(SUM(visits), 0) AS visits FROM portfolio_visits").first<{ visits: number }>(),
    env.DB.prepare("SELECT visits FROM portfolio_visits WHERE visit_date = ?").bind(date).first<{ visits: number }>(),
    ...dimensionNames.map(dimension => env.DB.prepare(`
      SELECT value, SUM(visits) AS visits
      FROM portfolio_visit_dimensions
      WHERE dimension = ?
      GROUP BY value
      ORDER BY visits DESC
      LIMIT 8
    `).bind(dimension).all<{ value: string; visits: number }>()),
  ]);

  const breakdown = Object.fromEntries(dimensionNames.map((name, index) => [
    name,
    (dimensionRows[index]?.results || []).map(row => ({ value: row.value, visits: Number(row.visits || 0) })),
  ]));

  return Response.json({
    total: Number(totalRow?.visits || 0),
    today: Number(todayRow?.visits || 0),
    breakdown,
  });
}
