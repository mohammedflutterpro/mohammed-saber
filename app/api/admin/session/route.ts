import { cookies } from "next/headers";
import { adminCookie, createSessionValue, isAdminSession, passwordMatches } from "../../../lib/admin-session";

export async function GET(){const authenticated=await isAdminSession();return Response.json({authenticated},{status:authenticated?200:401})}
export async function POST(request:Request){const body=await request.json().catch(()=>({}));if(!passwordMatches(String(body.password||"")))return Response.json({error:"Invalid password"},{status:401});(await cookies()).set(adminCookie.name,await createSessionValue(),adminCookie.options);return Response.json({ok:true})}
export async function DELETE(){(await cookies()).set(adminCookie.name,"",{...adminCookie.options,maxAge:0});return Response.json({ok:true})}
