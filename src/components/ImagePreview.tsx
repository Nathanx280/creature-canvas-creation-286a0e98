import { useEffect, useRef } from "react";

interface ImagePreviewProps {
  imageData: ImageData | null;
  width: number;
  height: number;
  label: string;
}

const ImagePreview = ({ imageData, width, height, label }: ImagePreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageData) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    ctx.putImageData(imageData, 0, 0);
  }, [imageData, width, height]);

  return (
    <div className="glass rounded-lg p-4 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-foreground mb-3">{label}</h3>
      {imageData ? (
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto rounded border border-border"
          style={{ imageRendering: "pixelated" }}
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center rounded border border-border border-dashed">
          <p className="text-muted-foreground text-sm">No preview available</p>
        </div>
      )}
      {imageData && (
        <p className="text-xs text-muted-foreground mt-2">
          {width} × {height} px
        </p>
      )}
    </div>
  );
};

export default ImagePreview;
