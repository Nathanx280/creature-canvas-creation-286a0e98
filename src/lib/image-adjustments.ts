import { Adjustments } from "@/components/ImageAdjustments";

/**
 * Pre-conversion adjustments. The PNT conversion pipeline itself is untouched —
 * this only prepares pixels.
 *
 * Pipeline order:
 *  1. Rotate / flip onto a canvas sized to the rotated dimensions
 *  2. CSS filters: brightness, contrast, saturation, hue, blur, sepia, grayscale, invert
 *  3. Per-pixel ops: gamma, exposure, highlights/shadows, temperature/tint,
 *     channel mixer, duotone, threshold, posterize, vignette, noise
 *  4. Convolution effects: sharpen, edge detect, emboss
 *  5. Block effects: pixelate, halftone
 */

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const v = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function clamp(v: number) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

export function applyAdjustments(
  source: HTMLImageElement,
  adj: Adjustments
): ImageData {
  const rotated = adj.rotate === 90 || adj.rotate === 270;
  const w = rotated ? source.height : source.width;
  const h = rotated ? source.width : source.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  if (adj.bgEnabled) {
    ctx.fillStyle = adj.bgColor;
    ctx.fillRect(0, 0, w, h);
  }

  const filters: string[] = [];
  filters.push(`brightness(${100 + adj.brightness}%)`);
  filters.push(`contrast(${100 + adj.contrast}%)`);
  filters.push(`saturate(${100 + adj.saturation}%)`);
  filters.push(`hue-rotate(${adj.hue}deg)`);
  if (adj.blur > 0) filters.push(`blur(${adj.blur}px)`);
  if (adj.sepia > 0) filters.push(`sepia(${adj.sepia}%)`);
  if (adj.grayscale > 0) filters.push(`grayscale(${adj.grayscale}%)`);
  if (adj.invert) filters.push(`invert(100%)`);
  ctx.filter = filters.join(" ");

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate((adj.rotate * Math.PI) / 180);
  ctx.scale(adj.flipH ? -1 : 1, adj.flipV ? -1 : 1);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);
  ctx.restore();
  ctx.filter = "none";

  // Per-pixel post-pass
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;

  const needsGamma = adj.gamma !== 1;
  const needsExposure = adj.exposure !== 0;
  const needsHL = adj.highlights !== 0;
  const needsSH = adj.shadows !== 0;
  const needsTemp = adj.temperature !== 0;
  const needsTint = adj.tint !== 0;
  const needsChan = adj.redMix !== 100 || adj.greenMix !== 100 || adj.blueMix !== 100;
  const needsThreshold = adj.threshold > 0;
  const needsPosterize = adj.posterize > 0 && adj.posterize < 8;
  const needsVignette = adj.vignette > 0;
  const needsNoise = adj.noise > 0;
  const needsDuotone = adj.duotoneEnabled;

  // Gamma LUT
  let gammaLut: Uint8ClampedArray | null = null;
  if (needsGamma) {
    gammaLut = new Uint8ClampedArray(256);
    const inv = 1 / Math.max(0.05, adj.gamma);
    for (let i = 0; i < 256; i++) gammaLut[i] = Math.round(255 * Math.pow(i / 255, inv));
  }

  const expFactor = needsExposure ? Math.pow(2, adj.exposure / 50) : 1;
  const tempShift = adj.temperature * 0.6; // ~ ±60 on R/B
  const tintShift = adj.tint * 0.6;
  const rMix = adj.redMix / 100, gMix = adj.greenMix / 100, bMix = adj.blueMix / 100;

  const levels = needsPosterize ? Math.max(2, Math.round(adj.posterize)) : 0;
  const pStep = levels ? 255 / (levels - 1) : 0;

  const cx = w / 2, cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  const vStrength = adj.vignette / 100;

  let duoShadow: [number, number, number] = [0, 0, 0];
  let duoHi: [number, number, number] = [255, 255, 255];
  if (needsDuotone) {
    duoShadow = hexToRgb(adj.duotoneShadow);
    duoHi = hexToRgb(adj.duotoneHighlight);
  }

  const noiseAmt = adj.noise / 100 * 64; // ±32 max

  const anyPerPixel =
    needsGamma || needsExposure || needsHL || needsSH || needsTemp || needsTint ||
    needsChan || needsThreshold || needsPosterize || needsVignette || needsNoise || needsDuotone;

  if (anyPerPixel) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        let r = data[i], g = data[i + 1], b = data[i + 2];

        if (gammaLut) { r = gammaLut[r]; g = gammaLut[g]; b = gammaLut[b]; }
        if (needsExposure) { r = clamp(r * expFactor); g = clamp(g * expFactor); b = clamp(b * expFactor); }

        if (needsHL || needsSH) {
          const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          if (needsHL) {
            const k = 1 + (adj.highlights / 100) * lum;
            r = clamp(r * k); g = clamp(g * k); b = clamp(b * k);
          }
          if (needsSH) {
            const k = 1 + (adj.shadows / 100) * (1 - lum);
            r = clamp(r * k); g = clamp(g * k); b = clamp(b * k);
          }
        }

        if (needsTemp) { r = clamp(r + tempShift); b = clamp(b - tempShift); }
        if (needsTint) { g = clamp(g + tintShift); }

        if (needsChan) {
          r = clamp(r * rMix);
          g = clamp(g * gMix);
          b = clamp(b * bMix);
        }

        if (needsPosterize) {
          r = Math.round(Math.round(r / pStep) * pStep);
          g = Math.round(Math.round(g / pStep) * pStep);
          b = Math.round(Math.round(b / pStep) * pStep);
        }

        if (needsThreshold) {
          const v = (r * 0.299 + g * 0.587 + b * 0.114) >= adj.threshold ? 255 : 0;
          r = g = b = v;
        }

        if (needsDuotone) {
          const t = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          r = clamp(duoShadow[0] + (duoHi[0] - duoShadow[0]) * t);
          g = clamp(duoShadow[1] + (duoHi[1] - duoShadow[1]) * t);
          b = clamp(duoShadow[2] + (duoHi[2] - duoShadow[2]) * t);
        }

        if (needsVignette) {
          const dx = x - cx, dy = y - cy;
          const d = Math.sqrt(dx * dx + dy * dy) / maxDist;
          const k = 1 - vStrength * d * d;
          r = clamp(r * k); g = clamp(g * k); b = clamp(b * k);
        }

        if (needsNoise) {
          const n = (Math.random() - 0.5) * noiseAmt;
          r = clamp(r + n); g = clamp(g + n); b = clamp(b + n);
        }

        data[i] = r; data[i + 1] = g; data[i + 2] = b;
      }
    }
  }

  // Convolution effects (sharpen / edge / emboss)
  const applyKernel = (kernel: number[], divisor = 1, bias = 0, mix = 1) => {
    const src = new Uint8ClampedArray(data);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0, ki = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              sum += src[((y + dy) * w + (x + dx)) * 4 + c] * kernel[ki++];
            }
          }
          const v = sum / divisor + bias;
          const orig = src[(y * w + x) * 4 + c];
          data[(y * w + x) * 4 + c] = clamp(orig * (1 - mix) + v * mix);
        }
      }
    }
  };

  if (adj.sharpen > 0) {
    const m = adj.sharpen / 100;
    applyKernel([0, -1, 0, -1, 5, -1, 0, -1, 0], 1, 0, m);
  }
  if (adj.edgeDetect > 0) {
    const m = adj.edgeDetect / 100;
    applyKernel([-1, -1, -1, -1, 8, -1, -1, -1, -1], 1, 0, m);
  }
  if (adj.emboss > 0) {
    const m = adj.emboss / 100;
    applyKernel([-2, -1, 0, -1, 1, 1, 0, 1, 2], 1, 128, m);
  }

  // Pixelate
  if (adj.pixelate >= 2) {
    const block = Math.round(adj.pixelate);
    for (let by = 0; by < h; by += block) {
      for (let bx = 0; bx < w; bx += block) {
        let r = 0, g = 0, b = 0, n = 0;
        const maxY = Math.min(by + block, h);
        const maxX = Math.min(bx + block, w);
        for (let y = by; y < maxY; y++) {
          for (let x = bx; x < maxX; x++) {
            const i = (y * w + x) * 4;
            r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
          }
        }
        r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
        for (let y = by; y < maxY; y++) {
          for (let x = bx; x < maxX; x++) {
            const i = (y * w + x) * 4;
            data[i] = r; data[i + 1] = g; data[i + 2] = b;
          }
        }
      }
    }
  }

  // Halftone (B&W dot pattern, simulated)
  if (adj.halftone >= 2) {
    const cell = Math.round(adj.halftone);
    for (let by = 0; by < h; by += cell) {
      for (let bx = 0; bx < w; bx += cell) {
        let lum = 0, n = 0;
        const maxY = Math.min(by + cell, h);
        const maxX = Math.min(bx + cell, w);
        for (let y = by; y < maxY; y++) {
          for (let x = bx; x < maxX; x++) {
            const i = (y * w + x) * 4;
            lum += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            n++;
          }
        }
        const avgLum = lum / n / 255; // 0..1
        const radius = (1 - avgLum) * (cell / 2);
        const ccx = bx + cell / 2;
        const ccy = by + cell / 2;
        for (let y = by; y < maxY; y++) {
          for (let x = bx; x < maxX; x++) {
            const i = (y * w + x) * 4;
            const dx = x - ccx, dy = y - ccy;
            const inDot = dx * dx + dy * dy <= radius * radius;
            const v = inDot ? 0 : 255;
            data[i] = v; data[i + 1] = v; data[i + 2] = v;
          }
        }
      }
    }
  }

  return img;
}
