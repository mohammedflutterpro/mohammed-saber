import { env } from "cloudflare:workers";
import { isAdminSession } from "./admin-session";

type MediaKind = "photo" | "cv";

const REPOSITORY = "mohammedflutterpro/mohammed-saber-it";
const BRANCH = "main";
const files: Record<MediaKind, { path: string; fallback: string; types: string[]; maxBytes: number }> = {
  photo: {
    path: "public/mohammed-saber.jpg",
    fallback: "/mohammed-saber.jpg",
    types: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 900_000,
  },
  cv: {
    path: "public/Mohammed_Saber_CV.pdf",
    fallback: "/Mohammed_Saber_CV.pdf",
    types: ["application/pdf"],
    maxBytes: 900_000,
  },
};

function token() {
  return (env as unknown as { GITHUB_TOKEN?: string }).GITHUB_TOKEN;
}

function apiHeaders(accept = "application/vnd.github+json") {
  const value = token();
  return {
    Accept: accept,
    Authorization: value ? `Bearer ${value}` : "",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "mohammed-saber-portfolio",
  };
}

function endpoint(path: string) {
  return `https://api.github.com/repos/${REPOSITORY}/contents/${path}`;
}

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export async function getMedia(request: Request, kind: MediaKind) {
  const config = files[kind];
  const response = await fetch(`${endpoint(config.path)}?ref=${BRANCH}`, {
    headers: apiHeaders("application/vnd.github.raw+json"),
  });
  if (!response.ok) {
    const url = new URL(config.fallback, request.url);
    return Response.redirect(url, 302);
  }
  const headers = new Headers();
  headers.set("content-type", response.headers.get("content-type") || (kind === "photo" ? "image/jpeg" : "application/pdf"));
  headers.set("cache-control", "no-store, max-age=0");
  if (kind === "cv") headers.set("content-disposition", 'inline; filename="Mohammed_Saber_CV.pdf"');
  return new Response(response.body, { status: 200, headers });
}

export async function putMedia(request: Request, kind: MediaKind) {
  if (!(await isAdminSession())) return Response.json({ error: "انتهت الجلسة، سجّل الدخول مرة أخرى" }, { status: 401 });
  if (!token()) return Response.json({ error: "أضف GITHUB_TOKEN داخل Cloudflare أولًا" }, { status: 503 });

  const config = files[kind];
  const contentType = (request.headers.get("content-type") || "").split(";")[0];
  const size = Number(request.headers.get("content-length") || 0);
  if (!config.types.includes(contentType)) return Response.json({ error: kind === "photo" ? "صيغة الصورة غير مدعومة" : "يجب اختيار ملف PDF" }, { status: 415 });
  if (size > config.maxBytes) return Response.json({ error: "حجم الملف يجب ألا يتجاوز 900KB" }, { status: 413 });

  const buffer = await request.arrayBuffer();
  if (!buffer.byteLength || buffer.byteLength > config.maxBytes) return Response.json({ error: "حجم الملف غير مناسب" }, { status: 413 });

  const current = await fetch(`${endpoint(config.path)}?ref=${BRANCH}`, { headers: apiHeaders() });
  const metadata = current.ok ? await current.json() as { sha?: string } : {};
  const response = await fetch(endpoint(config.path), {
    method: "PUT",
    headers: { ...apiHeaders(), "content-type": "application/json" },
    body: JSON.stringify({
      message: kind === "photo" ? "Update portfolio photo" : "Update portfolio CV",
      content: toBase64(buffer),
      sha: metadata.sha,
      branch: BRANCH,
    }),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({})) as { message?: string };
    return Response.json({ error: detail.message || "تعذر تحديث الملف على GitHub" }, { status: response.status });
  }
  return Response.json({ ok: true });
}
