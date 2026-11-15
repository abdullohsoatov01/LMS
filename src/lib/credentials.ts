import { randomInt } from "crypto";

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "x", ц: "ts", ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
  ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

function toAscii(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => CYRILLIC[ch] ?? ch)
    .join("")
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "");
}

/** "Aziz Karimov" → "aziz.k" */
export function usernameBase(fullName: string) {
  const parts = fullName.trim().split(/\s+/).map(toAscii).filter(Boolean);
  if (parts.length === 0) return "oquvchi";
  const first = parts[0].slice(0, 16);
  return parts[1] ? `${first}.${parts[1][0]}` : first;
}

export const USERNAME_RE = /^[a-z0-9._-]{3,32}$/;

const WORDS = [
  "olma", "anor", "quyosh", "yulduz", "bulut", "daryo", "kitob", "robot", "lola", "tulpor",
  "burgut", "kamalak", "sher", "oy", "tog", "dengiz", "gilos", "uzum", "qalam", "raketa",
];

/** Easy to type for kids: "robotlola427" */
export function generatePassword() {
  const w1 = WORDS[randomInt(WORDS.length)];
  const w2 = WORDS[randomInt(WORDS.length)];
  return `${w1}${w2}${randomInt(100, 1000)}`;
}
