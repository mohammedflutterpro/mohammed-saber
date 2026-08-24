import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Mohammed Saber | IT Portfolio",description:"IT Technical Support Specialist and Systems & Infrastructure portfolio in Riyadh, Saudi Arabia.",openGraph:{title:"Mohammed Saber | IT Portfolio",description:"Reliable IT support, systems, and infrastructure.",type:"website"},icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
