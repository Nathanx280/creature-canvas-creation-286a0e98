# Creature Canvas Creation

Creature Canvas Creation is a professional ARK painting studio that converts images into fully compatible `.pnt` files, with advanced editing, palette control, preview systems, and batch export tools.

It is designed to provide a complete workflow for creating high-quality ARK paintings for creatures, signs, and structures.

---

## 🧠 Core Workflow

1. Upload image  
2. Adjust image (brightness, contrast, etc.)  
3. Select ARK painting target  
4. Apply palette (manual or auto)  
5. Enable dithering (optional)  
6. Preview result (live)  
7. Compare original vs converted  
8. Export `.pnt` (single or batch)

---

## 🔥 Features

### 🎨 ARK PNT Conversion
- Converts images into ARK `.pnt` format
- Uses official ARK dye palette
- Outputs game-ready painting files

---

### 🎯 Target System
Supports a wide range of ARK painting targets:

- Signs & canvases  
- Creatures (dinos)  
- Structures  
- Humans  
- Saddles / armor  
- Tek / DLC maps  

Each target includes:
- resolution (width/height)
- file suffix
- category grouping

---

### 🎨 Palette System

#### Manual Control
- Toggle individual ARK colors
- Fine-tune palette usage

#### Auto Palette
- Automatically selects best colors from image
- Improves visual accuracy

---

### 🧠 Dithering Engine
- Optional dithering toggle
- Reduces banding
- Improves color transitions with limited palette

---

### 🖼️ Image Adjustments
Adjust before conversion:

- brightness  
- contrast  
- saturation  

Includes:
- undo / redo history

---

### 🔍 Comparison Mode
- Before vs after slider
- Helps optimize final output

---

### 🦖 Creature Preview
- Shows painting on creature silhouettes
- Simulates in-game appearance

---

### 📊 Stats Dashboard
- Color usage breakdown
- Conversion stats
- Helps optimize quality

---

### 📦 Batch Export
- Export multiple targets at once
- Automatically bundles into `.zip` (JSZip)
- Great for multi-use designs

---

### ⭐ Favorites & Recents
- Save frequently used targets
- Track recently used targets
- Stored in localStorage

---

### ⚡ Command Palette
- Fast action/search interface
- Power-user workflow

---

## 🧱 Tech Stack

- Vite  
- React  
- TypeScript  
- Tailwind CSS  
- shadcn-ui  
- Canvas API  
- JSZip  
- React Router  
- TanStack React Query  
- Vitest / Playwright  

---

## 📁 Structure

```bash
src/
├─ components/
│  ├─ ImagePreview.tsx
│  ├─ ComparisonSlider.tsx
│  ├─ CreatureDisplay.tsx
│  ├─ ColorPalette.tsx
│  ├─ ImageAdjustments.tsx
│  ├─ StatsDashboard.tsx
│  └─ TargetSelector.tsx

├─ lib/
│  ├─ pnt-converter.ts
│  ├─ ark-palette.ts
│  ├─ auto-palette.ts
│  ├─ image-adjustments.ts
│  └─ creature-data.ts

├─ pages/
│  └─ Index.tsx
