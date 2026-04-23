import {
  Upload, Download, Settings, RotateCcw, Zap, Sparkles, Copy, Check,
  Star, Package, Keyboard, Command, FileImage,
} from "lucide-react";
import { useRef, useState, useCallback, ChangeEvent, useEffect, useMemo } from "react";
import JSZip from "jszip";
import { PAINTING_TARGETS, convertImageToPNT, downloadPNT } from "@/lib/pnt-converter";
import { ARK_PALETTE } from "@/lib/ark-palette";
import { applyAdjustments } from "@/lib/image-adjustments";
import { autoPickPalette } from "@/lib/auto-palette";
import ColorPalette from "@/components/ColorPalette";
import ImagePreview from "@/components/ImagePreview";
import TargetSelector from "@/components/TargetSelector";
import ImageAdjustments, { Adjustments, DEFAULT_ADJUSTMENTS } from "@/components/ImageAdjustments";
import ComparisonSlider from "@/components/ComparisonSlider";
import CommandPalette from "@/components/CommandPalette";
import StatsDashboard from "@/components/StatsDashboard";

const FAV_KEY = "pnt_favorite_targets";
const HISTORY_LIMIT = 30;

const Index = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceImageData, setSourceImageData] = useState<ImageData | null>(null);
  const [fileName, setFileName] = useState("MyPainting");
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [dithering, setDithering] = useState(true);
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULT_ADJUSTMENTS);
  const [enabledColors, setEnabledColors] = useState<Set<number>>(
    () => new Set(ARK_PALETTE.map((c) => c.index))
  );
  const [previewImageData, setPreviewImageData] = useState<ImageData | null>(null);
  const [pntData, setPntData] = useState<ArrayBuffer | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [recentTargets, setRecentTargets] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchSelection, setBatchSelection] = useState<Set<number>>(new Set());
  const [cmdOpen, setCmdOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  // Adjustments history (undo/redo)
  const [history, setHistory] = useState<Adjustments[]>([DEFAULT_ADJUSTMENTS]);
  const [hIndex, setHIndex] = useState(0);
  const skipHistoryRef = useRef(false);

  const target = PAINTING_TARGETS[selectedTarget];
  const finalFileName = `${fileName}${target.suffix}.pnt`;

  // Push history when adjustments change (debounced via ref guard)
  useEffect(() => {
    if (skipHistoryRef.current) { skipHistoryRef.current = false; return; }
    const t = setTimeout(() => {
      setHistory((prev) => {
        const truncated = prev.slice(0, hIndex + 1);
        const next = [...truncated, adjustments].slice(-HISTORY_LIMIT);
        setHIndex(next.length - 1);
        return next;
      });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjustments]);

  const undo = () => {
    if (hIndex <= 0) return;
    skipHistoryRef.current = true;
    setHIndex(hIndex - 1);
    setAdjustments(history[hIndex - 1]);
  };
  const redo = () => {
    if (hIndex >= history.length - 1) return;
    skipHistoryRef.current = true;
    setHIndex(hIndex + 1);
    setAdjustments(history[hIndex + 1]);
  };

  // Load favorites
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);

  const saveFavorites = (next: number[]) => {
    setFavorites(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
  };

  const toggleFavorite = (idx: number) => {
    saveFavorites(favorites.includes(idx) ? favorites.filter((i) => i !== idx) : [...favorites, idx]);
  };

  const loadImage = useCallback((file: File) => {
    const baseName = file.name.replace(/\.[^.]+$/, "");
    setFileName(baseName);
    const img = new Image();
    img.onload = () => {
      setSourceImage(img);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      setSourceImageData(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) loadImage(file);
  }, [loadImage]);

  // Re-derive sourceImageData when adjustments change
  useEffect(() => {
    if (!sourceImage) return;
    const data = applyAdjustments(sourceImage, adjustments);
    setSourceImageData(data);
  }, [sourceImage, adjustments]);

  // Auto-convert (untouched conversion logic)
  useEffect(() => {
    if (!sourceImageData) return;
    setConverting(true);
    const timeout = setTimeout(() => {
      const result = convertImageToPNT(
        sourceImageData,
        target.width,
        target.height,
        enabledColors,
        dithering
      );
      setPreviewImageData(result.previewImageData);
      setPntData(result.pntData);
      setConverting(false);
    }, 50);
    return () => clearTimeout(timeout);
  }, [sourceImageData, selectedTarget, enabledColors, dithering, target.width, target.height]);

  // Palette usage stats from preview
  const usageStats = useMemo(() => {
    const map = new Map<number, number>();
    if (!previewImageData) return map;
    const d = previewImageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
      if (a < 128) continue;
      for (const c of ARK_PALETTE) {
        if (c.r === r && c.g === g && c.b === b) {
          map.set(c.index, (map.get(c.index) ?? 0) + 1);
          break;
        }
      }
    }
    return map;
  }, [previewImageData]);

  const totalPreviewPixels = previewImageData ? previewImageData.width * previewImageData.height : 0;

  const handleSelectTarget = (idx: number) => {
    setSelectedTarget(idx);
    setRecentTargets((prev) => [idx, ...prev.filter((i) => i !== idx)].slice(0, 6));
  };

  const handleDownload = () => {
    if (!pntData) return;
    downloadPNT(pntData, finalFileName);
  };

  const handleBatchDownload = async () => {
    if (!sourceImageData) return;
    if (batchSelection.size > 4) {
      // ZIP for many files
      const zip = new JSZip();
      Array.from(batchSelection).forEach((idx) => {
        const t = PAINTING_TARGETS[idx];
        const result = convertImageToPNT(sourceImageData, t.width, t.height, enabledColors, dithering);
        zip.file(`${fileName}${t.suffix}.pnt`, result.pntData);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}_batch.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      Array.from(batchSelection).forEach((idx) => {
        const t = PAINTING_TARGETS[idx];
        const result = convertImageToPNT(sourceImageData, t.width, t.height, enabledColors, dithering);
        downloadPNT(result.pntData, `${fileName}${t.suffix}.pnt`);
      });
    }
    setBatchOpen(false);
  };

  const handleToggleColor = (index: number) => {
    setEnabledColors((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };

  const handleAutoPick = (count: number) => {
    if (!sourceImageData) return;
    const indices = autoPickPalette(sourceImageData, count);
    setEnabledColors(new Set(indices));
  };

  const handleReset = () => {
    setSourceImage(null);
    setSourceImageData(null);
    setPreviewImageData(null);
    setPntData(null);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setHistory([DEFAULT_ADJUSTMENTS]);
    setHIndex(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopyName = async () => {
    await navigator.clipboard.writeText(finalFileName);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExportSettings = () => {
    const settings = { adjustments, enabledColors: Array.from(enabledColors), dithering };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}_settings.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA";
      // Cmd/Ctrl+K opens command palette even from fields
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setCmdOpen(true); return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
        return;
      }
      if (inField) return;
      if (e.key === "d" && pntData) handleDownload();
      if (e.key === "f") toggleFavorite(selectedTarget);
      if (e.key === "c") setCompareMode((c) => !c);
      if (e.key === "b") setBatchOpen(true);
      if (e.key === "?" || e.key === "/") setShowShortcuts((s) => !s);
      if (e.key === "Escape") { setShowShortcuts(false); setBatchOpen(false); setCmdOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pntData, selectedTarget, favorites, hIndex, history]);

  const isFav = favorites.includes(selectedTarget);

  return (
    <div className="min-h-screen flex flex-col">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Header */}
      <header className="border-b border-border/60 px-6 py-4 backdrop-blur-md sticky top-0 z-40 bg-background/70">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-slow" style={{ background: "var(--gradient-hero)" }}>
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight flex items-center gap-2">
                ARK <span className="text-gradient">PNT Studio</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/40">v20</span>
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {PAINTING_TARGETS.length}+ targets · 25-color palette · 26 effects · auto-palette
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCmdOpen(true)} className="chip hover:text-primary transition-colors" title="Command palette (⌘K)">
              <Command className="w-3 h-3" /> ⌘K
            </button>
            <button onClick={() => setShowShortcuts(true)} className="chip hover:text-primary transition-colors" title="Keyboard shortcuts">
              <Keyboard className="w-3 h-3" /> Shortcuts
            </button>
            <a href="https://ark.fandom.com/wiki/Painting" target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex chip hover:text-primary transition-colors">
              <Sparkles className="w-3 h-3" /> ARK Wiki
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Upload Zone */}
        {!sourceImage && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`glass p-16 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/60 ${
              dragOver ? "border-primary/80 !bg-primary/5 scale-[1.01]" : ""
            }`}
            style={{ minHeight: 360 }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-hero)" }}>
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-xl font-semibold text-foreground mb-1">Drop your image here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse · PNG, JPG, JPEG, BMP, WEBP</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              <span className="chip">🦖 {PAINTING_TARGETS.length}+ targets</span>
              <span className="chip">🧑 Humans</span>
              <span className="chip">🪧 Signs & flags</span>
              <span className="chip">🛡️ Armor</span>
              <span className="chip">🪑 Saddles</span>
              <span className="chip">⚔️ Weapons</span>
              <span className="chip">⚡ Tek</span>
              <span className="chip">🌌 All DLC</span>
              <span className="chip">🎨 26 effects</span>
              <span className="chip">🪄 Auto-palette</span>
              <span className="chip">📦 Batch + ZIP</span>
              <span className="chip">↺ Undo/Redo</span>
              <span className="chip">⌘K Command</span>
            </div>
          </div>
        )}

        {sourceImage && (
          <>
            {/* Settings Bar */}
            <div className="glass p-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 mr-2">
                <Settings className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Target</span>
              </div>

              <TargetSelector selectedIndex={selectedTarget} onChange={handleSelectTarget} />

              <button
                onClick={() => toggleFavorite(selectedTarget)}
                className={`btn-ghost !p-1.5 ${isFav ? "!bg-primary/20 !text-primary" : ""}`}
                title="Favorite (F)"
              >
                <Star className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Dithering</span>
                <button
                  onClick={() => setDithering(!dithering)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${dithering ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform ${dithering ? "translate-x-5" : ""}`} />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Name</span>
                <input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-muted/60 text-foreground text-sm rounded-lg px-2.5 py-1.5 border border-border w-40 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <button onClick={() => setCompareMode((c) => !c)} className={`btn-ghost flex items-center gap-1.5 ${compareMode ? "!bg-primary/20 !text-primary" : ""}`} title="Toggle compare (C)">
                  <FileImage className="w-3.5 h-3.5" /> Compare
                </button>
                <button onClick={handleExportSettings} className="btn-ghost flex items-center gap-1.5" title="Export settings as JSON">
                  <Download className="w-3.5 h-3.5" /> Settings
                </button>
                <button onClick={() => setBatchOpen(true)} className="btn-ghost flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Batch
                </button>
                <button onClick={handleReset} className="btn-ghost flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> New
                </button>
                <button onClick={handleDownload} disabled={!pntData || converting} className="btn-primary flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download .pnt
                </button>
              </div>
            </div>

            {/* Filename hint */}
            <div className="glass p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground shrink-0">Saves as</span>
                <code className="text-xs text-primary truncate">{finalFileName}</code>
              </div>
              <button onClick={handleCopyName} className="btn-ghost flex items-center gap-1.5 shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Favorites
                </span>
                {favorites.map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTarget(idx)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      idx === selectedTarget ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {PAINTING_TARGETS[idx]?.name}
                  </button>
                ))}
              </div>
            )}

            {/* Recently used */}
            {recentTargets.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Recent</span>
                {recentTargets.map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTarget(idx)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      idx === selectedTarget ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {PAINTING_TARGETS[idx].name}
                  </button>
                ))}
              </div>
            )}

            {/* Previews */}
            {compareMode ? (
              <ComparisonSlider
                beforeSrc={sourceImage.src}
                afterImageData={previewImageData}
                afterWidth={target.width}
                afterHeight={target.height}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-4 flex flex-col items-center">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Original</h3>
                  <img src={sourceImage.src} alt="Original" className="max-w-full h-auto rounded-lg border border-border" style={{ maxHeight: 400 }} />
                  <p className="text-xs text-muted-foreground mt-2">{sourceImage.width} × {sourceImage.height} px</p>
                </div>

                <ImagePreview
                  imageData={previewImageData}
                  width={target.width}
                  height={target.height}
                  label={converting ? "Converting..." : `Preview (${target.name})`}
                  fileBaseName={fileName}
                />
              </div>
            )}

            {/* Stats */}
            <StatsDashboard
              usageStats={usageStats}
              totalPixels={totalPreviewPixels}
              width={target.width}
              height={target.height}
              fileSizeBytes={pntData?.byteLength ?? 0}
            />

            {/* Adjustments */}
            <ImageAdjustments
              value={adjustments}
              onChange={setAdjustments}
              onUndo={undo}
              onRedo={redo}
              canUndo={hIndex > 0}
              canRedo={hIndex < history.length - 1}
            />

            {/* Color Palette */}
            <ColorPalette
              enabledColors={enabledColors}
              onToggleColor={handleToggleColor}
              onEnableAll={() => setEnabledColors(new Set(ARK_PALETTE.map((c) => c.index)))}
              onDisableAll={() => setEnabledColors(new Set())}
              onApplyPreset={(indices) => setEnabledColors(new Set(indices))}
              onAutoPick={handleAutoPick}
              usageStats={usageStats}
              totalPixels={totalPreviewPixels}
            />
          </>
        )}

        {/* Footer Info */}
        <div className="glass p-4">
          <p className="text-xs text-muted-foreground mb-1">
            📂 Place downloaded <code className="text-primary">.pnt</code> files in your ARK MyPaintings folder:
          </p>
          <code className="text-xs text-foreground/80 break-all">
            Steam/steamapps/common/ARK/ShooterGame/Saved/MyPaintings/
          </code>
        </div>
      </main>

      {/* Command palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onPickTarget={handleSelectTarget}
        actions={[
          { label: "Download .pnt", hint: "D", run: handleDownload },
          { label: "Toggle compare slider", hint: "C", run: () => setCompareMode((c) => !c) },
          { label: "Toggle dithering", hint: "Switch", run: () => setDithering((d) => !d) },
          { label: "Open batch export", hint: "B", run: () => setBatchOpen(true) },
          { label: "Reset adjustments", hint: "Adjustments", run: () => setAdjustments(DEFAULT_ADJUSTMENTS) },
          { label: "Auto-pick 8 dyes from image", hint: "Palette", run: () => handleAutoPick(8) },
          { label: "Enable all dyes", run: () => setEnabledColors(new Set(ARK_PALETTE.map((c) => c.index))) },
          { label: "Favorite current target", hint: "F", run: () => toggleFavorite(selectedTarget) },
          { label: "Export settings as JSON", run: handleExportSettings },
          { label: "New image", hint: "Reset", run: handleReset },
        ]}
      />

      {/* Shortcuts modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowShortcuts(false)}>
          <div className="glass-strong p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-primary" /> Keyboard Shortcuts
            </h2>
            <div className="space-y-2 text-sm">
              {[
                ["⌘ / Ctrl + K", "Command palette"],
                ["⌘ / Ctrl + Z", "Undo adjustment"],
                ["⌘ / Ctrl + ⇧ + Z", "Redo adjustment"],
                ["D", "Download .pnt"],
                ["C", "Toggle compare slider"],
                ["F", "Favorite current target"],
                ["B", "Open batch export"],
                ["?", "Show / hide shortcuts"],
                ["Esc", "Close dialogs"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{v}</span>
                  <kbd className="px-2 py-0.5 rounded bg-muted text-foreground text-xs font-mono border border-border">{k}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Batch download modal */}
      {batchOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBatchOpen(false)}>
          <div className="glass-strong p-6 max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Batch Export
                <span className="chip">{batchSelection.size} selected</span>
                {batchSelection.size > 4 && <span className="chip !text-primary !border-primary/40">→ ZIP</span>}
              </h2>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setBatchSelection(new Set(favorites))} className="btn-ghost text-xs">From Favorites</button>
                <button onClick={() => setBatchSelection(new Set(PAINTING_TARGETS.map((_, i) => i)))} className="btn-ghost text-xs">All</button>
                <button onClick={() => setBatchSelection(new Set())} className="btn-ghost text-xs">Clear</button>
              </div>
            </div>
            <div className="overflow-y-auto scrollbar-thin flex-1 -mx-2 px-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {PAINTING_TARGETS.map((t, i) => {
                  const sel = batchSelection.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const next = new Set(batchSelection);
                        if (sel) next.delete(i); else next.add(i);
                        setBatchSelection(next);
                      }}
                      className={`text-xs text-left px-2 py-1.5 rounded border transition-colors ${
                        sel ? "bg-primary/20 border-primary text-primary" : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="truncate">{t.name}</div>
                      <div className="text-[10px] opacity-60">{t.width}×{t.height}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setBatchOpen(false)} className="btn-ghost">Cancel</button>
              <button
                onClick={handleBatchDownload}
                disabled={batchSelection.size === 0 || !sourceImageData}
                className="btn-primary flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export {batchSelection.size} {batchSelection.size > 4 ? "as ZIP" : "files"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
