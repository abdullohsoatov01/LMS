// Zukko the cat, drawn as SVG strings so the same art works in server and client components.
// Poses: "lie" (relaxed, proud: the default), "sit" (waving hello), "jump" (celebrating), "head" (icon).

export type MascotPose = "lie" | "sit" | "jump" | "head";
export type MascotFace = "proud" | "happy" | "kind" | "think" | "wow" | "cool";

const O = "#ff6a13"; // orange fur
const I = "#1d1b4b"; // indigo outline
const C = "#fff5eb"; // cream belly and paws
const W = "#ffffff";
const S = "#d9530a"; // stripes
const P = "#ffc2a1"; // inner ears, cheeks
const G = "#ffd23f"; // gold sparkle

const line = `stroke="${I}" stroke-width="3" stroke-linejoin="round"`;

// Face parts in head-local coordinates: lenses are centered at (52,78) and (82,74).
const SMUG = `<path d="M57 101 q11 10 24 -4" fill="none" stroke="${I}" stroke-width="3.2" stroke-linecap="round"/><path d="M81 97 l3 -2" stroke="${I}" stroke-width="3" stroke-linecap="round"/>`;
const PROUD_BROWS = `<path d="M38 57 q11 -7 24 -2 M70 53 q11 -6 22 1" fill="none" stroke="${I}" stroke-width="4" stroke-linecap="round"/>`;
const halfLid = (x: number, y: number) =>
  `<circle cx="${x + 1}" cy="${y + 3}" r="5.5" fill="${I}"/><circle cx="${x + 3}" cy="${y + 1.5}" r="1.8" fill="${W}"/>` +
  `<path d="M${x - 11} ${y - 1} q11 -3 22 0" fill="none" stroke="${I}" stroke-width="3.5" stroke-linecap="round"/>`;

type Face = { eyes: string; mouth: string; brows?: string; shades?: boolean };

const FACES: Record<MascotFace, Face> = {
  proud: { eyes: halfLid(52, 78) + halfLid(82, 74), mouth: SMUG, brows: PROUD_BROWS },
  happy: {
    eyes: `<path d="M44 81 q8 -10 16 0 M74 77 q8 -10 16 0" fill="none" stroke="${I}" stroke-width="4.5" stroke-linecap="round"/>`,
    mouth: `<path d="M57 98 q12 15 24 0 z" fill="${I}"/><path d="M63 104 q5 4 11 0 q-5 5 -11 0z" fill="${P}"/>`,
  },
  kind: {
    eyes: `<path d="M45 78 q7 6 14 0 M75 74 q7 6 14 0" fill="none" stroke="${I}" stroke-width="4.5" stroke-linecap="round"/>`,
    mouth: `<path d="M68 100 q-5 5 -9 1 M68 100 q5 5 9 1" fill="none" stroke="${I}" stroke-width="3" stroke-linecap="round"/>`,
  },
  think: {
    eyes: `<circle cx="56" cy="73" r="5.5" fill="${I}"/><circle cx="86" cy="69" r="5.5" fill="${I}"/><circle cx="58" cy="71" r="1.8" fill="${W}"/><circle cx="88" cy="67" r="1.8" fill="${W}"/>`,
    mouth: `<path d="M63 103 q6 -3 12 1" fill="none" stroke="${I}" stroke-width="3" stroke-linecap="round"/>`,
    brows: `<path d="M38 59 q11 -3 24 0 M70 51 q11 -7 22 -1" fill="none" stroke="${I}" stroke-width="4" stroke-linecap="round"/>`,
  },
  wow: {
    eyes: `<circle cx="52" cy="78" r="8" fill="${I}"/><circle cx="82" cy="74" r="8" fill="${I}"/><circle cx="55" cy="75" r="2.6" fill="${W}"/><circle cx="85" cy="71" r="2.6" fill="${W}"/>`,
    mouth: `<ellipse cx="69" cy="104" rx="5" ry="6" fill="${I}"/>`,
    brows: `<path d="M38 54 q11 -6 24 -2 M70 50 q11 -5 22 1" fill="none" stroke="${I}" stroke-width="4" stroke-linecap="round"/>`,
  },
  cool: { shades: true, eyes: "", mouth: SMUG, brows: PROUD_BROWS },
};

// Little effects drawn next to the head (svg coordinates of the lying pose).
const EXTRAS: Partial<Record<MascotFace, string>> = {
  think: `<circle cx="128" cy="40" r="5" fill="${C}" stroke="${I}" stroke-width="2"/><circle cx="142" cy="24" r="10" fill="${C}" stroke="${I}" stroke-width="2"/><text x="142" y="29" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="${I}">?</text>`,
  wow: `<path d="M128 26 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="${O}"/><path d="M12 30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="${O}"/>`,
  happy: `<path d="M126 34 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="${O}"/>`,
  cool: `<path d="M126 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="${G}"/>`,
  proud: `<path d="M124 40 q4 -6 8 0 M134 30 q4 -6 8 0" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`,
};

const DOPPI = `<path d="M36 50 L42 24 Q66 15 90 21 L97 45 Q66 37 36 50 Z" fill="${I}"/><path d="M36 50 Q66 37 97 45" fill="none" stroke="${C}" stroke-width="3"/><path d="M50 38 q5 -9 11 -2 q-2 7 -11 2z M74 34 q5 -9 11 -2 q-2 7 -11 2z M62 27 q4 -7 9 -1 q-2 5 -9 1z" fill="${W}"/>`;

function head(face: MascotFace, hat: boolean, tilt: number) {
  const f = FACES[face];
  const lenses = f.shades
    ? `<circle cx="52" cy="78" r="14" fill="${I}" stroke="${I}" stroke-width="4"/><circle cx="82" cy="74" r="14" fill="${I}" stroke="${I}" stroke-width="4"/><path d="M44 74 l8 -7 M74 70 l8 -7" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`
    : `<circle cx="52" cy="78" r="14" fill="${W}" stroke="${I}" stroke-width="4"/><circle cx="82" cy="74" r="14" fill="${W}" stroke="${I}" stroke-width="4"/>`;
  return `<g transform="rotate(${tilt} 66 80)">
    <path d="M26 66 L28 26 L56 46 Z" fill="${O}" ${line}/><path d="M33 56 L34 36 L50 47 Z" fill="${P}"/>
    <path d="M80 42 L104 22 L108 62 Z" fill="${O}" ${line}/><path d="M88 44 L101 32 L103 54 Z" fill="${P}"/>
    <ellipse cx="66" cy="80" rx="47" ry="40" fill="${O}" ${line}/>
    <path d="M66 41 v10 M55 44 l3 9 M77 44 l-3 9" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="69" cy="101" rx="22" ry="14" fill="${C}"/>
    <ellipse cx="36" cy="96" rx="6" ry="3.5" fill="${P}"/><ellipse cx="100" cy="92" rx="6" ry="3.5" fill="${P}"/>
    <path d="M48 100 L26 98 M48 105 L27 108 M90 96 L112 92 M90 101 L112 102" stroke="${I}" stroke-width="2" stroke-linecap="round" opacity=".55"/>
    ${lenses}
    <path d="M66 75 q2 -3 2 -3 M38 76 L24 72 M96 72 L110 66" fill="none" stroke="${I}" stroke-width="4" stroke-linecap="round"/>
    ${f.eyes}${f.brows ?? ""}
    <path d="M63 92 h11 l-5.5 6 z" fill="${I}" stroke="${I}" stroke-width="2" stroke-linejoin="round"/>
    ${f.mouth}
    ${hat ? DOPPI : ""}
  </g>`;
}

/** A limb: outlined orange stroke ending in a cream paw. */
function limb(d: string, pawX: number, pawY: number, pawRotate = 0) {
  return `<path d="${d}" fill="none" stroke="${I}" stroke-width="19" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${O}" stroke-width="13" stroke-linecap="round"/>
    <ellipse cx="${pawX}" cy="${pawY}" rx="12" ry="9.5" fill="${C}" ${line} transform="rotate(${pawRotate} ${pawX} ${pawY})"/>`;
}

function tail(d: string, cls: string) {
  return `<g class="${cls}"><path d="${d}" fill="none" stroke="${I}" stroke-width="19" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${O}" stroke-width="13" stroke-linecap="round"/></g>`;
}

function lie(face: MascotFace, hat: boolean, animate: boolean) {
  return `<svg viewBox="-12 -8 300 198" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="178" rx="118" ry="8" fill="${I}" opacity=".08"/>
    ${tail("M232 132 C272 128 276 84 250 76", animate ? "zk-tail" : "")}
    <g class="${animate ? "zk-belly" : ""}">
      <ellipse cx="152" cy="120" rx="100" ry="58" fill="${O}" ${line}/>
      <path d="M196 84 l-6 12 M212 92 l-8 10 M226 104 l-9 8" stroke="${S}" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="150" cy="118" rx="70" ry="50" fill="${C}"/>
      <path d="M146 130 q6 4 12 0" fill="none" stroke="${P}" stroke-width="3" stroke-linecap="round"/>
    </g>
    <ellipse cx="236" cy="160" rx="18" ry="12" fill="${C}" ${line}/><ellipse cx="214" cy="170" rx="16" ry="10" fill="${C}" ${line}/>
    ${limb("M196 86 Q186 66 164 70", 160, 72)}
    <g transform="translate(66 100) scale(1.22) translate(-66 -100)">${head(face, hat, -16)}</g>
    ${limb("M112 150 Q56 182 42 128", 40, 120, -24)}
    ${EXTRAS[face] ?? ""}
  </svg>`;
}

function upright(face: MascotFace, hat: boolean, animate: boolean, jumping: boolean) {
  const lift = jumping ? -12 : 0;
  const arms = jumping
    ? limb("M56 146 Q30 122 30 90", 30, 84) + limb("M144 146 Q170 122 170 90", 170, 84)
    : limb("M146 146 Q160 176 132 178", 128, 176) + limb("M54 146 Q28 126 32 94", 32, 88, -10);
  const feet = jumping
    ? `<ellipse cx="76" cy="214" rx="17" ry="10" fill="${C}" ${line} transform="rotate(14 76 214)"/><ellipse cx="124" cy="214" rx="17" ry="10" fill="${C}" ${line} transform="rotate(-14 124 214)"/>`
    : `<ellipse cx="72" cy="218" rx="18" ry="10" fill="${C}" ${line}/><ellipse cx="128" cy="218" rx="18" ry="10" fill="${C}" ${line}/>`;
  return `<svg viewBox="0 -14 200 248" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="228" rx="${jumping ? 46 : 70}" ry="7" fill="${I}" opacity="${jumping ? 0.05 : 0.08}"/>
    <g class="${animate && jumping ? "zk-bounce" : ""}" transform="translate(0 ${lift})">
      ${tail(jumping ? "M148 190 C188 186 196 130 172 116" : "M150 204 C194 204 200 152 176 140", animate ? "zk-tail" : "")}
      <ellipse cx="100" cy="162" rx="66" ry="60" fill="${O}" ${line}/>
      <ellipse cx="100" cy="172" rx="46" ry="44" fill="${C}"/>
      <path d="M94 182 q6 4 12 0" fill="none" stroke="${P}" stroke-width="3" stroke-linecap="round"/>
      ${feet}
      <g transform="translate(100 74) scale(1.25) translate(-66 -80)">${head(face, hat, jumping ? 0 : -6)}</g>
      ${arms}
      <g transform="translate(34 -10)">${EXTRAS[face] ?? ""}</g>
    </g>
  </svg>`;
}

export function mascotSvg({
  pose = "lie",
  face = "proud",
  hat = false,
  animate = false,
}: {
  pose?: MascotPose;
  face?: MascotFace;
  hat?: boolean;
  animate?: boolean;
} = {}) {
  if (pose === "head") {
    return `<svg viewBox="6 8 124 122" xmlns="http://www.w3.org/2000/svg">${head(face, hat, -8)}</svg>`;
  }
  if (pose === "lie") return lie(face, hat, animate);
  return upright(face, hat, animate, pose === "jump");
}
