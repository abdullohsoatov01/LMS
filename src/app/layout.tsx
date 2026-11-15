import type { Metadata } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";

// Every page depends on the logged-in user, so never prerender at build time.
export const dynamic = "force-dynamic";

const nunito =Nunito({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-nunito" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Maktab AI — sun'iy intellektni o'rganamiz",
  description: "Maktab o'quvchilari uchun sun'iy intellekt va prompt muhandisligi kurslari",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${nunito.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
