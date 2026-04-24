import { useState } from "react";
import { Beef, Leaf, Fish, Bug, Droplet, ShieldAlert, Heart, Eye, AlertTriangle } from "lucide-react";
import CreatureSilhouette from "./CreatureSilhouette";
import { CreatureInfo, Diet, Temperament } from "@/lib/creature-data";
import { getColorByIndex } from "@/lib/ark-palette";

interface CreatureDisplayProps {
  name: string;
  info: CreatureInfo;
  // Optional: a map of region index → currently-applied dye index from user's image
  appliedDyes?: Record<number, number>;
}

const DIET_META: Record<Diet, { icon: React.ReactNode; color: string }> = {
  Carnivore: { icon: <Beef className="w-3.5 h-3.5" />, color: "text-red-400" },
  Herbivore: { icon: <Leaf className="w-3.5 h-3.5" />, color: "text-green-400" },
  Omnivore: { icon: <Beef className="w-3.5 h-3.5" />, color: "text-orange-400" },
  Piscivore: { icon: <Fish className="w-3.5 h-3.5" />, color: "text-cyan-400" },
  Insectivore: { icon: <Bug className="w-3.5 h-3.5" />, color: "text-yellow-400" },
  Sanguinivore: { icon: <Droplet className="w-3.5 h-3.5" />, color: "text-rose-500" },
  "N/A": { icon: <span className="w-3.5 h-3.5" />, color: "text-muted-foreground" },
};

const TEMPER_META: Record<Temperament, { icon: React.ReactNode; color: string }> = {
  Aggressive: { icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "text-red-400" },
  Hostile: { icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "text-red-500" },
  "Short-Tempered": { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-orange-400" },
  Territorial: { icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "text-orange-400" },
  Defensive: { icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "text-yellow-400" },
  Reactive: { icon: <Eye className="w-3.5 h-3.5" />, color: "text-yellow-400" },
  Skittish: { icon: <Eye className="w-3.5 h-3.5" />, color: "text-blue-400" },
  Cowardly: { icon: <Eye className="w-3.5 h-3.5" />, color: "text-blue-400" },
  Curious: { icon: <Eye className="w-3.5 h-3.5" />, color: "text-cyan-400" },
  Patient: { icon: <Heart className="w-3.5 h-3.5" />, color: "text-cyan-400" },
  Docile: { icon: <Heart className="w-3.5 h-3.5" />, color: "text-green-400" },
  Friendly: { icon: <Heart className="w-3.5 h-3.5" />, color: "text-green-400" },
  Passive: { icon: <Heart className="w-3.5 h-3.5" />, color: "text-green-400" },
  Naive: { icon: <Heart className="w-3.5 h-3.5" />, color: "text-pink-400" },
  Oblivious: { icon: <Heart className="w-3.5 h-3.5" />, color: "text-pink-400" },
  Neutral: { icon: <Heart className="w-3.5 h-3.5" />, color: "text-muted-foreground" },
  "N/A": { icon: <span className="w-3.5 h-3.5" />, color: "text-muted-foreground" },
};

const CreatureDisplay = ({ name, info, appliedDyes }: CreatureDisplayProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const dietMeta = DIET_META[info.diet];
  const temperMeta = TEMPER_META[info.temperament];

  return (
    <div className="glass p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{name}</h3>
          <p className="text-[11px] text-muted-foreground capitalize">
            {info.archetype.replace(/_/g, " ")}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted/60 ${dietMeta.color}`}
            title={`Diet: ${info.diet}`}
          >
            {dietMeta.icon}
            <span className="hidden sm:inline">{info.diet}</span>
          </span>
          {info.temperament !== "N/A" && (
            <span
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted/60 ${temperMeta.color}`}
              title={`Temperament: ${info.temperament}`}
            >
              {temperMeta.icon}
              <span className="hidden md:inline">{info.temperament}</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1.2fr] gap-3">
        {/* Silhouette */}
        <div className="bg-background/40 rounded-lg border border-border/60 aspect-square overflow-hidden">
          <CreatureSilhouette
            archetype={info.archetype}
            regions={info.regions}
            highlightedRegion={hovered}
            className="w-full h-full"
          />
        </div>

        {/* Region list */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Paint Regions
          </div>
          <div className="space-y-1 max-h-44 overflow-y-auto scrollbar-thin pr-1">
            {info.regions.map((r) => {
              const dyeIdx = appliedDyes?.[r.index];
              const dyeColor = dyeIdx ? getColorByIndex(dyeIdx) : null;
              const isHovered = hovered === r.index;
              return (
                <button
                  key={r.index}
                  onMouseEnter={() => setHovered(r.index)}
                  onMouseLeave={() => setHovered(null)}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-colors ${
                    isHovered
                      ? "bg-primary/15 text-foreground"
                      : "hover:bg-muted/60 text-muted-foreground"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded text-[10px] font-mono flex items-center justify-center shrink-0 ${
                      isHovered
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {r.index}
                  </span>
                  <span className="text-xs flex-1 truncate">{r.name}</span>
                  {dyeColor && (
                    <span
                      className="w-3 h-3 rounded border border-border/80 shrink-0"
                      style={{ backgroundColor: `rgb(${dyeColor.r},${dyeColor.g},${dyeColor.b})` }}
                      title={`Dye: ${dyeColor.name}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/60 pt-2">
        {info.description}
      </p>
    </div>
  );
};

export default CreatureDisplay;
