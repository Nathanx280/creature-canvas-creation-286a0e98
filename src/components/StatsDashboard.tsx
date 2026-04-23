import { ARK_PALETTE } from "@/lib/ark-palette";
import { BarChart3 } from "lucide-react";

interface Props {
  usageStats: Map<number, number>;
  totalPixels: number;
  width: number;
  height: number;
  fileSizeBytes: number;
}

const StatsDashboard = ({ usageStats, totalPixels, width, height, fileSizeBytes }: Props) => {
  const usedColors = Array.from(usageStats.entries())
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  const top = usedColors.slice(0, 5);

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Conversion Stats</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Stat label="Resolution" value={`${width}×${height}`} />
        <Stat label="Pixels" value={totalPixels.toLocaleString()} />
        <Stat label="Colors used" value={`${usedColors.length} / 25`} />
        <Stat label="File size" value={`${(fileSizeBytes / 1024).toFixed(1)} KB`} />
      </div>

      {top.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Top dyes</p>
          <div className="space-y-1.5">
            {top.map(([idx, count]) => {
              const c = ARK_PALETTE.find((p) => p.index === idx);
              if (!c) return null;
              const pct = (count / totalPixels) * 100;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-border shrink-0" style={{ backgroundColor: `rgb(${c.r},${c.g},${c.b})` }} />
                  <span className="text-xs text-foreground w-20 truncate">{c.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums w-12 text-right">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-muted/40 border border-border/60 p-2.5">
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-sm font-semibold text-foreground mt-0.5 tabular-nums">{value}</div>
  </div>
);

export default StatsDashboard;
