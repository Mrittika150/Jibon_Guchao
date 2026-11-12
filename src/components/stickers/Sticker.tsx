import { useState, type CSSProperties, type ReactNode } from "react";

// Original stickers drawn for Jibon Guchao. Each sticker has:
//   shape: the outline only, drawn thick and white behind it (the "die-cut" sticker edge)
//   art:   the coloured drawing on top
const INK = "#4a2c3a";
const BLUSH = "#ff7aa8";

const HEART = "M32 54 C12 41 5 30 10 19 C15 9 27 10 32 20 C37 10 49 9 54 19 C59 30 52 41 32 54 Z";
const STRAWBERRY = "M32 58 C18 52 11 39 14 27 C17 19 26 18 32 21 C38 18 47 19 50 27 C53 39 46 52 32 58 Z";
const DROP = "M32 6 C32 6 14 28 14 40 C14 50 22 58 32 58 C42 58 50 50 50 40 C50 28 32 6 32 6 Z";
const CLOUD = "M17 47 C8 47 6 37 13 34 C12 25 22 21 28 26 C31 17 45 17 47 27 C55 26 60 34 55 40 C58 45 54 48 49 47 Z";
const SPARKLE = "M32 5 C34 22 42 30 59 32 C42 34 34 42 32 59 C30 42 22 34 5 32 C22 30 30 22 32 5 Z";
const STAR = "M32 7 L39 23 L57 25 L43 37 L48 55 L32 45 L16 55 L21 37 L7 25 L25 23 Z";
const BOW_LEFT = "M30 30 C20 17 7 20 7 30 C7 40 20 43 30 35 Z";
const BOW_RIGHT = "M34 30 C44 17 57 20 57 30 C57 40 44 43 34 35 Z";
const BOW_TAILS = "M29 35 L21 53 L27 50 L31 55 L32 37 L33 55 L37 50 L43 53 L35 35 Z";

const MILK = "M18 22 L24 10 L40 10 L46 22 L46 56 L18 56 Z";
const MOCHA_CUP = "M17 28 L47 28 L43 54 Q42 57 39 57 L25 57 Q22 57 21 54 Z";
const MOCHA_CREAM = "M14 29 C13 22 19 19 24 21 C26 13 38 13 40 21 C45 19 51 22 50 29 Z";
const BAT_WING_LEFT = "M22 31 C15 22 6 24 4 31 C8 30 10 34 12 38 C15 35 18 36 22 39 Z";
const BAT_WING_RIGHT = "M42 31 C49 22 58 24 60 31 C56 30 54 34 52 38 C49 35 46 36 42 39 Z";

// Two eyes, a little smile and pink cheeks
function Face({ x, y, ink = INK }: { x: number; y: number; ink?: string }) {
  return (
    <g>
      <circle cx={x - 6} cy={y} r={2.2} fill={ink} />
      <circle cx={x + 6} cy={y} r={2.2} fill={ink} />
      <path d={`M${x - 3} ${y + 4} Q${x} ${y + 7} ${x + 3} ${y + 4}`} stroke={ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <ellipse cx={x - 10} cy={y + 4} rx={3} ry={1.8} fill={BLUSH} opacity={0.7} />
      <ellipse cx={x + 10} cy={y + 4} rx={3} ry={1.8} fill={BLUSH} opacity={0.7} />
    </g>
  );
}

const line = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const STICKERS = {
  heart: {
    shape: <path d={HEART} />,
    art: (
      <>
        <path d={HEART} fill="#ff8fb8" {...line} />
        <ellipse cx={18} cy={21} rx={3.5} ry={2.2} fill="#fff" opacity={0.8} transform="rotate(-35 18 21)" />
        <Face x={32} y={30} />
      </>
    ),
  },
  strawberry: {
    shape: (
      <>
        <path d={STRAWBERRY} />
        <path d="M19 23 L25 13 L32 19 L39 13 L45 23 Z" />
      </>
    ),
    art: (
      <>
        <path d={STRAWBERRY} fill="#ff6b8b" {...line} />
        {[
          [22, 30],
          [42, 30],
          [20, 41],
          [44, 41],
          [27, 50],
          [37, 50],
        ].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={1.2} ry={1.8} fill="#ffe08a" />
        ))}
        <path d="M19 23 L25 13 L32 19 L39 13 L45 23 Q32 27 19 23 Z" fill="#7ccf8a" {...line} />
        <path d="M32 19 Q31 11 35 7" fill="none" {...line} />
        <Face x={32} y={37} />
      </>
    ),
  },
  drop: {
    shape: <path d={DROP} />,
    art: (
      <>
        <path d={DROP} fill="#9fd8ff" {...line} />
        <ellipse cx={23} cy={33} rx={2.5} ry={5} fill="#fff" opacity={0.8} transform="rotate(25 23 33)" />
        <Face x={32} y={41} />
      </>
    ),
  },
  cloud: {
    shape: <path d={CLOUD} />,
    art: (
      <>
        <path d={CLOUD} fill="#dcecff" {...line} />
        <Face x={32} y={37} />
      </>
    ),
  },
  sparkle: {
    shape: <path d={SPARKLE} />,
    art: (
      <>
        <path d={SPARKLE} fill="#ffd86b" {...line} />
        <path d="M32 18 C33 26 36 30 42 32" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
      </>
    ),
  },
  star: {
    shape: <path d={STAR} />,
    art: (
      <>
        <path d={STAR} fill="#ffd86b" {...line} />
        <Face x={32} y={35} />
      </>
    ),
  },
  bow: {
    shape: (
      <>
        <path d={BOW_LEFT} />
        <path d={BOW_RIGHT} />
        <path d={BOW_TAILS} />
      </>
    ),
    art: (
      <>
        <path d={BOW_TAILS} fill="#f472b6" {...line} />
        <path d={BOW_LEFT} fill="#f9a8d4" {...line} />
        <path d={BOW_RIGHT} fill="#f9a8d4" {...line} />
        <path d="M14 30 Q19 27 24 31" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        <rect x={26} y={25} width={12} height={14} rx={5} fill="#f472b6" {...line} />
      </>
    ),
  },
  flower: {
    shape: (
      <>
        {[
          [32, 16],
          [47, 27],
          [41, 45],
          [23, 45],
          [17, 27],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={10} />
        ))}
      </>
    ),
    art: (
      <>
        {[
          [32, 16],
          [47, 27],
          [41, 45],
          [23, 45],
          [17, 27],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={10} fill="#ffb3d1" {...line} />
        ))}
        <circle cx={32} cy={32} r={11} fill="#ffe08a" {...line} />
        <Face x={32} y={31} />
      </>
    ),
  },
  bunny: {
    shape: (
      <>
        <ellipse cx={24} cy={17} rx={6} ry={13} />
        <ellipse cx={40} cy={17} rx={6} ry={13} />
        <ellipse cx={32} cy={40} rx={19} ry={16} />
      </>
    ),
    art: (
      <>
        <ellipse cx={24} cy={17} rx={6} ry={13} fill="#fff" {...line} />
        <ellipse cx={40} cy={17} rx={6} ry={13} fill="#fff" {...line} />
        <ellipse cx={24} cy={18} rx={2.5} ry={8} fill="#ffc2d8" />
        <ellipse cx={40} cy={18} rx={2.5} ry={8} fill="#ffc2d8" />
        <ellipse cx={32} cy={40} rx={19} ry={16} fill="#fff" {...line} />
        <Face x={32} y={39} />
      </>
    ),
  },
  milk: {
    shape: <path d={MILK} />,
    art: (
      <>
        <path d={MILK} fill="#ffffff" {...line} />
        <path d="M18 22 L46 22" fill="none" {...line} />
        <rect x={18} y={41} width={28} height={9} fill="#9fd8ff" />
        <path d={HEART} fill="#ff8fb8" transform="translate(28 42) scale(0.13)" />
        <path d={MILK} fill="none" {...line} />
        <Face x={32} y={30} />
      </>
    ),
  },
  mocha: {
    shape: (
      <>
        <path d={MOCHA_CUP} />
        <path d={MOCHA_CREAM} />
        <path d="M46 33 C56 33 56 47 44 47" fill="none" strokeWidth={13} />
      </>
    ),
    art: (
      <>
        <path d="M46 33 C55 33 55 47 44 47" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M46 33 C55 33 55 47 44 47" fill="none" stroke="#c98f6b" strokeWidth={2.5} strokeLinecap="round" />
        <path d={MOCHA_CUP} fill="#c98f6b" {...line} />
        <path d={MOCHA_CREAM} fill="#fff7ef" {...line} />
        <Face x={32} y={40} />
      </>
    ),
  },
  bear: {
    shape: (
      <>
        <circle cx={17} cy={19} r={8} />
        <circle cx={47} cy={19} r={8} />
        <ellipse cx={32} cy={37} rx={22} ry={19} />
      </>
    ),
    art: (
      <>
        <circle cx={17} cy={19} r={8} fill="#fff3e0" {...line} />
        <circle cx={47} cy={19} r={8} fill="#fff3e0" {...line} />
        <circle cx={17} cy={19} r={3.5} fill="#ffd0dc" />
        <circle cx={47} cy={19} r={3.5} fill="#ffd0dc" />
        <ellipse cx={32} cy={37} rx={22} ry={19} fill="#fff3e0" {...line} />
        <ellipse cx={32} cy={41} rx={2.2} ry={1.6} fill={INK} />
        <Face x={32} y={36} />
      </>
    ),
  },
  bat: {
    shape: (
      <>
        <path d={BAT_WING_LEFT} />
        <path d={BAT_WING_RIGHT} />
        <path d="M24 25 L26 15 L31 23 Z M40 25 L38 15 L33 23 Z" />
        <circle cx={32} cy={35} r={13} />
      </>
    ),
    art: (
      <>
        <path d={BAT_WING_LEFT} fill="#4b3d63" {...line} />
        <path d={BAT_WING_RIGHT} fill="#4b3d63" {...line} />
        <path d="M24 25 L26 15 L31 23 Z M40 25 L38 15 L33 23 Z" fill="#4b3d63" {...line} />
        <circle cx={32} cy={35} r={13} fill="#4b3d63" {...line} />
        <path d={BOW_LEFT} fill="#ff8fb8" stroke={INK} strokeWidth={4} strokeLinejoin="round" transform="translate(30 10) scale(0.32)" />
        <path d={BOW_RIGHT} fill="#ff8fb8" stroke={INK} strokeWidth={4} strokeLinejoin="round" transform="translate(30 10) scale(0.32)" />
        <Face x={32} y={35} ink="#ffffff" />
      </>
    ),
  },
} satisfies Record<string, { shape: ReactNode; art: ReactNode }>;

export type StickerName = keyof typeof STICKERS;

type StickerProps = {
  name: StickerName;
  className?: string;
  style?: CSSProperties;
};

// Your own sticker pictures, kept only on your computer (the folder is in .gitignore).
// A file named after a sticker (milk.png, mocha.png, bat.png...) replaces that drawing.
const MY_STICKERS = import.meta.glob<string>("../../assets/my-stickers/*.{png,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});

function myStickerUrl(name: StickerName): string | undefined {
  for (const [path, url] of Object.entries(MY_STICKERS)) {
    const fileName = path.split("/").pop() ?? "";
    if (fileName.replace(/\.(png|webp|gif)$/, "") === name) return url;
  }
  return undefined;
}

// Stickers are decoration, so screen readers skip them (aria-hidden)
export function Sticker({ name, className = "", style }: StickerProps) {
  const myUrl = myStickerUrl(name);
  // If your picture can't be opened (broken file, odd format), fall back to the drawing
  const [imageFailed, setImageFailed] = useState(false);

  if (myUrl && !imageFailed) {
    return (
      <img
        src={myUrl}
        alt=""
        aria-hidden="true"
        draggable={false}
        onError={() => setImageFailed(true)}
        className={`sticker object-contain ${className}`}
        style={style}
      />
    );
  }

  const sticker = STICKERS[name];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={`sticker ${className}`} style={style}>
      <g fill="#fff" stroke="#fff" strokeWidth={7} strokeLinejoin="round">
        {sticker.shape}
      </g>
      {sticker.art}
    </svg>
  );
}
