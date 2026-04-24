import { Archetype, PaintRegion } from "@/lib/creature-data";

interface CreatureSilhouetteProps {
  archetype: Archetype;
  regions: PaintRegion[];
  highlightedRegion?: number | null;
  className?: string;
}

// Hand-crafted SVG paths for each archetype on a 100x100 viewBox
// Designed to read instantly while leaving paint regions discoverable
const ARCHETYPE_PATHS: Record<Archetype, string> = {
  theropod:
    "M8 62 Q12 50 22 48 L30 35 Q35 25 48 22 Q60 20 68 26 Q75 30 78 38 L88 42 Q92 46 90 52 L80 56 Q76 62 70 64 L66 78 Q64 84 58 84 L54 82 L52 70 L40 70 L38 82 Q36 86 30 86 L26 84 L26 70 Q18 70 14 66 Z",
  small_theropod:
    "M14 70 Q18 60 26 58 L32 48 Q38 42 48 42 Q58 42 64 48 L72 52 Q76 56 74 60 L66 62 L64 70 L60 78 L56 78 L56 70 L44 70 L44 78 L40 78 L38 70 Q24 72 18 74 Z",
  sauropod:
    "M6 70 Q10 60 20 58 L30 56 L40 54 L50 52 Q58 48 64 38 Q70 26 80 22 Q88 22 88 30 Q86 38 78 44 L74 56 L70 68 Q70 76 64 76 L60 74 L58 64 L36 64 L34 76 Q32 80 26 80 L22 78 L22 64 Q12 64 8 76 Z",
  quadruped:
    "M10 60 Q14 48 26 46 L36 42 Q44 36 56 36 Q70 36 78 42 L86 48 Q90 54 86 60 L78 62 Q76 70 70 70 L66 68 L64 60 L36 60 L34 68 Q32 72 26 72 L22 70 L22 60 Z",
  mammal:
    "M10 64 Q14 54 24 52 L34 50 Q42 44 54 44 Q66 44 74 50 L84 54 Q88 60 84 64 L80 64 L78 70 Q76 74 70 74 L68 72 L66 64 L34 64 L32 72 Q30 76 24 76 L20 74 L20 64 Z",
  small_mammal:
    "M22 70 Q26 60 36 58 L44 54 Q50 50 58 52 L66 56 Q72 60 70 66 L66 68 L64 74 L60 76 L58 70 L40 70 L38 76 L34 76 L34 70 Z",
  flyer:
    "M50 30 L20 18 Q10 18 14 28 L36 44 L26 50 L40 52 L40 64 L46 70 L54 70 L60 64 L60 52 L74 50 L64 44 L86 28 Q90 18 80 18 Z",
  small_flyer:
    "M50 36 L28 26 Q22 26 26 34 L40 44 L36 50 L46 52 L46 60 L54 60 L54 52 L64 50 L60 44 L74 34 Q78 26 72 26 Z",
  aquatic_fish:
    "M14 50 Q24 30 50 30 Q72 30 82 44 L94 36 L92 56 L82 60 Q72 70 50 70 Q24 70 14 50 Z",
  aquatic_long:
    "M6 56 Q14 40 30 38 L48 36 Q66 30 78 22 Q88 18 92 24 Q92 32 82 36 L70 44 Q62 56 48 60 L30 62 Q14 64 8 70 Z",
  aquatic_squid:
    "M50 18 Q72 18 78 36 Q78 50 70 56 L66 80 L62 90 L58 86 L58 70 L52 90 L50 92 L48 90 L48 70 L44 86 L40 90 L38 80 L34 56 Q26 50 26 36 Q32 18 50 18 Z",
  biped:
    "M40 16 Q56 16 60 28 L60 38 L70 44 Q74 48 70 52 L62 50 L62 62 L66 78 L62 80 L58 78 L54 64 L46 64 L42 78 L38 80 L34 78 L38 62 L38 50 L30 52 Q26 48 30 44 L40 38 Z",
  ape:
    "M40 14 Q60 14 64 28 L62 38 L74 44 Q78 50 72 54 L66 54 L66 70 L70 80 L66 82 L60 76 L56 64 L44 64 L40 76 L34 82 L30 80 L34 70 L34 54 L28 54 Q22 50 26 44 L38 38 Z",
  lizard:
    "M8 60 L18 56 L26 50 Q34 44 46 44 Q60 44 70 50 L84 56 Q92 60 88 66 L80 64 L78 68 L74 66 L72 60 L26 60 L24 66 L20 68 L18 64 Z",
  turtle:
    "M14 56 Q14 38 50 36 Q86 38 86 56 Q86 68 80 70 L74 72 L70 78 L66 76 L64 72 L36 72 L34 76 L30 78 L26 72 L20 70 Q14 68 14 56 Z",
  insect:
    "M50 18 Q56 18 56 24 L54 30 L66 28 Q72 30 72 36 L68 42 L78 46 Q82 52 76 56 L66 56 L72 64 Q72 70 64 70 L56 64 L54 78 L50 84 L46 78 L44 64 L36 70 Q28 70 28 64 L34 56 L24 56 Q18 52 22 46 L32 42 L28 36 Q28 30 34 28 L46 30 L44 24 Q44 18 50 18 Z",
  spider:
    "M22 30 L36 44 L26 56 L22 50 M78 30 L64 44 L74 56 L78 50 M16 60 L34 56 L28 70 L18 70 M84 60 L66 56 L72 70 L82 70 M50 36 Q62 36 64 48 Q64 60 50 64 Q36 60 36 48 Q38 36 50 36 Z",
  scorpion:
    "M16 44 L28 40 L26 36 L20 34 M84 44 L72 40 L74 36 L80 34 M30 56 Q40 50 50 50 Q60 50 70 56 L78 60 L74 70 L70 64 L60 60 L40 60 L30 64 L26 70 L22 60 Z M50 36 Q56 36 56 42 L50 48 L44 42 Q44 36 50 36 Z M30 60 L20 70 L14 80 L20 82 L26 76 L34 70 Z",
  worm:
    "M14 50 Q14 40 26 38 L70 38 Q86 40 86 50 Q86 60 70 62 L26 62 Q14 60 14 50 Z M22 44 L22 56 M34 42 L34 58 M46 42 L46 58 M58 42 L58 58 M70 44 L70 56",
  snake:
    "M14 70 Q24 50 38 56 Q52 64 64 50 Q76 36 86 44 L88 50 Q82 56 76 56 Q66 70 50 66 Q34 60 24 76 Z M82 38 L88 32 L82 28 L78 32 Z",
  blob:
    "M22 42 Q22 24 50 24 Q78 24 78 42 L80 60 Q80 78 50 78 Q20 78 20 60 Z",
  human:
    "M50 14 Q58 14 58 22 Q58 30 50 30 Q42 30 42 22 Q42 14 50 14 Z M40 32 L60 32 L62 56 L58 80 L52 80 L52 60 L48 60 L48 80 L42 80 L38 56 Z M38 36 L30 56 L34 56 L42 42 M62 36 L70 56 L66 56 L58 42",
  tek_mech:
    "M40 16 L60 16 L66 28 L66 38 L78 42 L82 50 L78 56 L66 54 L66 66 L70 78 L62 80 L58 70 L42 70 L38 80 L30 78 L34 66 L34 54 L22 56 L18 50 L22 42 L34 38 L34 28 Z M44 22 L56 22 L56 28 L44 28 Z",
  armor:
    "M30 18 L70 18 L74 26 L74 50 L70 54 L66 70 L34 70 L30 54 L26 50 L26 26 Z",
  saddle:
    "M14 50 Q24 38 50 38 Q76 38 86 50 L82 60 L74 60 L70 70 L30 70 L26 60 L18 60 Z",
  structure:
    "M20 20 L80 20 L80 80 L20 80 Z",
};

const CreatureSilhouette = ({
  archetype,
  regions,
  highlightedRegion,
  className,
}: CreatureSilhouetteProps) => {
  const path = ARCHETYPE_PATHS[archetype] ?? ARCHETYPE_PATHS.theropod;

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="silhouette-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
        </linearGradient>
        <pattern id="silhouette-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.2" />
        </pattern>
      </defs>

      {/* Background grid for blueprint feel */}
      <rect width="100" height="100" fill="url(#silhouette-grid)" />

      {/* Silhouette body */}
      <path
        d={path}
        fill="url(#silhouette-gradient)"
        stroke="hsl(var(--primary))"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* Region overlays — drawn on top of silhouette */}
      {regions.map((r) => {
        if (!r.hint) return null;
        const isHighlighted = highlightedRegion === r.index;
        return (
          <g key={r.index}>
            <rect
              x={r.hint.x * 100}
              y={r.hint.y * 100}
              width={r.hint.w * 100}
              height={r.hint.h * 100}
              fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--accent))"}
              fillOpacity={isHighlighted ? 0.55 : 0.18}
              stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--accent-foreground))"}
              strokeWidth={isHighlighted ? 0.8 : 0.4}
              strokeDasharray={isHighlighted ? "0" : "1.2 1"}
              rx="1"
            />
            <text
              x={r.hint.x * 100 + 1.2}
              y={r.hint.y * 100 + 4}
              fontSize="3"
              fill={isHighlighted ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
              fontWeight={isHighlighted ? 700 : 500}
              opacity={isHighlighted ? 1 : 0.7}
            >
              R{r.index}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default CreatureSilhouette;
