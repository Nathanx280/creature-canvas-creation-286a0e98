import { findClosestColorIndex, getColorByIndex } from "./ark-palette";

export interface PNTResult {
  pntData: ArrayBuffer;
  previewImageData: ImageData;
  width: number;
  height: number;
}

export type TargetCategory =
  | "signs"
  | "structures"
  | "humans"
  | "carnivores"
  | "herbivores"
  | "flyers"
  | "aquatic"
  | "misc_creatures"
  | "invertebrates"
  | "tek"
  | "saddles"
  | "armor"
  | "weapons"
  | "aberration"
  | "extinction"
  | "genesis"
  | "scorched"
  | "ragnarok";

export interface PaintingTarget {
  name: string;
  suffix: string;
  width: number;
  height: number;
  category: TargetCategory;
}

// ARK painting target types with their resolutions
export const PAINTING_TARGETS: PaintingTarget[] = [
  // Signs & Canvases (DO NOT MODIFY — confirmed working in-game)
  { name: "Painting Canvas", suffix: "_Sign_Large_Metal_C", width: 256, height: 256, category: "signs" },
  { name: "War Map", suffix: "_WarMap_C", width: 256, height: 256, category: "signs" },
  { name: "Wooden Sign", suffix: "_Sign_Small_Wood_C", width: 128, height: 128, category: "signs" },
  { name: "Wooden Billboard", suffix: "_Sign_Large_Wood_C", width: 256, height: 256, category: "signs" },
  { name: "Metal Sign", suffix: "_Sign_Small_Metal_C", width: 128, height: 128, category: "signs" },
  { name: "Metal Billboard", suffix: "_Sign_Large_Metal_C", width: 256, height: 256, category: "signs" },

  // Structures & Items (DO NOT MODIFY — confirmed working in-game)
  { name: "Single Flag", suffix: "_Flag_C", width: 256, height: 256, category: "structures" },
  { name: "Multi Panel Flag", suffix: "_FlagMultiPanel_C", width: 256, height: 384, category: "structures" },
  { name: "Shag Rug", suffix: "_Rug_C", width: 256, height: 256, category: "structures" },
  { name: "Spotlight", suffix: "_Spotlight_C", width: 256, height: 256, category: "structures" },
  { name: "Raft", suffix: "_Raft_C", width: 256, height: 256, category: "structures" },
  { name: "Shield", suffix: "_Shield_C", width: 128, height: 128, category: "structures" },
  { name: "Motorboat", suffix: "_Motorboat_C", width: 256, height: 256, category: "structures" },

  // ===== Additional Signs =====
  { name: "Wooden Wall Sign", suffix: "_Sign_Wall_Wood_C", width: 256, height: 128, category: "signs" },
  { name: "Metal Wall Sign", suffix: "_Sign_Wall_Metal_C", width: 256, height: 128, category: "signs" },
  { name: "Stone Sign", suffix: "_Sign_Small_Stone_C", width: 128, height: 128, category: "signs" },
  { name: "Adobe Sign", suffix: "_Sign_Small_Adobe_C", width: 128, height: 128, category: "signs" },
  { name: "Tek Sign", suffix: "_Sign_Small_Tek_C", width: 128, height: 128, category: "signs" },

  // ===== Additional Structures =====
  { name: "Bear Rug", suffix: "_BearRug_C", width: 256, height: 256, category: "structures" },
  { name: "Catapult", suffix: "_Catapult_C", width: 256, height: 256, category: "structures" },
  { name: "Ballista", suffix: "_Ballista_C", width: 256, height: 256, category: "structures" },
  { name: "Cannon", suffix: "_Cannon_C", width: 256, height: 256, category: "structures" },
  { name: "Stone Pillar", suffix: "_Pillar_Stone_C", width: 128, height: 256, category: "structures" },


  // ===== Human Characters =====
  { name: "Human (Male)", suffix: "_PlayerPawnTest_Male_C", width: 512, height: 512, category: "humans" },
  { name: "Human (Female)", suffix: "_PlayerPawnTest_Female_C", width: 512, height: 512, category: "humans" },

  // ===== Armor (paintable) =====
  { name: "Cloth Shirt", suffix: "_ClothShirt_C", width: 256, height: 256, category: "armor" },
  { name: "Cloth Pants", suffix: "_ClothPants_C", width: 256, height: 256, category: "armor" },
  { name: "Cloth Boots", suffix: "_ClothBoots_C", width: 256, height: 256, category: "armor" },
  { name: "Cloth Gloves", suffix: "_ClothGloves_C", width: 256, height: 256, category: "armor" },
  { name: "Cloth Hat", suffix: "_ClothHat_C", width: 256, height: 256, category: "armor" },
  { name: "Hide Shirt", suffix: "_HideShirt_C", width: 256, height: 256, category: "armor" },
  { name: "Hide Pants", suffix: "_HidePants_C", width: 256, height: 256, category: "armor" },
  { name: "Hide Boots", suffix: "_HideBoots_C", width: 256, height: 256, category: "armor" },
  { name: "Hide Gloves", suffix: "_HideGloves_C", width: 256, height: 256, category: "armor" },
  { name: "Hide Hat", suffix: "_HideHat_C", width: 256, height: 256, category: "armor" },
  { name: "Fur Chestpiece", suffix: "_FurShirt_C", width: 256, height: 256, category: "armor" },
  { name: "Fur Leggings", suffix: "_FurPants_C", width: 256, height: 256, category: "armor" },
  { name: "Fur Boots", suffix: "_FurBoots_C", width: 256, height: 256, category: "armor" },
  { name: "Chitin Chestpiece", suffix: "_ChitinShirt_C", width: 256, height: 256, category: "armor" },
  { name: "Chitin Leggings", suffix: "_ChitinPants_C", width: 256, height: 256, category: "armor" },
  { name: "Chitin Helmet", suffix: "_ChitinHat_C", width: 256, height: 256, category: "armor" },
  { name: "Flak Chestpiece", suffix: "_MetalShirt_C", width: 256, height: 256, category: "armor" },
  { name: "Flak Leggings", suffix: "_MetalPants_C", width: 256, height: 256, category: "armor" },
  { name: "Flak Helmet", suffix: "_MetalHat_C", width: 256, height: 256, category: "armor" },
  { name: "Riot Shield", suffix: "_RiotShield_C", width: 128, height: 128, category: "armor" },
  { name: "Wooden Shield", suffix: "_Shield_C", width: 128, height: 128, category: "armor" },
  { name: "Metal Shield", suffix: "_MetalShield_C", width: 128, height: 128, category: "armor" },

  // ===== Saddles =====
  { name: "Rex Saddle", suffix: "_Saddle_Rex_C", width: 256, height: 256, category: "saddles" },
  { name: "Trike Saddle", suffix: "_Saddle_Trike_C", width: 256, height: 256, category: "saddles" },
  { name: "Stego Saddle", suffix: "_Saddle_Stego_C", width: 256, height: 256, category: "saddles" },
  { name: "Bronto Platform Saddle", suffix: "_SaddlePlatform_Sauropod_C", width: 256, height: 256, category: "saddles" },
  { name: "Quetz Platform Saddle", suffix: "_SaddlePlatform_Quetz_C", width: 256, height: 256, category: "saddles" },
  { name: "Paracer Platform Saddle", suffix: "_SaddlePlatform_Paracer_C", width: 256, height: 256, category: "saddles" },
  { name: "Plesi Platform Saddle", suffix: "_SaddlePlatform_Plesiosaur_C", width: 256, height: 256, category: "saddles" },
  { name: "Mosa Platform Saddle", suffix: "_SaddlePlatform_Mosa_C", width: 256, height: 256, category: "saddles" },

  // ===== Carnivores =====
  { name: "Rex", suffix: "_Rex_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Raptor", suffix: "_Raptor_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Spino", suffix: "_Spino_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Carno", suffix: "_Carno_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Allosaurus", suffix: "_Allo_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Yutyrannus", suffix: "_Yuty_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Giganotosaurus", suffix: "_Gigant_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Therizinosaurus", suffix: "_Therizino_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Baryonyx", suffix: "_Baryonyx_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Dilophosaurus", suffix: "_Dilo_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Sabertooth", suffix: "_Saber_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Dire Wolf", suffix: "_Direwolf_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Thylacoleo", suffix: "_Thylacoleo_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Megalosaurus", suffix: "_Megalosaurus_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Cave Lion", suffix: "_Cave_Lion_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Hyaenodon", suffix: "_Hyaenodon_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Megalania", suffix: "_Megalania_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Kaprosuchus", suffix: "_Kaprosuchus_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Sarco", suffix: "_Sarco_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Purlovia", suffix: "_Purlovia_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Troodon", suffix: "_Troodon_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Microraptor", suffix: "_Microraptor_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Pegomastax", suffix: "_Pegomastax_Character_BP_C", width: 256, height: 256, category: "carnivores" },

  // ===== Herbivores =====
  { name: "Trike", suffix: "_Trike_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Stego", suffix: "_Stego_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Bronto", suffix: "_Sauropod_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Parasaur", suffix: "_Para_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Ankylosaurus", suffix: "_Ankylo_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Pachyrhinosaurus", suffix: "_Pachyrhino_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Diplodocus", suffix: "_Diplo_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Iguanodon", suffix: "_Iguanodon_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Mammoth", suffix: "_Mammoth_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Phiomia", suffix: "_Phiomia_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Moschops", suffix: "_Moschops_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Equus", suffix: "_Equus_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Pachycephalosaurus", suffix: "_Pachy_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Doedicurus", suffix: "_Doed_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Carbonemys", suffix: "_Turtle_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Castoroides", suffix: "_Beaver_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Chalicotherium", suffix: "_Chalico_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Paracer", suffix: "_Paracer_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Megaloceros", suffix: "_Stag_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Ovis", suffix: "_Sheep_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Procoptodon", suffix: "_Procoptodon_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Mesopithecus", suffix: "_Monkey_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Gigantopithecus", suffix: "_Bigfoot_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Gallimimus", suffix: "_Galli_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Lystrosaurus", suffix: "_Lystro_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Woolly Rhino", suffix: "_Rhino_Character_BP_C", width: 256, height: 256, category: "herbivores" },

  // ===== Flyers =====
  { name: "Pteranodon", suffix: "_Ptero_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Argentavis", suffix: "_Argent_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Quetzal", suffix: "_Quetz_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Tapejara", suffix: "_Tapejara_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Pelagornis", suffix: "_Pela_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Griffin", suffix: "_Griffin_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Snow Owl", suffix: "_Owl_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Wyvern (Fire)", suffix: "_Wyvern_Character_BP_Fire_C", width: 256, height: 256, category: "flyers" },
  { name: "Wyvern (Lightning)", suffix: "_Wyvern_Character_BP_Lightning_C", width: 256, height: 256, category: "flyers" },
  { name: "Wyvern (Poison)", suffix: "_Wyvern_Character_BP_Poison_C", width: 256, height: 256, category: "flyers" },
  { name: "Wyvern (Ice)", suffix: "_Wyvern_Character_BP_Ice_C", width: 256, height: 256, category: "flyers" },
  { name: "Crystal Wyvern (Blood)", suffix: "_CrystalWyvern_Character_BP_Blood_C", width: 256, height: 256, category: "flyers" },
  { name: "Crystal Wyvern (Tropical)", suffix: "_CrystalWyvern_Character_BP_WS_C", width: 256, height: 256, category: "flyers" },
  { name: "Crystal Wyvern (Ember)", suffix: "_CrystalWyvern_Character_BP_Ember_C", width: 256, height: 256, category: "flyers" },
  { name: "Dimorphodon", suffix: "_Dimorph_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Archaeopteryx", suffix: "_Archa_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Tropeognathus", suffix: "_Tropeognathus_Character_BP_C", width: 256, height: 256, category: "flyers" },

  // ===== Aquatic =====
  { name: "Megalodon", suffix: "_Megalodon_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Mosasaurus", suffix: "_Mosa_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Plesiosaur", suffix: "_Plesiosaur_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Ichthyosaurus", suffix: "_Dolphin_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Basilosaurus", suffix: "_Basilosaurus_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Tusoteuthis", suffix: "_Tusoteuthis_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Dunkleosteus", suffix: "_Dunkleo_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Angler", suffix: "_Angler_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Beelzebufo", suffix: "_Toad_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Manta", suffix: "_Manta_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Sabertooth Salmon", suffix: "_Salmon_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Coelacanth", suffix: "_Coel_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Piranha", suffix: "_Piranha_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Electrophorus", suffix: "_Eel_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Trilobite", suffix: "_Trilobite_Character_BP_C", width: 256, height: 256, category: "aquatic" },

  // ===== Misc Creatures =====
  { name: "Dodo", suffix: "_Dodo_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Compy", suffix: "_Compy_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Jerboa", suffix: "_Jerboa_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Otter", suffix: "_Otter_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Kairuku (Penguin)", suffix: "_Kairuku_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Terror Bird", suffix: "_TerrorBird_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Daeodon", suffix: "_Daeodon_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Achatina", suffix: "_Achatina_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Dimetrodon", suffix: "_Dimetro_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Diplocaulus", suffix: "_Diplocaulus_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Hesperornis", suffix: "_Hesperornis_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Ichthyornis", suffix: "_Ichthyornis_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Vulture", suffix: "_Vulture_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },

  // ===== Invertebrates / Insects =====
  { name: "Giant Bee", suffix: "_Bee_Character_BP_C", width: 256, height: 256, category: "invertebrates" },
  { name: "Arthropluera", suffix: "_Arthro_Character_BP_C", width: 256, height: 256, category: "invertebrates" },
  { name: "Araneo (Spider)", suffix: "_SpiderS_Character_BP_C", width: 256, height: 256, category: "invertebrates" },
  { name: "Pulmonoscorpius", suffix: "_Scorpion_Character_BP_C", width: 256, height: 256, category: "invertebrates" },
  { name: "Onyc (Bat)", suffix: "_Bat_Character_BP_C", width: 256, height: 256, category: "invertebrates" },
  { name: "Meganeura", suffix: "_Dragonfly_Character_BP_C", width: 256, height: 256, category: "invertebrates" },
  { name: "Titanomyrma (Soldier)", suffix: "_Ant_Character_BP_C", width: 256, height: 256, category: "invertebrates" },
  { name: "Mantis", suffix: "_Mantis_Character_BP_C", width: 256, height: 256, category: "invertebrates" },

  // ===== Tek Variants =====
  { name: "Tek Rex", suffix: "_BionicRex_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Raptor", suffix: "_BionicRaptor_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Giganotosaurus", suffix: "_BionicGigant_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Stego", suffix: "_BionicStego_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Trike", suffix: "_BionicTrike_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Parasaur", suffix: "_BionicPara_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Quetzal", suffix: "_BionicQuetz_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Mosasaurus", suffix: "_BionicMosa_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Enforcer", suffix: "_Enforcer_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Mek", suffix: "_Mek_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Scout", suffix: "_Scout_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Helmet", suffix: "_TekHat_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Chestpiece", suffix: "_TekShirt_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Leggings", suffix: "_TekPants_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Boots", suffix: "_TekBoots_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Gauntlets", suffix: "_TekGloves_C", width: 256, height: 256, category: "tek" },

  // ===== Aberration =====
  { name: "Rock Drake", suffix: "_RockDrake_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Karkinos", suffix: "_Crab_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Basilisk", suffix: "_Basilisk_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Reaper King", suffix: "_Xenomorph_Character_BP_Male_C", width: 256, height: 256, category: "aberration" },
  { name: "Ravager", suffix: "_CaveWolf_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Roll Rat", suffix: "_MoleRat_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Bulbdog", suffix: "_LanternPug_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Featherlight", suffix: "_LanternBird_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Glowtail", suffix: "_LanternLizard_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Shinehorn", suffix: "_LanternGoat_Character_BP_C", width: 256, height: 256, category: "aberration" },
  { name: "Hazard Suit Hat", suffix: "_HazardSuitHat_C", width: 256, height: 256, category: "aberration" },
  { name: "Hazard Suit Shirt", suffix: "_HazardSuitShirt_C", width: 256, height: 256, category: "aberration" },

  // ===== Extinction =====
  { name: "Managarmr", suffix: "_IceJumper_Character_BP_C", width: 256, height: 256, category: "extinction" },
  { name: "Gacha", suffix: "_Gacha_Character_BP_C", width: 256, height: 256, category: "extinction" },
  { name: "Velonasaur", suffix: "_Spindles_Character_BP_C", width: 256, height: 256, category: "extinction" },
  { name: "Gasbags", suffix: "_Gasbags_Character_BP_C", width: 256, height: 256, category: "extinction" },
  { name: "Snow Owl (EX)", suffix: "_Owl_Character_BP_EX_C", width: 256, height: 256, category: "extinction" },

  // ===== Genesis =====
  { name: "Magmasaur", suffix: "_Cherufe_Character_BP_C", width: 256, height: 256, category: "genesis" },
  { name: "Astrocetus", suffix: "_SpaceWhale_Character_BP_C", width: 256, height: 256, category: "genesis" },
  { name: "Astrodelphis", suffix: "_SpaceDolphin_Character_BP_C", width: 256, height: 256, category: "genesis" },
  { name: "Bloodstalker", suffix: "_BogSpider_Character_BP_C", width: 256, height: 256, category: "genesis" },
  { name: "Megachelon", suffix: "_GiantTurtle_Character_BP_C", width: 256, height: 256, category: "genesis" },
  { name: "Ferox (Small)", suffix: "_Shapeshifter_Small_Character_BP_C", width: 256, height: 256, category: "genesis" },
  { name: "Noglin", suffix: "_BrainSlug_Character_BP_C", width: 256, height: 256, category: "genesis" },
  { name: "Stryder", suffix: "_TekStrider_Character_BP_C", width: 256, height: 256, category: "genesis" },
  { name: "Maewing", suffix: "_Platypus_Character_BP_C", width: 256, height: 256, category: "genesis" },

  // ===== Scorched Earth =====
  { name: "Rock Elemental", suffix: "_RockGolem_Character_BP_C", width: 256, height: 256, category: "scorched" },
  { name: "Thorny Dragon", suffix: "_SpineyLizard_Character_BP_C", width: 256, height: 256, category: "scorched" },
  { name: "Morellatops", suffix: "_Camelsaurus_Character_BP_C", width: 256, height: 256, category: "scorched" },
  { name: "Jug Bug", suffix: "_JugBug_Character_BP_Oil_C", width: 256, height: 256, category: "scorched" },
  { name: "Lymantria", suffix: "_Moth_Character_BP_C", width: 256, height: 256, category: "scorched" },
  { name: "Mantis (SE)", suffix: "_Mantis_Character_BP_SE_C", width: 256, height: 256, category: "scorched" },
  { name: "Desert Cloth Hat", suffix: "_DesertClothHat_C", width: 256, height: 256, category: "scorched" },
  { name: "Desert Cloth Shirt", suffix: "_DesertClothShirt_C", width: 256, height: 256, category: "scorched" },

  // ===== Ragnarok =====
  { name: "Iceworm Queen", suffix: "_Iceworm_Character_BP_C", width: 256, height: 256, category: "ragnarok" },
  { name: "Lava Elemental", suffix: "_LavaGolem_Character_BP_C", width: 256, height: 256, category: "ragnarok" },
  { name: "Polar Bear", suffix: "_PolarBear_Character_BP_C", width: 256, height: 256, category: "ragnarok" },

  // ===== More Carnivores =====
  { name: "Megalodon (Alpha)", suffix: "_MegaMegalodon_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Alpha Rex", suffix: "_MegaRex_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Alpha Raptor", suffix: "_MegaRaptor_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Alpha Carno", suffix: "_MegaCarno_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Andrewsarchus", suffix: "_Andrewsarchus_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Carcharodontosaurus", suffix: "_Carcha_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Fasolasuchus", suffix: "_Fasolasuchus_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Fenrir", suffix: "_Fenrir_Character_BP_C", width: 256, height: 256, category: "carnivores" },
  { name: "Cosmo", suffix: "_Cosmo_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },

  // ===== More Herbivores =====
  { name: "Amargasaurus", suffix: "_Amargasaurus_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Brontosaurus (Alpha)", suffix: "_MegaSauropod_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Deinotherium", suffix: "_Deinotherium_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Gigantoraptor", suffix: "_Gigantoraptor_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Megatherium", suffix: "_Megatherium_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Glyptodon", suffix: "_Glyptodon_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Therizinosaur (Alpha)", suffix: "_MegaTherizino_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Xiphactinus", suffix: "_Xiphactinus_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Yi Ling", suffix: "_YiLing_Character_BP_C", width: 256, height: 256, category: "herbivores" },
  { name: "Oviraptor", suffix: "_Oviraptor_Character_BP_C", width: 256, height: 256, category: "herbivores" },

  // ===== More Flyers =====
  { name: "Voidwyrm (Tek)", suffix: "_TekWyvern_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Sinomacrops", suffix: "_Sinomacrops_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Desmodus (Vampire Bat)", suffix: "_Desmodus_Character_BP_C", width: 256, height: 256, category: "flyers" },
  { name: "Wyvern (Forest)", suffix: "_Wyvern_Character_BP_Forest_C", width: 256, height: 256, category: "flyers" },
  { name: "Wyvern (Bone)", suffix: "_Bone_Wyvern_Character_BP_Fire_C", width: 256, height: 256, category: "flyers" },

  // ===== More Aquatic =====
  { name: "Cnidaria (Jellyfish)", suffix: "_Jellyfish_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Liopleurodon", suffix: "_Liopleurodon_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Leedsichthys", suffix: "_Leedsichthys_Character_BP_C", width: 256, height: 256, category: "aquatic" },
  { name: "Otter (Alpha)", suffix: "_MegaOtter_Character_BP_C", width: 256, height: 256, category: "aquatic" },

  // ===== More Misc Creatures =====
  { name: "Lystrosaurus (Baby)", suffix: "_BabyLystro_Character_BP_C", width: 256, height: 256, category: "misc_creatures" },
  { name: "Megalodon (Tek)", suffix: "_BionicMegalodon_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Argentavis", suffix: "_BionicArgent_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Sabertooth", suffix: "_BionicSaber_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Tek Bronto", suffix: "_BionicSauropod_Character_BP_C", width: 256, height: 256, category: "tek" },
  { name: "Hover Skiff", suffix: "_HoverSkiff_C", width: 256, height: 256, category: "tek" },

  // ===== More Saddles =====
  { name: "Argent Saddle", suffix: "_Saddle_Argent_C", width: 256, height: 256, category: "saddles" },
  { name: "Quetz Saddle", suffix: "_Saddle_Quetz_C", width: 256, height: 256, category: "saddles" },
  { name: "Ptero Saddle", suffix: "_Saddle_Ptero_C", width: 256, height: 256, category: "saddles" },
  { name: "Tapejara Saddle", suffix: "_Saddle_Tapejara_C", width: 256, height: 256, category: "saddles" },
  { name: "Wyvern Saddle", suffix: "_Saddle_Wyvern_C", width: 256, height: 256, category: "saddles" },
  { name: "Griffin Saddle", suffix: "_Saddle_Griffin_C", width: 256, height: 256, category: "saddles" },
  { name: "Carno Saddle", suffix: "_Saddle_Carno_C", width: 256, height: 256, category: "saddles" },
  { name: "Spino Saddle", suffix: "_Saddle_Spino_C", width: 256, height: 256, category: "saddles" },
  { name: "Allo Saddle", suffix: "_Saddle_Allo_C", width: 256, height: 256, category: "saddles" },
  { name: "Yuty Saddle", suffix: "_Saddle_Yuty_C", width: 256, height: 256, category: "saddles" },
  { name: "Giga Saddle", suffix: "_Saddle_Gigant_C", width: 256, height: 256, category: "saddles" },
  { name: "Therizino Saddle", suffix: "_Saddle_Therizino_C", width: 256, height: 256, category: "saddles" },
  { name: "Mammoth Saddle", suffix: "_Saddle_Mammoth_C", width: 256, height: 256, category: "saddles" },
  { name: "Doedic Saddle", suffix: "_Saddle_Doed_C", width: 256, height: 256, category: "saddles" },
  { name: "Ankylo Saddle", suffix: "_Saddle_Ankylo_C", width: 256, height: 256, category: "saddles" },
  { name: "Direwolf Saddle", suffix: "_Saddle_Direwolf_C", width: 256, height: 256, category: "saddles" },
  { name: "Sabertooth Saddle", suffix: "_Saddle_Saber_C", width: 256, height: 256, category: "saddles" },
  { name: "Megalodon Saddle", suffix: "_Saddle_Megalodon_C", width: 256, height: 256, category: "saddles" },
  { name: "Basilo Saddle", suffix: "_Saddle_Basilosaurus_C", width: 256, height: 256, category: "saddles" },
  { name: "Tuso Saddle", suffix: "_Saddle_Tusoteuthis_C", width: 256, height: 256, category: "saddles" },
  { name: "Magmasaur Saddle", suffix: "_Saddle_Cherufe_C", width: 256, height: 256, category: "saddles" },
  { name: "Karkinos Saddle", suffix: "_Saddle_Crab_C", width: 256, height: 256, category: "saddles" },
  { name: "Rock Drake Saddle", suffix: "_Saddle_RockDrake_C", width: 256, height: 256, category: "saddles" },
  { name: "Tek Rex Saddle", suffix: "_TekSaddle_Rex_C", width: 256, height: 256, category: "saddles" },

  // ===== More Armor =====
  { name: "Ghillie Shirt", suffix: "_GhillieShirt_C", width: 256, height: 256, category: "armor" },
  { name: "Ghillie Pants", suffix: "_GhilliePants_C", width: 256, height: 256, category: "armor" },
  { name: "Ghillie Boots", suffix: "_GhillieBoots_C", width: 256, height: 256, category: "armor" },
  { name: "Ghillie Gloves", suffix: "_GhillieGloves_C", width: 256, height: 256, category: "armor" },
  { name: "Ghillie Hat", suffix: "_GhillieHat_C", width: 256, height: 256, category: "armor" },
  { name: "SCUBA Goggles", suffix: "_ScubaGoggles_C", width: 256, height: 256, category: "armor" },
  { name: "SCUBA Tank", suffix: "_ScubaTank_C", width: 256, height: 256, category: "armor" },
  { name: "SCUBA Flippers", suffix: "_ScubaFlippers_C", width: 256, height: 256, category: "armor" },
  { name: "SCUBA Leggings", suffix: "_ScubaLeggings_C", width: 256, height: 256, category: "armor" },
  { name: "Riot Shirt", suffix: "_RiotShirt_C", width: 256, height: 256, category: "armor" },
  { name: "Riot Pants", suffix: "_RiotPants_C", width: 256, height: 256, category: "armor" },
  { name: "Riot Boots", suffix: "_RiotBoots_C", width: 256, height: 256, category: "armor" },
  { name: "Riot Gauntlets", suffix: "_RiotGloves_C", width: 256, height: 256, category: "armor" },
  { name: "Riot Helmet", suffix: "_RiotHat_C", width: 256, height: 256, category: "armor" },

  // ===== Weapons =====
  { name: "Crossbow", suffix: "_Crossbow_C", width: 256, height: 256, category: "weapons" },
  { name: "Longneck Rifle", suffix: "_LongneckRifle_C", width: 256, height: 256, category: "weapons" },
  { name: "Assault Rifle", suffix: "_AssaultRifle_C", width: 256, height: 256, category: "weapons" },
  { name: "Pump-Action Shotgun", suffix: "_PumpShotgun_C", width: 256, height: 256, category: "weapons" },
  { name: "Fabricated Sniper", suffix: "_FabricatedSniper_C", width: 256, height: 256, category: "weapons" },
  { name: "Tek Rifle", suffix: "_TekRifle_C", width: 256, height: 256, category: "weapons" },
  { name: "Tek Sword", suffix: "_TekSword_C", width: 256, height: 256, category: "weapons" },
  { name: "Bow", suffix: "_Bow_C", width: 256, height: 256, category: "weapons" },
  { name: "Compound Bow", suffix: "_CompoundBow_C", width: 256, height: 256, category: "weapons" },
  { name: "Pike", suffix: "_Pike_C", width: 256, height: 256, category: "weapons" },
  { name: "Sword", suffix: "_Sword_C", width: 256, height: 256, category: "weapons" },
  { name: "Whip", suffix: "_Whip_C", width: 256, height: 256, category: "weapons" },

  // ===== More Structures =====
  { name: "Wooden Wall", suffix: "_Wall_Wood_C", width: 256, height: 256, category: "structures" },
  { name: "Wooden Door", suffix: "_Door_Wood_C", width: 128, height: 256, category: "structures" },
  { name: "Stone Wall", suffix: "_Wall_Stone_C", width: 256, height: 256, category: "structures" },
  { name: "Metal Wall", suffix: "_Wall_Metal_C", width: 256, height: 256, category: "structures" },
  { name: "Tek Wall", suffix: "_Wall_Tek_C", width: 256, height: 256, category: "structures" },
  { name: "Greenhouse Wall", suffix: "_Wall_Greenhouse_C", width: 256, height: 256, category: "structures" },
  { name: "Storage Box", suffix: "_StorageBox_C", width: 256, height: 256, category: "structures" },
  { name: "Vault", suffix: "_Vault_C", width: 256, height: 256, category: "structures" },
  { name: "Smithy", suffix: "_Smithy_C", width: 256, height: 256, category: "structures" },
  { name: "Industrial Forge", suffix: "_IndustrialForge_C", width: 256, height: 256, category: "structures" },
  { name: "Refrigerator", suffix: "_Refrigerator_C", width: 256, height: 256, category: "structures" },
  { name: "Bookshelf", suffix: "_Bookshelf_C", width: 256, height: 256, category: "structures" },
  { name: "Wooden Table", suffix: "_Table_Wood_C", width: 256, height: 256, category: "structures" },
  { name: "Wooden Chair", suffix: "_Chair_Wood_C", width: 256, height: 256, category: "structures" },
];

export const CATEGORY_LABELS: Record<TargetCategory, string> = {
  signs: "🖼️ Signs & Canvases",
  structures: "🏗️ Structures & Items",
  humans: "🧑 Human Characters",
  armor: "🛡️ Armor & Shields",
  saddles: "🪑 Saddles",
  carnivores: "🦖 Carnivores",
  herbivores: "🦕 Herbivores",
  flyers: "🦅 Flyers",
  aquatic: "🐋 Aquatic",
  misc_creatures: "🐾 Misc Creatures",
  invertebrates: "🕷️ Invertebrates",
  tek: "⚡ Tek",
  weapons: "⚔️ Weapons",
  aberration: "🌌 Aberration",
  extinction: "☄️ Extinction",
  genesis: "🌀 Genesis",
  scorched: "🏜️ Scorched Earth",
  ragnarok: "🗻 Ragnarok",
};

export const CATEGORY_ORDER: TargetCategory[] = [
  "signs", "structures", "humans", "armor", "saddles",
  "carnivores", "herbivores", "flyers", "aquatic", "misc_creatures", "invertebrates",
  "tek", "weapons", "aberration", "extinction", "genesis", "scorched", "ragnarok",
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
