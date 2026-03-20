import { CATEGORY_ORDER, CATEGORY_LABELS, getTargetsByCategory, PAINTING_TARGETS } from "@/lib/pnt-converter";

interface TargetSelectorProps {
  selectedIndex: number;
  onChange: (index: number) => void;
}

const TargetSelector = ({ selectedIndex, onChange }: TargetSelectorProps) => {
  const grouped = getTargetsByCategory();

  return (
    <select
      value={selectedIndex}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-muted text-foreground text-sm rounded px-2 py-1.5 border border-border min-w-[200px]"
    >
      {CATEGORY_ORDER.map((cat) => (
        <optgroup key={cat} label={CATEGORY_LABELS[cat]}>
          {grouped[cat].map((t) => {
            const globalIdx = PAINTING_TARGETS.indexOf(t);
            return (
              <option key={globalIdx} value={globalIdx}>
                {t.name} ({t.width}×{t.height})
              </option>
            );
          })}
        </optgroup>
      ))}
    </select>
  );
};

export default TargetSelector;
