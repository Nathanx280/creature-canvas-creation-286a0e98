import { Upload, Download, Settings, RotateCcw, Zap } from "lucide-react";
import { useRef, useState, useCallback, ChangeEvent, useEffect } from "react";
import { PAINTING_TARGETS, convertImageToPNT, downloadPNT } from "@/lib/pnt-converter";
import { ARK_PALETTE } from "@/lib/ark-palette";
import ColorPalette from "@/components/ColorPalette";
import ImagePreview from "@/components/ImagePreview";
import TargetSelector from "@/components/TargetSelector";

const Index = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceImageData, setSourceImageData] = useState<ImageData | null>(null);
  const [fileName, setFileName] = useState("MyPainting");
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [dithering, setDithering] = useState(true);
  const [enabledColors, setEnabledColors] = useState<Set<number>>(
    () => new Set(ARK_PALETTE.map((c) => c.index))
  );
  const [previewImageData, setPreviewImageData] = useState<ImageData | null>(null);
  const [pntData, setPntData] = useState<ArrayBuffer | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const target = PAINTING_TARGETS[selectedTarget];

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

  // Auto-convert when settings change
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

  const handleDownload = () => {
    if (!pntData) return;
    downloadPNT(pntData, `${fileName}${target.suffix}.pnt`);
  };

  const handleToggleColor = (index: number) => {
    setEnabledColors((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleReset = () => {
    setSourceImage(null);
    setSourceImageData(null);
    setPreviewImageData(null);
    setPntData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">
              ARK PNT <span className="text-primary">Converter</span>
            </h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Convert images to ARK: Survival Evolved paint files
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Upload Zone */}
        {!sourceImage && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`glass rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/50 ${
              dragOver ? "border-primary/70 bg-primary/5" : ""
            }`}
          >
            <Upload className="w-12 h-12 text-primary mb-4" />
            <p className="text-lg font-semibold text-foreground mb-1">
              Drop your image here
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, JPEG, BMP, WEBP supported
            </p>
          </div>
        )}

        {/* Editor */}
        {sourceImage && (
          <>
            {/* Settings Bar */}
            <div className="glass rounded-lg p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Settings</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Target:</span>
                <TargetSelector
                  selectedIndex={selectedTarget}
                  onChange={setSelectedTarget}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Dithering:</span>
                <button
                  onClick={() => setDithering(!dithering)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    dithering
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {dithering ? "ON" : "OFF"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Name:</span>
                <input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-muted text-foreground text-sm rounded px-2 py-1 border border-border w-40"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded text-sm bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Image
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!pntData || converting}
                  className="px-4 py-1.5 rounded text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .pnt
                </button>
              </div>
            </div>

            {/* Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-lg p-4 flex flex-col items-center">
                <h3 className="text-sm font-semibold text-foreground mb-3">Original</h3>
                <img
                  src={sourceImage.src}
                  alt="Original"
                  className="max-w-full h-auto rounded border border-border"
                  style={{ maxHeight: 400 }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {sourceImage.width} × {sourceImage.height} px
                </p>
              </div>

              <ImagePreview
                imageData={previewImageData}
                width={target.width}
                height={target.height}
                label={converting ? "Converting..." : `Preview (${target.name})`}
              />
            </div>

            {/* Color Palette */}
            <ColorPalette
              enabledColors={enabledColors}
              onToggleColor={handleToggleColor}
              onEnableAll={() => setEnabledColors(new Set(ARK_PALETTE.map((c) => c.index)))}
              onDisableAll={() => setEnabledColors(new Set())}
            />
          </>
        )}

        {/* Footer Info */}
        <div className="glass rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Place downloaded .pnt files in your ARK MyPaintings folder:
          </p>
          <code className="text-xs text-primary mt-1 block">
            Steam/steamapps/common/ARK/ShooterGame/Saved/MyPaintings/
          </code>
        </div>
      </main>
    </div>
  );
};

export default Index;
