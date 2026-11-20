import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import "./globals.css";

// Every page depends on the logged-in user, so never prerender at build time.
export const dynamic = "force-dynamic";

const manrope = Manrope({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-manrope" });
const unbounded = Unbounded({ subsets: ["latin", "latin-ext", "cyrillic"], weight: ["600", "700", "800"], variable: "--font-unbounded" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Zukko — AI bilan zukko bo'l!",
  description: "Zukko: o'quvchilar uchun sun'iy intellekt va prompt muhandisligi kurslari",
};

// Applies the saved theme before first paint, so dark mode doesn't flash white.
const THEME_SCRIPT = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${manrope.variable} ${unbounded.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
