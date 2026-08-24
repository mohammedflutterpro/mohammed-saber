import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

const COOKIE_NAME = "portfolio_admin";
const encoder = new TextEncoder();

async function sign(value: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(env.SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  const aa=encoder.encode(a), bb=encoder.encode(b);let diff=aa.length^bb.length;
  for(let i=0;i<Math.max(aa.length,bb.length);i++)diff|=(aa[i%Math.max(aa.length,1)]??0)^(bb[i%Math.max(bb.length,1)]??0);
  return diff===0;
}

export function passwordMatches(value: string) { return Boolean(env.ADMIN_PASSWORD) && safeEqual(value, env.ADMIN_PASSWORD); }
export async function createSessionValue(){const expires=Date.now()+1000*60*60*12;const value=String(expires);return `${value}.${await sign(value)}`}
export async function isAdminSession(){const token=(await cookies()).get(COOKIE_NAME)?.value;if(!token||!env.SESSION_SECRET)return false;const[expires,sig]=token.split(".");if(!expires||!sig||Number(expires)<Date.now())return false;return safeEqual(sig,await sign(expires))}
export const adminCookie={name:COOKIE_NAME,options:{httpOnly:true,secure:true,sameSite:"strict" as const,path:"/",maxAge:60*60*12}};
