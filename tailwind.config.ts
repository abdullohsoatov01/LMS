import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

// Zukko brand "Quyosh": orange #FF6A13, indigo #1D1B4B, light #FFF5EB.
// Dark mode ("Tungi") works by mirroring these palettes through CSS variables:
// in .dark, shade 50 becomes 950, 100 becomes 900, and so on. So bg-zinc-50 turns dark and
// text-zinc-900 turns light without writing dark: variants everywhere.
const FAMILIES = ["zinc", "emerald", "amber", "rose", "violet", "orange", "sky"] as const;
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function paletteVars(dark: boolean) {
  const vars: Record<string, string> = {};
  for (const family of FAMILIES) {
    SHADES.forEach((shade, i) => {
      const source = dark ? SHADES[SHADES.length - 1 - i] : shade;
      vars[`--c-${family}-${shade}`] = rgb((colors[family] as Record<number, string>)[source]);
    });
  }
  return vars;
}

const mirrored = Object.fromEntries(
  FAMILIES.map((family) => [
    family,
    Object.fromEntries(SHADES.map((shade) => [shade, `rgb(var(--c-${family}-${shade}) / <alpha-value>)`])),
  ]),
);

const themed = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-unbounded)", "var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        ...mirrored,
        primary: {
          DEFAULT: "#ff6a13",
          hover: "#e85a08",
          text: themed("primary-text"),
          soft: themed("primary-soft"),
          ring: themed("primary-ring"),
        },
        sidebar: { DEFAULT: "#1d1b4b", accent: "#2a2862", border: "#3b3978", fg: "#f6f5ff", muted: "#aeacd8" },
        page: themed("page"),
        surface: themed("surface"),
      },
      keyframes: {
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shake: "shake 0.3s ease-in-out 2",
        pop: "pop 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": {
          ...paletteVars(false),
          "--page": "255 245 235",
          "--surface": "255 255 255",
          "--primary-text": "194 73 10",
          "--primary-soft": "255 234 219",
          "--primary-ring": "255 201 166",
        },
        ".dark": {
          ...paletteVars(true),
          "--page": "18 17 46",
          "--surface": "29 27 75",
          "--primary-text": "255 138 71",
          "--primary-soft": "66 38 52",
          "--primary-ring": "122 53 16",
          "color-scheme": "dark",
        },
      });
    }),
  ],
} satisfies Config;
