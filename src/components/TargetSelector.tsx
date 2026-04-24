import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import {
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  PAINTING_TARGETS,
  TargetCategory,
} from "@/lib/pnt-converter";

interface TargetSelectorProps {
  selectedIndex: number;
  onChange: (index: number) => void;
}

const TargetSelector = ({ selectedIndex, onChange }: TargetSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<TargetCategory | "all">("all");
  const ref = useRef<HTMLDivElement>(null);

  const selected = PAINTING_TARGETS[selectedIndex];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PAINTING_TARGETS.map((t, i) => ({ t, i }))
      .filter(({ t }) => activeCat === "all" || t.category === activeCat)
      .filter(({ t }) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.suffix.toLowerCase().includes(q)
      );
  }, [query, activeCat]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-muted/60 hover:bg-muted text-foreground text-sm rounded-lg px-3 py-1.5 border border-border min-w-[240px] justify-between transition-colors"
      >
        <span className="truncate">
          {selected.name}{" "}
          <span className="text-muted-foreground text-xs">
            ({selected.width}×{selected.height})
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-[100] mt-2 w-[360px] glass-strong rounded-xl overflow-hidden left-0 shadow-2xl">
          <div className="p-2 border-b border-border/60">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dinos, signs, structures..."
                className="w-full bg-muted/60 text-sm rounded-lg pl-8 pr-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-thin pb-1">
              <button
                onClick={() => setActiveCat("all")}
                className={`text-[11px] px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
                  activeCat === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`text-[11px] px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
                    activeCat === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No targets match "{query}"
              </div>
            )}
            {filtered.map(({ t, i }) => (
              <button
                key={i}
                onClick={() => {
                  onChange(i);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-muted/60 transition-colors ${
                  i === selectedIndex ? "bg-muted/40" : ""
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm text-foreground">{t.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {CATEGORY_LABELS[t.category]} · {t.width}×{t.height}
                  </span>
                </div>
                {i === selectedIndex && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetSelector;
