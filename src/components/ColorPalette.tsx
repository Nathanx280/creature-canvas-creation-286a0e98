import { ARK_PALETTE } from "@/lib/ark-palette";
import { Palette, Save, Trash2, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ColorPaletteProps {
  enabledColors: Set<number>;
  onToggleColor: (index: number) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
  onApplyPreset: (indices: number[]) => void;
  onAutoPick?: (count: number) => void;
  usageStats?: Map<number, number>;
  totalPixels?: number;
}

const PRESETS: { name: string; indices: number[] }[] = [
  { name: "All Colors",    indices: ARK_PALETTE.map((c) => c.index) },
  { name: "Grayscale",     indices: [4, 25, 15, 5] },
  { name: "Mono Black",    indices: [4, 5] },
  { name: "Earth Tones",   indices: [4, 6, 8, 18, 19, 20, 22, 24] },
  { name: "Warm",          indices: [1, 10, 11, 13, 14, 19, 20, 21] },
  { name: "Cool",          indices: [2, 3, 7, 8, 9, 16, 17, 23] },
  { name: "Pastel",        indices: [12, 13, 17, 18, 15, 5] },
  { name: "Tribal",        indices: [1, 4, 5, 10, 20] },
  { name: "Tek/Neon",      indices: [7, 9, 13, 14, 16, 17] },
  { name: "Forest Camo",   indices: [4, 6, 8, 22, 24, 25] },
  { name: "Desert Camo",   indices: [6, 12, 18, 19, 21, 22] },
  { name: "Arctic Camo",   indices: [5, 15, 17, 23, 25] },
  { name: "Lava",          indices: [1, 4, 10, 11, 19, 20, 21] },
  { name: "Ocean",         indices: [2, 3, 5, 7, 17, 23] },
  { name: "Royal",         indices: [9, 10, 16, 5, 4] },
  { name: "Sunset",        indices: [1, 11, 13, 14, 21, 19] },
  { name: "Reaper",        indices: [4, 9, 16, 22, 25] },
  { name: "Wyvern Fire",   indices: [1, 4, 11, 19, 20, 21] },
  { name: "Wyvern Ice",    indices: [3, 5, 7, 15, 17, 25] },
  { name: "Wyvern Poison", indices: [2, 4, 8, 9, 24] },
];

const STORAGE_KEY = "pnt_custom_palette_presets";

const ColorPalette = ({
  enabledColors,
  onToggleColor,
  onEnableAll,
  onDisableAll,
  onApplyPreset,
  onAutoPick,
  usageStats,
  totalPixels,
}: ColorPaletteProps) => {
  const [autoCount, setAutoCount] = useState(8);
  const [custom, setCustom] = useState<{ name: string; indices: number[] }[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCustom(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);

  const persist = (next: typeof custom) => {
    setCustom(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveCurrent = () => {
    const name = window.prompt("Name this preset:");
    if (!name) return;
    persist([...custom, { name, indices: Array.from(enabledColors) }]);
  };

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Color Palette</h3>
          <span className="chip">{enabledColors.size}/{ARK_PALETTE.length}</span>
        </div>
        <div className="flex gap-2 text-xs items-center flex-wrap">
          {onAutoPick && (
            <div className="flex items-center gap-1 bg-muted/40 rounded-lg pl-2 pr-1 py-0.5 border border-border/60">
              <Wand2 className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Auto</span>
              <input
                type="number"
                min={2}
                max={25}
                value={autoCount}
                onChange={(e) => setAutoCount(Math.max(2, Math.min(25, Number(e.target.value) || 8)))}
                className="w-10 bg-transparent text-foreground text-center focus:outline-none"
              />
              <button onClick={() => onAutoPick(autoCount)} className="text-primary hover:text-primary-glow px-1">Pick</button>
            </div>
          )}
          <button onClick={saveCurrent} className="btn-ghost flex items-center gap-1 !py-1">
            <Save className="w-3 h-3" /> Save
          </button>
          <button onClick={onEnableAll} className="text-primary hover:text-primary-glow transition-colors">All</button>
          <span className="text-muted-foreground">·</span>
          <button onClick={onDisableAll} className="text-primary hover:text-primary-glow transition-colors">None</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {ARK_PALETTE.map((color) => {
          const enabled = enabledColors.has(color.index);
          const count = usageStats?.get(color.index) ?? 0;
          const pct = totalPixels && totalPixels > 0 ? (count / totalPixels) * 100 : 0;
          return (
            <button
              key={color.index}
              onClick={() => onToggleColor(color.index)}
              title={`${color.name}${pct > 0 ? ` — ${pct.toFixed(1)}% of preview` : ""}`}
              className={`relative w-9 h-9 rounded-md border-2 transition-all ${
                enabled
                  ? "border-foreground/40 hover:border-primary scale-100 shadow-sm"
                  : "border-transparent opacity-25 scale-90 hover:opacity-60"
              }`}
              style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
            >
              {enabled && pct >= 1 && (
                <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-background text-foreground rounded-full px-1 leading-tight border border-border">
                  {pct < 10 ? pct.toFixed(0) : Math.round(pct)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-border/60 pt-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Presets</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => onApplyPreset(p.indices)}
              className="text-xs px-2.5 py-1 rounded-full bg-muted/60 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors border border-border/50"
            >
              {p.name}
            </button>
          ))}
        </div>

        {custom.length > 0 && (
          <>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground mt-3 mb-2">Your Presets</p>
            <div className="flex flex-wrap gap-1.5">
              {custom.map((p, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-xs pl-2.5 pr-1 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                  <button onClick={() => onApplyPreset(p.indices)}>{p.name}</button>
                  <button
                    onClick={() => persist(custom.filter((_, i) => i !== idx))}
                    className="hover:bg-destructive/20 rounded-full p-0.5"
                    title="Delete"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ColorPalette;
