import {
  Sliders, RotateCw, FlipHorizontal, FlipVertical, RefreshCw,
  Wand2, Undo2, Redo2,
} from "lucide-react";
import { useState } from "react";

export interface Adjustments {
  // Basic
  brightness: number; // -100..100
  contrast: number;   // -100..100
  saturation: number; // -100..100
  exposure: number;   // -100..100 (multiplier on linear value)
  highlights: number; // -100..100
  shadows: number;    // -100..100
  temperature: number; // -100..100 (cool ↔ warm, R/B shift)
  tint: number;        // -100..100 (G/M shift)
  // Color
  hue: number;        // -180..180
  gamma: number;      // 0.1..3.0
  sepia: number;      // 0..100
  grayscale: number;  // 0..100
  invert: boolean;
  // Channel mixer
  redMix: number;   // 0..200 (% of red channel)
  greenMix: number; // 0..200
  blueMix: number;  // 0..200
  // Effects
  sharpen: number;    // 0..100
  blur: number;       // 0..10 px
  noise: number;      // 0..100
  pixelate: number;   // 0 (off) | 2..32 block size
  edgeDetect: number; // 0..100
  emboss: number;     // 0..100
  halftone: number;   // 0 (off) | 2..16 dot size
  posterize: number;  // 0 (off) | 2..8 levels
  threshold: number;  // 0..255 (0 = off)
  vignette: number;   // 0..100
  // Duotone
  duotoneEnabled: boolean;
  duotoneShadow: string;
  duotoneHighlight: string;
  // Transform
  flipH: boolean;
  flipV: boolean;
  rotate: 0 | 90 | 180 | 270;
  // Background
  bgEnabled: boolean;
  bgColor: string;
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0, contrast: 0, saturation: 0, exposure: 0,
  highlights: 0, shadows: 0, temperature: 0, tint: 0,
  hue: 0, gamma: 1, sepia: 0, grayscale: 0, invert: false,
  redMix: 100, greenMix: 100, blueMix: 100,
  sharpen: 0, blur: 0, noise: 0, pixelate: 0,
  edgeDetect: 0, emboss: 0, halftone: 0,
  posterize: 0, threshold: 0, vignette: 0,
  duotoneEnabled: false, duotoneShadow: "#1a1a4b", duotoneHighlight: "#ffe0a8",
  flipH: false, flipV: false, rotate: 0,
  bgEnabled: false, bgColor: "#000000",
};

export const ADJUSTMENT_PRESETS: { name: string; emoji: string; adj: Partial<Adjustments> }[] = [
  { name: "Vivid",        emoji: "✨", adj: { saturation: 35, contrast: 20, brightness: 5 } },
  { name: "Bold Pop",     emoji: "💥", adj: { saturation: 60, contrast: 40, sharpen: 30 } },
  { name: "HDR Punch",    emoji: "⚡", adj: { contrast: 30, saturation: 25, sharpen: 40, highlights: -25, shadows: 25 } },
  { name: "Faded",        emoji: "🌫️", adj: { saturation: -30, contrast: -15, brightness: 10 } },
  { name: "Matte",        emoji: "🎞️", adj: { contrast: -20, shadows: 30, highlights: -10, saturation: -10 } },
  { name: "Film Noir",    emoji: "🎬", adj: { grayscale: 100, contrast: 40, vignette: 50 } },
  { name: "B&W",          emoji: "⚫", adj: { grayscale: 100, contrast: 15 } },
  { name: "Sepia",        emoji: "📜", adj: { sepia: 80, contrast: 10 } },
  { name: "Cold",         emoji: "❄️", adj: { temperature: -40, saturation: 10 } },
  { name: "Warm",         emoji: "🔥", adj: { temperature: 40, saturation: 15, brightness: 5 } },
  { name: "High Contrast",emoji: "🎯", adj: { contrast: 60, saturation: 10 } },
  { name: "Cartoon",      emoji: "🖌️", adj: { posterize: 5, saturation: 30, sharpen: 50 } },
  { name: "Comic",        emoji: "📚", adj: { posterize: 4, edgeDetect: 30, saturation: 40, sharpen: 60 } },
  { name: "Threshold",    emoji: "◧",  adj: { threshold: 128 } },
  { name: "Vignette",     emoji: "🌑", adj: { vignette: 60, contrast: 10 } },
  { name: "Dreamy",       emoji: "💭", adj: { blur: 1, brightness: 10, saturation: -10 } },
  { name: "Cyberpunk",    emoji: "🌆", adj: { hue: 60, saturation: 50, contrast: 30, temperature: -20 } },
  { name: "Synthwave",    emoji: "🌅", adj: { duotoneEnabled: true, duotoneShadow: "#1b0033", duotoneHighlight: "#ff3df0", contrast: 30 } },
  { name: "Retro",        emoji: "📼", adj: { saturation: -15, posterize: 6, noise: 15, temperature: 25 } },
  { name: "Pixel Art",    emoji: "👾", adj: { pixelate: 6, posterize: 4, saturation: 30 } },
  { name: "8-Bit",        emoji: "🕹️", adj: { pixelate: 8, posterize: 3 } },
  { name: "Halftone",     emoji: "🟤", adj: { halftone: 4, contrast: 20 } },
  { name: "Edges",        emoji: "✏️", adj: { edgeDetect: 80, grayscale: 100 } },
  { name: "Emboss",       emoji: "🪨", adj: { emboss: 60, grayscale: 100 } },
  { name: "Noir Red",     emoji: "🔴", adj: { duotoneEnabled: true, duotoneShadow: "#1a0000", duotoneHighlight: "#ff5050" } },
  { name: "Inverted",     emoji: "🔄", adj: { invert: true } },
];

interface Props {
  value: Adjustments;
  onChange: (next: Adjustments) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const Slider = ({
  label, value, min, max, step = 1, onChange, suffix = "",
}: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono text-foreground tabular-nums">{value}{suffix}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full bg-muted appearance-none cursor-pointer accent-primary"
    />
  </div>
);

const TABS = ["basic", "tone", "color", "channels", "effects", "stylize", "transform"] as const;
type Tab = (typeof TABS)[number];

const ImageAdjustments = ({ value, onChange, onUndo, onRedo, canUndo, canRedo }: Props) => {
  const [tab, setTab] = useState<Tab>("basic");
  const set = <K extends keyof Adjustments>(k: K, v: Adjustments[K]) =>
    onChange({ ...value, [k]: v });

  const applyPreset = (p: Partial<Adjustments>) =>
    onChange({ ...DEFAULT_ADJUSTMENTS, ...p });

  return (
    <div className="glass p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Image Adjustments</h3>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {onUndo && (
            <>
              <button onClick={onUndo} disabled={!canUndo} className="btn-ghost !p-1.5 disabled:opacity-30" title="Undo (Ctrl+Z)">
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={onRedo} disabled={!canRedo} className="btn-ghost !p-1.5 disabled:opacity-30" title="Redo (Ctrl+Shift+Z)">
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors capitalize ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => onChange(DEFAULT_ADJUSTMENTS)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-1.5 pb-3 border-b border-border/60">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground flex items-center gap-1 mr-1">
          <Wand2 className="w-3 h-3" /> Presets
        </span>
        {ADJUSTMENT_PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p.adj)}
            className="text-[11px] px-2 py-1 rounded-full bg-muted/60 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors border border-border/50"
          >
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      {tab === "basic" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Slider label="Brightness" value={value.brightness} min={-100} max={100} onChange={(v) => set("brightness", v)} />
          <Slider label="Contrast" value={value.contrast} min={-100} max={100} onChange={(v) => set("contrast", v)} />
          <Slider label="Saturation" value={value.saturation} min={-100} max={100} onChange={(v) => set("saturation", v)} />
          <Slider label="Exposure" value={value.exposure} min={-100} max={100} onChange={(v) => set("exposure", v)} />
        </div>
      )}

      {tab === "tone" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Slider label="Highlights" value={value.highlights} min={-100} max={100} onChange={(v) => set("highlights", v)} />
          <Slider label="Shadows" value={value.shadows} min={-100} max={100} onChange={(v) => set("shadows", v)} />
          <Slider label="Gamma" value={value.gamma} min={0.1} max={3} step={0.05} onChange={(v) => set("gamma", v)} />
          <Slider label="Vignette" value={value.vignette} min={0} max={100} onChange={(v) => set("vignette", v)} suffix="%" />
        </div>
      )}

      {tab === "color" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Slider label="Hue" value={value.hue} min={-180} max={180} onChange={(v) => set("hue", v)} suffix="°" />
          <Slider label="Temperature" value={value.temperature} min={-100} max={100} onChange={(v) => set("temperature", v)} />
          <Slider label="Tint" value={value.tint} min={-100} max={100} onChange={(v) => set("tint", v)} />
          <Slider label="Sepia" value={value.sepia} min={0} max={100} onChange={(v) => set("sepia", v)} suffix="%" />
          <Slider label="Grayscale" value={value.grayscale} min={0} max={100} onChange={(v) => set("grayscale", v)} suffix="%" />
          <div className="flex items-end gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-xs text-foreground select-none cursor-pointer">
              <input type="checkbox" checked={value.invert} onChange={(e) => set("invert", e.target.checked)} className="accent-primary" />
              Invert
            </label>
            <label className="flex items-center gap-2 text-xs text-foreground select-none cursor-pointer">
              <input type="checkbox" checked={value.bgEnabled} onChange={(e) => set("bgEnabled", e.target.checked)} className="accent-primary" />
              BG fill
              <input type="color" value={value.bgColor} onChange={(e) => set("bgColor", e.target.value)}
                disabled={!value.bgEnabled}
                className="w-7 h-7 rounded border border-border bg-transparent cursor-pointer disabled:opacity-40" />
            </label>
          </div>
        </div>
      )}

      {tab === "channels" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Slider label="Red" value={value.redMix} min={0} max={200} onChange={(v) => set("redMix", v)} suffix="%" />
            <Slider label="Green" value={value.greenMix} min={0} max={200} onChange={(v) => set("greenMix", v)} suffix="%" />
            <Slider label="Blue" value={value.blueMix} min={0} max={200} onChange={(v) => set("blueMix", v)} suffix="%" />
          </div>
          <div className="border-t border-border/60 pt-3 space-y-2">
            <label className="flex items-center gap-2 text-xs text-foreground select-none cursor-pointer">
              <input type="checkbox" checked={value.duotoneEnabled} onChange={(e) => set("duotoneEnabled", e.target.checked)} className="accent-primary" />
              Duotone
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                Shadow
                <input type="color" value={value.duotoneShadow} disabled={!value.duotoneEnabled}
                  onChange={(e) => set("duotoneShadow", e.target.value)}
                  className="w-7 h-7 rounded border border-border cursor-pointer disabled:opacity-40" />
              </label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                Highlight
                <input type="color" value={value.duotoneHighlight} disabled={!value.duotoneEnabled}
                  onChange={(e) => set("duotoneHighlight", e.target.value)}
                  className="w-7 h-7 rounded border border-border cursor-pointer disabled:opacity-40" />
              </label>
            </div>
          </div>
        </div>
      )}

      {tab === "effects" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Slider label="Sharpen" value={value.sharpen} min={0} max={100} onChange={(v) => set("sharpen", v)} suffix="%" />
          <Slider label="Blur" value={value.blur} min={0} max={10} step={0.5} onChange={(v) => set("blur", v)} suffix="px" />
          <Slider label="Noise" value={value.noise} min={0} max={100} onChange={(v) => set("noise", v)} suffix="%" />
          <Slider label="Edge Detect" value={value.edgeDetect} min={0} max={100} onChange={(v) => set("edgeDetect", v)} suffix="%" />
          <Slider label="Emboss" value={value.emboss} min={0} max={100} onChange={(v) => set("emboss", v)} suffix="%" />
        </div>
      )}

      {tab === "stylize" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Slider label="Pixelate (block px)" value={value.pixelate} min={0} max={32} onChange={(v) => set("pixelate", v)} />
          <Slider label="Halftone (dot px)" value={value.halftone} min={0} max={16} onChange={(v) => set("halftone", v)} />
          <Slider label="Posterize (levels)" value={value.posterize} min={0} max={8} onChange={(v) => set("posterize", v)} />
          <Slider label="Threshold" value={value.threshold} min={0} max={255} onChange={(v) => set("threshold", v)} />
        </div>
      )}

      {tab === "transform" && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => set("flipH", !value.flipH)}
            className={`btn-ghost flex items-center gap-1.5 ${value.flipH ? "!bg-primary/20 !text-primary" : ""}`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" /> Flip H
          </button>
          <button
            onClick={() => set("flipV", !value.flipV)}
            className={`btn-ghost flex items-center gap-1.5 ${value.flipV ? "!bg-primary/20 !text-primary" : ""}`}
          >
            <FlipVertical className="w-3.5 h-3.5" /> Flip V
          </button>
          <button
            onClick={() => set("rotate", ((value.rotate + 90) % 360) as Adjustments["rotate"])}
            className="btn-ghost flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" /> Rotate ({value.rotate}°)
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageAdjustments;
