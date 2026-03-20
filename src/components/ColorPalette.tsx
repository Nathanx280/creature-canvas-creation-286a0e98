import { ARK_PALETTE } from "@/lib/ark-palette";

interface ColorPaletteProps {
  enabledColors: Set<number>;
  onToggleColor: (index: number) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
}

const ColorPalette = ({ enabledColors, onToggleColor, onEnableAll, onDisableAll }: ColorPaletteProps) => {
  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Color Palette</h3>
        <div className="flex gap-2 text-xs">
          <button
            onClick={onEnableAll}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Enable All
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={onDisableAll}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Disable All
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ARK_PALETTE.map((color) => {
          const enabled = enabledColors.has(color.index);
          return (
            <button
              key={color.index}
              onClick={() => onToggleColor(color.index)}
              title={`${color.name} ${enabled ? "(enabled)" : "(disabled)"}`}
              className={`w-7 h-7 rounded border-2 transition-all ${
                enabled
                  ? "border-foreground/40 scale-100"
                  : "border-transparent opacity-30 scale-90"
              }`}
              style={{
                backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
              }}
            />
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {enabledColors.size} of {ARK_PALETTE.length} colors enabled
      </p>
    </div>
  );
};

export default ColorPalette;
