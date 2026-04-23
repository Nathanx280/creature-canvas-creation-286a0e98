import { ARK_PALETTE } from "./ark-palette";

/**
 * Pick the N best dye indices for an image by counting nearest-color votes.
 * Returns indices sorted by frequency.
 */
export function autoPickPalette(imageData: ImageData, count: number): number[] {
  const data = imageData.data;
  const votes = new Map<number, number>();
  // Stride for speed on large images
  const stride = Math.max(1, Math.floor(Math.sqrt(data.length / 4 / 50000)));
  for (let y = 0; y < imageData.height; y += stride) {
    for (let x = 0; x < imageData.width; x += stride) {
      const i = (y * imageData.width + x) * 4;
      const a = data[i + 3];
      if (a < 128) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      let best = 0, bestD = Infinity;
      for (const c of ARK_PALETTE) {
        const dr = r - c.r, dg = g - c.g, db = b - c.b;
        const d = dr * dr * 2 + dg * dg * 4 + db * db * 3;
        if (d < bestD) { bestD = d; best = c.index; }
      }
      votes.set(best, (votes.get(best) ?? 0) + 1);
    }
  }
  return Array.from(votes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([idx]) => idx);
}
