import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { PAINTING_TARGETS, CATEGORY_LABELS } from "@/lib/pnt-converter";

interface Props {
  open: boolean;
  onClose: () => void;
  onPickTarget: (idx: number) => void;
  actions?: { label: string; hint?: string; run: () => void }[];
}

const CommandPalette = ({ open, onClose, onPickTarget, actions = [] }: Props) => {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const targetItems = PAINTING_TARGETS.map((t, i) => ({
      kind: "target" as const,
      label: t.name,
      hint: `${CATEGORY_LABELS[t.category]} · ${t.width}×${t.height}`,
      idx: i,
    }));
    const actionItems = actions.map((a) => ({
      kind: "action" as const,
      label: a.label,
      hint: a.hint ?? "Action",
      run: a.run,
    }));
    const all = [...actionItems, ...targetItems];
    if (!ql) return all.slice(0, 30);
    return all.filter((it) => it.label.toLowerCase().includes(ql) || it.hint.toLowerCase().includes(ql)).slice(0, 50);
  }, [q, actions]);

  useEffect(() => { setActive(0); }, [q]);

  if (!open) return null;

  const pick = (it: (typeof items)[number]) => {
    if (it.kind === "target") onPickTarget(it.idx);
    else it.run();
    onClose();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && items[active]) { e.preventDefault(); pick(items[active]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 pt-24" onClick={onClose}>
      <div className="glass-strong w-full max-w-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Jump to a target or run an action…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-1"
          />
          <kbd className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted border border-border">Esc</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
          {items.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No matches</div>
          )}
          {items.map((it, i) => (
            <button
              key={i}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(it)}
              className={`w-full text-left px-3 py-2 flex items-center justify-between gap-2 transition-colors ${
                i === active ? "bg-primary/15 text-foreground" : "hover:bg-muted/40"
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-sm truncate">
                  {it.kind === "action" ? "⚡ " : "🎯 "}
                  {it.label}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">{it.hint}</span>
              </div>
              {i === active && <span className="text-[10px] text-primary font-mono">↵</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
