import { useEffect, useRef, useState } from "react";
import { GitCompare } from "lucide-react";

interface Props {
  beforeSrc: string;
  afterImageData: ImageData | null;
  afterWidth: number;
  afterHeight: number;
}

const ComparisonSlider = ({ beforeSrc, afterImageData, afterWidth, afterHeight }: Props) => {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || !afterImageData) return;
    canvasRef.current.width = afterWidth;
    canvasRef.current.height = afterHeight;
    canvasRef.current.getContext("2d")!.putImageData(afterImageData, 0, 0);
  }, [afterImageData, afterWidth, afterHeight]);

  const move = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div className="glass p-4 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3 self-start">
        <GitCompare className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Before / After</h3>
      </div>
      <div
        ref={containerRef}
        className="relative w-full select-none cursor-ew-resize rounded-lg overflow-hidden border border-border"
        style={{ aspectRatio: `${afterWidth} / ${afterHeight}`, maxHeight: 420 }}
        onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onMouseMove={(e) => dragging.current && move(e.clientX)}
        onTouchStart={(e) => move(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        <img src={beforeSrc} alt="Before" className="absolute inset-0 w-full h-full object-contain bg-muted" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain bg-muted"
            style={{ imageRendering: "pixelated", display: "block", width: "100%", height: "100%" }}
          />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-lg">
            ⇆
          </div>
        </div>
        <span className="absolute top-2 left-2 text-[10px] uppercase font-bold tracking-wide bg-background/70 backdrop-blur px-1.5 py-0.5 rounded text-foreground">
          Before
        </span>
        <span className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-wide bg-background/70 backdrop-blur px-1.5 py-0.5 rounded text-primary">
          After
        </span>
      </div>
    </div>
  );
};

export default ComparisonSlider;
