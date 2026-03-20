import { findClosestColorIndex, getColorByIndex } from "./ark-palette";

export interface PNTResult {
  pntData: ArrayBuffer;
  previewImageData: ImageData;
  width: number;
  height: number;
}

export type TargetCategory = "signs" | "structures" | "humans" | "carnivores" | "herbivores" | "flyers" | "aquatic" | "misc_creatures";

export interface PaintingTarget {
  name: string;
  suffix: string;
  width: number;
  height: number;
  category: TargetCategory;
}

// ARK painting target types with their resolutions
export const PAINTING_TARGETS: PaintingTarget[] = [
  // Signs & Canvases
  { name: "Painting Canvas", suffix: "_Sign_Large_Metal_C", width: 256, height: 256, category: "signs" },
  { name: "War Map", suffix: "_WarMap_C", width: 256, height: 256, category: "signs" },
  { name: "Wooden Sign", suffix: "_Sign_Small_Wood_C", width: 128, height: 128, category: "signs" },
  { name: "Wooden Billboard", suffix: "_Sign_Large_Wood_C", width: 256, height: 256, category: "signs" },
  { name: "Metal Sign", suffix: "_Sign_Small_Metal_C", width: 128, height: 128, category: "signs" },
  { name: "Metal Billboard", suffix: "_Sign_Large_Metal_C", width: 256, height: 256, category: "signs" },

  // Structures & Items
  { name: "Single Flag", suffix: "_Flag_C", width: 256, height: 256, category: "structures" },
  { name: "Multi Panel Flag", suffix: "_FlagMultiPanel_C", width: 256, height: 384, category: "structures" },
  { name: "Shag Rug", suffix: "_Rug_C", width: 256, height: 256, category: "structures" },
  { name: "Spotlight", suffix: "_Spotlight_C", width: 256, height: 256, category: "structures" },
  { name: "Raft", suffix: "_Raft_C", width: 256, height: 256, category: "structures" },
  { name: "Shield", suffix: "_Shield_C", width: 128, height: 128, category: "structures" },
  { name: "Motorboat", suffix: "_Motorboat_C", width: 256, height: 256, category: "structures" },

  // Human Characters
  { name: "Human (Full Body)", suffix: "_Human_C", width: 256, height: 512, category: "humans" },
  { name: "Human (Head)", suffix: "_Human_Head_C", width: 128, height: 128, category: "humans" },
  { name: "Human (Torso)", suffix: "_Human_Torso_C", width: 256, height: 256, category: "humans" },
  { name: "Human (Left Arm)", suffix: "_Human_LeftArm_C", width: 128, height: 256, category: "humans" },
  { name: "Human (Right Arm)", suffix: "_Human_RightArm_C", width: 128, height: 256, category: "humans" },
  { name: "Human (Left Leg)", suffix: "_Human_LeftLeg_C", width: 128, height: 256, category: "humans" },
  { name: "Human (Right Leg)", suffix: "_Human_RightLeg_C", width: 128, height: 256, category: "humans" },
  { name: "Human (Hands)", suffix: "_Human_Hands_C", width: 128, height: 128, category: "humans" },
  { name: "Human (Feet)", suffix: "_Human_Feet_C", width: 128, height: 128, category: "humans" },

  // Carnivores
  { name: "Rex", suffix: "_Rex_C", width: 256, height: 256, category: "carnivores" },
  { name: "Raptor", suffix: "_Raptor_C", width: 256, height: 256, category: "carnivores" },
  { name: "Spino", suffix: "_Spino_C", width: 256, height: 256, category: "carnivores" },
  { name: "Carno", suffix: "_Carno_C", width: 256, height: 256, category: "carnivores" },
  { name: "Allosaurus", suffix: "_Allo_C", width: 256, height: 256, category: "carnivores" },
  { name: "Yutyrannus", suffix: "_Yuty_C", width: 256, height: 256, category: "carnivores" },
  { name: "Giganotosaurus", suffix: "_Gigant_C", width: 256, height: 256, category: "carnivores" },
  { name: "Therizinosaurus", suffix: "_Therizino_C", width: 256, height: 256, category: "carnivores" },
  { name: "Baryonyx", suffix: "_Baryonyx_C", width: 256, height: 256, category: "carnivores" },
  { name: "Dilophosaurus", suffix: "_Dilo_C", width: 128, height: 128, category: "carnivores" },
  { name: "Sabertooth", suffix: "_Saber_C", width: 256, height: 256, category: "carnivores" },
  { name: "Dire Wolf", suffix: "_Direwolf_C", width: 256, height: 256, category: "carnivores" },
  { name: "Thylacoleo", suffix: "_Thyla_C", width: 256, height: 256, category: "carnivores" },
  { name: "Megalosaurus", suffix: "_Megalosaurus_C", width: 256, height: 256, category: "carnivores" },

  // Herbivores
  { name: "Trike", suffix: "_Trike_C", width: 256, height: 256, category: "herbivores" },
  { name: "Stego", suffix: "_Stego_C", width: 256, height: 256, category: "herbivores" },
  { name: "Bronto", suffix: "_Sauropod_C", width: 256, height: 256, category: "herbivores" },
  { name: "Parasaur", suffix: "_Para_C", width: 256, height: 256, category: "herbivores" },
  { name: "Ankylosaurus", suffix: "_Ankylo_C", width: 256, height: 256, category: "herbivores" },
  { name: "Pachyrhinosaurus", suffix: "_Pachyrhino_C", width: 256, height: 256, category: "herbivores" },
  { name: "Diplodocus", suffix: "_Diplo_C", width: 256, height: 256, category: "herbivores" },
  { name: "Iguanodon", suffix: "_Iguanodon_C", width: 256, height: 256, category: "herbivores" },
  { name: "Mammoth", suffix: "_Mammoth_C", width: 256, height: 256, category: "herbivores" },
  { name: "Phiomia", suffix: "_Phiomia_C", width: 128, height: 128, category: "herbivores" },
  { name: "Moschops", suffix: "_Moschops_C", width: 256, height: 256, category: "herbivores" },
  { name: "Equus", suffix: "_Equus_C", width: 256, height: 256, category: "herbivores" },
  { name: "Pachycephalosaurus", suffix: "_Pachy_C", width: 128, height: 128, category: "herbivores" },

  // Flyers
  { name: "Pteranodon", suffix: "_Ptero_C", width: 256, height: 256, category: "flyers" },
  { name: "Argentavis", suffix: "_Argent_C", width: 256, height: 256, category: "flyers" },
  { name: "Quetzal", suffix: "_Quetz_C", width: 256, height: 256, category: "flyers" },
  { name: "Tapejara", suffix: "_Tapejara_C", width: 256, height: 256, category: "flyers" },
  { name: "Pelagornis", suffix: "_Pela_C", width: 256, height: 256, category: "flyers" },
  { name: "Griffin", suffix: "_Griffin_C", width: 256, height: 256, category: "flyers" },
  { name: "Snow Owl", suffix: "_SnowOwl_C", width: 256, height: 256, category: "flyers" },
  { name: "Wyvern", suffix: "_Wyvern_C", width: 256, height: 256, category: "flyers" },

  // Aquatic
  { name: "Megalodon", suffix: "_Megalodon_C", width: 256, height: 256, category: "aquatic" },
  { name: "Mosasaurus", suffix: "_Mosa_C", width: 256, height: 256, category: "aquatic" },
  { name: "Plesiosaur", suffix: "_Plesiosaur_C", width: 256, height: 256, category: "aquatic" },
  { name: "Ichthyosaurus", suffix: "_Ichthy_C", width: 256, height: 256, category: "aquatic" },
  { name: "Basilosaurus", suffix: "_Basilo_C", width: 256, height: 256, category: "aquatic" },
  { name: "Tusoteuthis", suffix: "_Tuso_C", width: 256, height: 256, category: "aquatic" },
  { name: "Dunkleosteus", suffix: "_Dunkleo_C", width: 256, height: 256, category: "aquatic" },

  // Misc Creatures
  { name: "Dodo", suffix: "_Dodo_C", width: 128, height: 128, category: "misc_creatures" },
  { name: "Compy", suffix: "_Compy_C", width: 128, height: 128, category: "misc_creatures" },
  { name: "Jerboa", suffix: "_Jerboa_C", width: 128, height: 128, category: "misc_creatures" },
  { name: "Otter", suffix: "_Otter_C", width: 128, height: 128, category: "misc_creatures" },
  { name: "Giant Bee", suffix: "_Bee_C", width: 128, height: 128, category: "misc_creatures" },
  { name: "Kairuku (Penguin)", suffix: "_Kairuku_C", width: 128, height: 128, category: "misc_creatures" },
  { name: "Mesopithecus", suffix: "_Meso_C", width: 128, height: 128, category: "misc_creatures" },
  { name: "Terror Bird", suffix: "_TerrorBird_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Daeodon", suffix: "_Daeodon_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Rock Drake", suffix: "_RockDrake_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Managarmr", suffix: "_Managarmr_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Gacha", suffix: "_Gacha_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Velonasaur", suffix: "_Velo_C", width: 256, height: 256, category: "misc_creatures" },
];

export const CATEGORY_LABELS: Record<TargetCategory, string> = {
  signs: "🖼️ Signs & Canvases",
  structures: "🏗️ Structures & Items",
  humans: "🧑 Human Characters",
  carnivores: "🦖 Carnivores",
  herbivores: "🦕 Herbivores",
  flyers: "🦅 Flyers",
  aquatic: "🐋 Aquatic",
  misc_creatures: "🐾 Misc Creatures",
};

export const CATEGORY_ORDER: TargetCategory[] = [
  "signs", "structures", "humans", "carnivores", "herbivores", "flyers", "aquatic", "misc_creatures"
];

export function getTargetsByCategory(): Record<TargetCategory, PaintingTarget[]> {
  const grouped = {} as Record<TargetCategory, PaintingTarget[]>;
  for (const cat of CATEGORY_ORDER) {
    grouped[cat] = PAINTING_TARGETS.filter(t => t.category === cat);
  }
  return grouped;
}

export function convertImageToPNT(
  imageData: ImageData,
  targetWidth: number,
  targetHeight: number,
  enabledColors: Set<number>,
  dithering: boolean
): PNTResult {
  // Scale image to target size using canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d")!;

  // Create temp canvas with source image
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = imageData.width;
  srcCanvas.height = imageData.height;
  const srcCtx = srcCanvas.getContext("2d")!;
  srcCtx.putImageData(imageData, 0, 0);

  // Draw scaled
  ctx.drawImage(srcCanvas, 0, 0, targetWidth, targetHeight);
  const scaledData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const pixels = scaledData.data;

  const totalPixels = targetWidth * targetHeight;
  const bits = new Uint8Array(totalPixels);

  // Working copy for dithering
  const workPixels = new Float32Array(pixels.length);
  for (let i = 0; i < pixels.length; i++) {
    workPixels[i] = pixels[i];
  }

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4;

      const r = Math.max(0, Math.min(255, Math.round(workPixels[idx])));
      const g = Math.max(0, Math.min(255, Math.round(workPixels[idx + 1])));
      const b = Math.max(0, Math.min(255, Math.round(workPixels[idx + 2])));
      const a = Math.max(0, Math.min(255, Math.round(workPixels[idx + 3])));

      const colorIndex = findClosestColorIndex(r, g, b, a, enabledColors);
      bits[y * targetWidth + x] = colorIndex;

      if (dithering && a >= 128) {
        const matched = getColorByIndex(colorIndex);
        if (matched) {
          const errR = r - matched.r;
          const errG = g - matched.g;
          const errB = b - matched.b;

          // Floyd-Steinberg dithering
          const distribute = (dx: number, dy: number, factor: number) => {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < targetWidth && ny >= 0 && ny < targetHeight) {
              const nIdx = (ny * targetWidth + nx) * 4;
              workPixels[nIdx] += errR * factor;
              workPixels[nIdx + 1] += errG * factor;
              workPixels[nIdx + 2] += errB * factor;
            }
          };

          distribute(1, 0, 7 / 16);
          distribute(-1, 1, 3 / 16);
          distribute(0, 1, 5 / 16);
          distribute(1, 1, 1 / 16);
        }
      }
    }
  }

  // Build preview ImageData
  const previewData = new ImageData(targetWidth, targetHeight);
  for (let i = 0; i < totalPixels; i++) {
    const colorIndex = bits[i];
    const color = getColorByIndex(colorIndex);
    const pIdx = i * 4;
    if (color) {
      previewData.data[pIdx] = color.r;
      previewData.data[pIdx + 1] = color.g;
      previewData.data[pIdx + 2] = color.b;
      previewData.data[pIdx + 3] = 255;
    } else {
      previewData.data[pIdx + 3] = 0; // transparent
    }
  }

  // Build PNT binary
  const headerSize = 20;
  const buffer = new ArrayBuffer(headerSize + totalPixels);
  const view = new DataView(buffer);

  view.setUint32(0, 1, true); // version = 1
  view.setInt32(4, targetWidth, true);
  view.setInt32(8, targetHeight, true);
  view.setUint32(12, 1, true); // revision = 1
  view.setInt32(16, totalPixels, true);

  const dataView = new Uint8Array(buffer, headerSize);
  dataView.set(bits);

  return {
    pntData: buffer,
    previewImageData: previewData,
    width: targetWidth,
    height: targetHeight,
  };
}

export function downloadPNT(data: ArrayBuffer, fileName: string) {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
