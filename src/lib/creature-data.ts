// Real ARK creature paint region data + dossier info
// Region indices (0-5) match ARK's in-game color region system
// Sources: ARK Wiki dossier pages, Dododex creature profiles (paint region docs)

export type Diet = "Carnivore" | "Herbivore" | "Omnivore" | "Piscivore" | "Insectivore" | "Sanguinivore" | "N/A";
export type Temperament =
  | "Aggressive" | "Defensive" | "Docile" | "Skittish" | "Territorial"
  | "Passive" | "Reactive" | "Patient" | "Friendly" | "Short-Tempered"
  | "Curious" | "Cowardly" | "Naive" | "Oblivious" | "Hostile" | "Neutral" | "N/A";

export type Archetype =
  | "theropod"      // Rex, Carno, Allo
  | "small_theropod" // Raptor, Compy
  | "sauropod"      // Bronto, Diplo
  | "quadruped"     // Trike, Stego
  | "mammal"        // Wolf, Saber, Mammoth
  | "small_mammal"  // Otter, Jerboa
  | "flyer"         // Ptero, Argent, Wyvern
  | "small_flyer"   // Dimorph, Bat
  | "aquatic_fish"  // Megalodon, Manta
  | "aquatic_long"  // Mosa, Plesi, Basilo
  | "aquatic_squid" // Tuso
  | "biped"         // Therizino, Galli, Mek
  | "ape"           // Gigantopithecus, Mesopithecus
  | "lizard"        // Sarco, Megalania, Basilisk
  | "turtle"        // Carbonemys, Megachelon
  | "insect"        // Mantis, Bee, Dragonfly
  | "spider"        // Araneo, Bloodstalker
  | "scorpion"      // Pulmonoscorpius
  | "worm"          // Reaper, Karkinos
  | "snake"         // Basilisk
  | "blob"          // Gasbags, Ferox
  | "human"         // Players
  | "tek_mech"      // Mek, Enforcer, Stryder
  | "armor"         // Armor pieces
  | "saddle"        // Saddles
  | "structure";    // Signs, flags, etc.

export interface PaintRegion {
  index: number;
  name: string;
  // Approximate rectangular region on a normalized silhouette (0-1)
  // x, y, w, h
  hint?: { x: number; y: number; w: number; h: number };
}

export interface CreatureInfo {
  diet: Diet;
  temperament: Temperament;
  archetype: Archetype;
  description: string;
  regions: PaintRegion[];
  // Dye-cost reference (most creatures need 1 dye per applied region)
  paintable: boolean;
}

// Common region presets (verified from ARK Wiki dossier color region pages)
const STANDARD_BODY: PaintRegion[] = [
  { index: 0, name: "Body Main", hint: { x: 0.25, y: 0.4, w: 0.5, h: 0.35 } },
  { index: 1, name: "Body Accent", hint: { x: 0.3, y: 0.45, w: 0.4, h: 0.2 } },
  { index: 4, name: "Highlights", hint: { x: 0.55, y: 0.35, w: 0.25, h: 0.3 } },
  { index: 5, name: "Underside", hint: { x: 0.3, y: 0.6, w: 0.4, h: 0.2 } },
];

const REX_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main", hint: { x: 0.25, y: 0.45, w: 0.5, h: 0.3 } },
  { index: 1, name: "Patterning", hint: { x: 0.35, y: 0.5, w: 0.35, h: 0.2 } },
  { index: 4, name: "Spine & Tail Top", hint: { x: 0.4, y: 0.35, w: 0.45, h: 0.15 } },
  { index: 5, name: "Underbelly", hint: { x: 0.3, y: 0.65, w: 0.4, h: 0.2 } },
];

const RAPTOR_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main" },
  { index: 1, name: "Stripes" },
  { index: 4, name: "Feathers/Quills" },
  { index: 5, name: "Belly" },
];

const SAUROPOD_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main" },
  { index: 4, name: "Back Plates/Spine" },
  { index: 5, name: "Belly & Legs" },
];

const STEGO_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main" },
  { index: 1, name: "Plate Edges" },
  { index: 4, name: "Plates Top" },
  { index: 5, name: "Underside" },
];

const TRIKE_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main" },
  { index: 1, name: "Frill Pattern" },
  { index: 2, name: "Frill Border" },
  { index: 4, name: "Horns/Spikes" },
  { index: 5, name: "Belly" },
];

const WYVERN_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main" },
  { index: 1, name: "Wing Membrane" },
  { index: 2, name: "Spine Pattern" },
  { index: 4, name: "Wing Edges" },
  { index: 5, name: "Underside" },
];

const FLYER_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main" },
  { index: 1, name: "Wing Pattern" },
  { index: 4, name: "Wing Tips" },
  { index: 5, name: "Underside" },
];

const FISH_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main" },
  { index: 4, name: "Back/Top" },
  { index: 5, name: "Belly" },
];

const MAMMAL_REGIONS: PaintRegion[] = [
  { index: 0, name: "Body Main" },
  { index: 1, name: "Pattern/Stripes" },
  { index: 4, name: "Mane/Top" },
  { index: 5, name: "Belly & Paws" },
];

const TEK_REGIONS: PaintRegion[] = [
  { index: 0, name: "Plating Main" },
  { index: 1, name: "Tek Glow Accent" },
  { index: 4, name: "Trim/Edges" },
  { index: 5, name: "Joints" },
];

const ARMOR_REGIONS: PaintRegion[] = [
  { index: 0, name: "Primary" },
  { index: 1, name: "Secondary" },
  { index: 2, name: "Accent" },
  { index: 4, name: "Trim" },
];

const STRUCTURE_REGIONS: PaintRegion[] = [
  { index: 0, name: "Whole Surface" },
];

// Map keyed by the unique target suffix (matches PAINTING_TARGETS.suffix)
export const CREATURE_DATA: Record<string, CreatureInfo> = {
  // ===== Humans =====
  "_PlayerPawnTest_Male_C": {
    diet: "Omnivore", temperament: "N/A", archetype: "human", paintable: true,
    description: "Survivor body paint canvas. Used for tribal markings and skin art.",
    regions: [
      { index: 0, name: "Skin (full body)" },
      { index: 1, name: "Face" },
      { index: 2, name: "Torso" },
      { index: 3, name: "Arms" },
      { index: 4, name: "Legs" },
    ],
  },
  "_PlayerPawnTest_Female_C": {
    diet: "Omnivore", temperament: "N/A", archetype: "human", paintable: true,
    description: "Survivor body paint canvas. Used for tribal markings and skin art.",
    regions: [
      { index: 0, name: "Skin (full body)" },
      { index: 1, name: "Face" },
      { index: 2, name: "Torso" },
      { index: 3, name: "Arms" },
      { index: 4, name: "Legs" },
    ],
  },

  // ===== Carnivores =====
  "_Rex_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "theropod", paintable: true,
    description: "Tyrannosaurus dominator. Apex predator of the island. Large saddle, thunderous roar.",
    regions: REX_REGIONS,
  },
  "_Raptor_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "small_theropod", paintable: true,
    description: "Utahraptor prime. Pack hunter — alpha gets a damage and damage-resist buff.",
    regions: RAPTOR_REGIONS,
  },
  "_Spino_Character_BP_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "theropod", paintable: true,
    description: "Spinosaurus aquareliga. Switches between bipedal and quadrupedal stances. Buffed near water.",
    regions: [
      { index: 0, name: "Body Main" },
      { index: 1, name: "Sail Pattern" },
      { index: 4, name: "Sail Top" },
      { index: 5, name: "Underbelly" },
    ],
  },
  "_Carno_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "theropod", paintable: true,
    description: "Carnotaurus pressor. Fast, agile carnivore with bull-like horns. Good early-game mount.",
    regions: REX_REGIONS,
  },
  "_Allo_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "theropod", paintable: true,
    description: "Allosaurus therotribus. Pack hunter (groups of 3). Inflicts a bleed effect on bite.",
    regions: REX_REGIONS,
  },
  "_Yuty_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "theropod", paintable: true,
    description: "Yutyrannus saevus. Roars to buff allies and terrify enemies. Support carnivore.",
    regions: [
      { index: 0, name: "Body Main" },
      { index: 1, name: "Feather Pattern" },
      { index: 4, name: "Feather Tips" },
      { index: 5, name: "Underside" },
    ],
  },
  "_Gigant_Character_BP_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "theropod", paintable: true,
    description: "Giganotosaurus furiosa. Largest carnivore. Enrages when hit — extreme damage.",
    regions: REX_REGIONS,
  },
  "_Therizino_Character_BP_C": {
    diet: "Herbivore", temperament: "Short-Tempered", archetype: "biped", paintable: true,
    description: "Therizinosaurus multiensis. Massive scythe-clawed herbivore. Versatile harvester.",
    regions: [
      { index: 0, name: "Body Main" },
      { index: 1, name: "Feather Pattern" },
      { index: 4, name: "Feather Highlights" },
      { index: 5, name: "Belly" },
    ],
  },
  "_Baryonyx_Character_BP_C": {
    diet: "Piscivore", temperament: "Aggressive", archetype: "theropod", paintable: true,
    description: "Baryonyx aquafulgur. Stuns aquatic creatures with tail-spin attack.",
    regions: REX_REGIONS,
  },
  "_Dilo_Character_BP_C": {
    diet: "Carnivore", temperament: "Defensive", archetype: "small_theropod", paintable: true,
    description: "Dilophosaurus sputatrix. Spits blinding venom that slows enemies.",
    regions: [
      { index: 0, name: "Body Main" },
      { index: 1, name: "Frill" },
      { index: 4, name: "Crests" },
      { index: 5, name: "Belly" },
    ],
  },
  "_Saber_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "mammal", paintable: true,
    description: "Smilodon brutalis. Fast carnivore with high damage output. Climbs cliffs.",
    regions: MAMMAL_REGIONS,
  },
  "_Direwolf_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "mammal", paintable: true,
    description: "Canis maximus. Pack hunter. Detects nearby creatures with howl.",
    regions: MAMMAL_REGIONS,
  },
  "_Thylacoleo_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "mammal", paintable: true,
    description: "Thylacoleo furtimorsus. Tree-climbing ambush predator.",
    regions: MAMMAL_REGIONS,
  },
  "_Megalosaurus_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "theropod", paintable: true,
    description: "Megalosaurus noctedominus. Nocturnal — buffed at night, drowsy by day.",
    regions: REX_REGIONS,
  },
  "_Hyaenodon_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "small_mammal", paintable: true,
    description: "Hyaenodon dirus. Pack scavenger with healing aura.",
    regions: MAMMAL_REGIONS,
  },
  "_Megalania_Character_BP_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "lizard", paintable: true,
    description: "Megalania prisca. Wall-climbing venomous lizard.",
    regions: STANDARD_BODY,
  },
  "_Kaprosuchus_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "lizard", paintable: true,
    description: "Kaprosuchus aquautilis. Snatches and drags small targets.",
    regions: STANDARD_BODY,
  },
  "_Sarco_Character_BP_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "lizard", paintable: true,
    description: "Sarcosuchus excubitor. Amphibious. Good early water mount.",
    regions: STANDARD_BODY,
  },
  "_Purlovia_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "small_mammal", paintable: true,
    description: "Purlovia maxima. Burrows and ambushes. Causes torpor.",
    regions: MAMMAL_REGIONS,
  },
  "_Troodon_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "small_theropod", paintable: true,
    description: "Troodon magnanimus. Nocturnal pack hunter. Tames passively via creature kills.",
    regions: RAPTOR_REGIONS,
  },
  "_Microraptor_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "small_theropod", paintable: true,
    description: "Microraptor gnarilongus. Dismounts riders on hit.",
    regions: RAPTOR_REGIONS,
  },
  "_Pegomastax_Character_BP_C": {
    diet: "Herbivore", temperament: "Aggressive", archetype: "small_theropod", paintable: true,
    description: "Pegomastax fructarator. Steals items from your inventory.",
    regions: RAPTOR_REGIONS,
  },

  // ===== Herbivores =====
  "_Trike_Character_BP_C": {
    diet: "Herbivore", temperament: "Reactive", archetype: "quadruped", paintable: true,
    description: "Triceratops styrax. Charges with horns. Good early-game tank.",
    regions: TRIKE_REGIONS,
  },
  "_Stego_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "quadruped", paintable: true,
    description: "Stegosaurus regium. Tail spikes deal heavy damage. Plates rotate for mode.",
    regions: STEGO_REGIONS,
  },
  "_Sauropod_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "sauropod", paintable: true,
    description: "Brontosaurus lazarus. Massive sweep attack. Platform saddle support.",
    regions: SAUROPOD_REGIONS,
  },
  "_Para_Character_BP_C": {
    diet: "Herbivore", temperament: "Skittish", archetype: "small_theropod", paintable: true,
    description: "Parasaur amphibio. Honks on detection. Beginner-friendly mount.",
    regions: STANDARD_BODY,
  },
  "_Ankylo_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "quadruped", paintable: true,
    description: "Ankylosaurus crassacutis. Best metal/stone harvester. Tail club stuns.",
    regions: STANDARD_BODY,
  },
  "_Pachyrhino_Character_BP_C": {
    diet: "Herbivore", temperament: "Defensive", archetype: "quadruped", paintable: true,
    description: "Pachyrhinosaurus aerolofus. Calming gas pacifies nearby aggressors.",
    regions: TRIKE_REGIONS,
  },
  "_Diplo_Character_BP_C": {
    diet: "Herbivore", temperament: "Naive", archetype: "sauropod", paintable: true,
    description: "Diplodocus insulaprincaps. Knockback attack. Multi-rider mount.",
    regions: SAUROPOD_REGIONS,
  },
  "_Iguanodon_Character_BP_C": {
    diet: "Herbivore", temperament: "Skittish", archetype: "biped", paintable: true,
    description: "Iguanodon vicissitudinis. Switches biped/quadruped. Converts seeds to berries.",
    regions: STANDARD_BODY,
  },
  "_Mammoth_Character_BP_C": {
    diet: "Herbivore", temperament: "Short-Tempered", archetype: "mammal", paintable: true,
    description: "Mammuthus steincaput. Best wood harvester. Buff music aura.",
    regions: MAMMAL_REGIONS,
  },
  "_Phiomia_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "mammal", paintable: true,
    description: "Phiomia gnarus. Produces narcotic-precursor feces.",
    regions: MAMMAL_REGIONS,
  },
  "_Moschops_Character_BP_C": {
    diet: "Omnivore", temperament: "Cowardly", archetype: "lizard", paintable: true,
    description: "Moschops mansueta. Best resource harvester for select items.",
    regions: STANDARD_BODY,
  },
  "_Equus_Character_BP_C": {
    diet: "Herbivore", temperament: "Friendly", archetype: "mammal", paintable: true,
    description: "Equus magnus. Lasso pull. Mobile crafting station for kibble.",
    regions: MAMMAL_REGIONS,
  },
  "_Pachy_Character_BP_C": {
    diet: "Herbivore", temperament: "Reactive", archetype: "biped", paintable: true,
    description: "Pachycephalosaurus lentemvirgatus. Charging head-butt stuns.",
    regions: STANDARD_BODY,
  },
  "_Doed_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "quadruped", paintable: true,
    description: "Doedicurus custosaxum. Best stone harvester. Rolls into a ball for defense.",
    regions: STANDARD_BODY,
  },
  "_Turtle_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "turtle", paintable: true,
    description: "Carbonemys obibimus. Walking turret platform. High HP shell.",
    regions: [
      { index: 0, name: "Shell" },
      { index: 1, name: "Shell Pattern" },
      { index: 4, name: "Skin" },
      { index: 5, name: "Underside" },
    ],
  },
  "_Beaver_Character_BP_C": {
    diet: "Herbivore", temperament: "Friendly", archetype: "small_mammal", paintable: true,
    description: "Castoroides feliconcisor. Best wood gatherer. Mobile smithy.",
    regions: MAMMAL_REGIONS,
  },
  "_Chalico_Character_BP_C": {
    diet: "Herbivore", temperament: "Short-Tempered", archetype: "ape", paintable: true,
    description: "Chalicotherium gigans. Hurls boulders. Likes beer.",
    regions: MAMMAL_REGIONS,
  },
  "_Paracer_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "sauropod", paintable: true,
    description: "Paraceratherium gigamatercaedo. Mobile platform base.",
    regions: SAUROPOD_REGIONS,
  },
  "_Stag_Character_BP_C": {
    diet: "Herbivore", temperament: "Skittish", archetype: "mammal", paintable: true,
    description: "Megaloceros latuscoronam. Fast mount. Drops keratin and pelt.",
    regions: MAMMAL_REGIONS,
  },
  "_Sheep_Character_BP_C": {
    diet: "Herbivore", temperament: "Naive", archetype: "mammal", paintable: true,
    description: "Ovis aries. Source of mutton (best raw food). Sheared for wool.",
    regions: MAMMAL_REGIONS,
  },
  "_Procoptodon_Character_BP_C": {
    diet: "Herbivore", temperament: "Reactive", archetype: "biped", paintable: true,
    description: "Procoptodon vivencurrus. Pouch carries small tames. Long jump.",
    regions: MAMMAL_REGIONS,
  },
  "_Monkey_Character_BP_C": {
    diet: "Herbivore", temperament: "Friendly", archetype: "ape", paintable: true,
    description: "Mesopithecus amicizia. Shoulder pet. Throws feces at enemies.",
    regions: MAMMAL_REGIONS,
  },
  "_Bigfoot_Character_BP_C": {
    diet: "Herbivore", temperament: "Reactive", archetype: "ape", paintable: true,
    description: "Gigantopithecus fibrarator. Best fiber harvester. Throws survivors.",
    regions: MAMMAL_REGIONS,
  },
  "_Galli_Character_BP_C": {
    diet: "Herbivore", temperament: "Skittish", archetype: "biped", paintable: true,
    description: "Gallimimus velocicrus. Fastest land mount. Carries 3 riders.",
    regions: STANDARD_BODY,
  },
  "_Lystro_Character_BP_C": {
    diet: "Herbivore", temperament: "Friendly", archetype: "small_mammal", paintable: true,
    description: "Lystrosaurus amicus. XP boost aura when petted.",
    regions: STANDARD_BODY,
  },
  "_Rhino_Character_BP_C": {
    diet: "Herbivore", temperament: "Short-Tempered", archetype: "mammal", paintable: true,
    description: "Coelodonta utiliserro. Charge attack scales with distance traveled.",
    regions: MAMMAL_REGIONS,
  },

  // ===== Flyers =====
  "_Ptero_Character_BP_C": {
    diet: "Carnivore", temperament: "Skittish", archetype: "flyer", paintable: true,
    description: "Pteranodon wyvernus. First flyer most survivors tame. Barrel rolls.",
    regions: FLYER_REGIONS,
  },
  "_Argent_Character_BP_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "flyer", paintable: true,
    description: "Argentavis atrocollum. High weight & stamina. Workhorse flyer.",
    regions: FLYER_REGIONS,
  },
  "_Quetz_Character_BP_C": {
    diet: "Carnivore", temperament: "Skittish", archetype: "flyer", paintable: true,
    description: "Quetzalcoatlus conchapicem. Largest flyer. Platform saddle base.",
    regions: FLYER_REGIONS,
  },
  "_Tapejara_Character_BP_C": {
    diet: "Herbivore", temperament: "Skittish", archetype: "flyer", paintable: true,
    description: "Tapejara imperator. Carries 3 riders. Hovers and side-strafes.",
    regions: WYVERN_REGIONS,
  },
  "_Pela_Character_BP_C": {
    diet: "Piscivore", temperament: "Friendly", archetype: "flyer", paintable: true,
    description: "Pelagornis miocaenus. Lands on water. Best flyer for fishing trips.",
    regions: FLYER_REGIONS,
  },
  "_Griffin_Character_BP_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "flyer", paintable: true,
    description: "Griffin magnificum. Dive-bombs enemies. Ragnarok exclusive.",
    regions: FLYER_REGIONS,
  },
  "_Owl_Character_BP_C": {
    diet: "Carnivore", temperament: "Defensive", archetype: "flyer", paintable: true,
    description: "Bubo chinookus. Heals allies with encapsulation. Thermal vision.",
    regions: FLYER_REGIONS,
  },
  "_Wyvern_Character_BP_Fire_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "flyer", paintable: true,
    description: "Draco igneus. Fire breath. Tamed by stealing eggs from Scorched Earth nests.",
    regions: WYVERN_REGIONS,
  },
  "_Wyvern_Character_BP_Lightning_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "flyer", paintable: true,
    description: "Draco voltus. Continuous lightning beam. Best DPS wyvern.",
    regions: WYVERN_REGIONS,
  },
  "_Wyvern_Character_BP_Poison_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "flyer", paintable: true,
    description: "Draco nocens. Toxic cloud breath. Damage-over-time.",
    regions: WYVERN_REGIONS,
  },
  "_Wyvern_Character_BP_Ice_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "flyer", paintable: true,
    description: "Draco glacius. Ice-cone breath that slows. Valguero/Rag/Crystal Isles.",
    regions: WYVERN_REGIONS,
  },
  "_CrystalWyvern_Character_BP_Blood_C": {
    diet: "Sanguinivore", temperament: "Short-Tempered", archetype: "flyer", paintable: true,
    description: "Crystal Wyvern (Blood). Drains blood, heals self. Crystal Isles exclusive.",
    regions: WYVERN_REGIONS,
  },
  "_CrystalWyvern_Character_BP_WS_C": {
    diet: "Herbivore", temperament: "Friendly", archetype: "flyer", paintable: true,
    description: "Crystal Wyvern (Tropical/WS). Friendly until provoked. Sweet breath.",
    regions: WYVERN_REGIONS,
  },
  "_CrystalWyvern_Character_BP_Ember_C": {
    diet: "Carnivore", temperament: "Short-Tempered", archetype: "flyer", paintable: true,
    description: "Crystal Wyvern (Ember). Fire blast. Crystal Isles exclusive.",
    regions: WYVERN_REGIONS,
  },
  "_Dimorph_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "small_flyer", paintable: true,
    description: "Dimorphodon eallumiator. Shoulder swarmer. Targets riders.",
    regions: FLYER_REGIONS,
  },
  "_Archa_Character_BP_C": {
    diet: "Insectivore", temperament: "Cowardly", archetype: "small_flyer", paintable: true,
    description: "Archaeopteryx magnamilvum. Shoulder pet that lets you glide.",
    regions: FLYER_REGIONS,
  },
  "_Tropeognathus_Character_BP_C": {
    diet: "Piscivore", temperament: "Skittish", archetype: "flyer", paintable: true,
    description: "Tropeognathus impudens. Boost-dash flyer with ranged attacks.",
    regions: FLYER_REGIONS,
  },

  // ===== Aquatic =====
  "_Megalodon_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "aquatic_fish", paintable: true,
    description: "Carcharodon megalodon. Common ocean apex. Pack buffs.",
    regions: FISH_REGIONS,
  },
  "_Mosa_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "aquatic_long", paintable: true,
    description: "Mosasaurus lemonadus. Deep-water apex. Platform saddle option.",
    regions: FISH_REGIONS,
  },
  "_Plesiosaur_Character_BP_C": {
    diet: "Carnivore", temperament: "Reactive", archetype: "aquatic_long", paintable: true,
    description: "Elasmosaurus pelagial. Mid-depth tank. Platform saddle.",
    regions: FISH_REGIONS,
  },
  "_Dolphin_Character_BP_C": {
    diet: "Piscivore", temperament: "Friendly", archetype: "aquatic_fish", paintable: true,
    description: "Ichthyosaurus curiosa. Fast scout. Beginner-friendly water mount.",
    regions: FISH_REGIONS,
  },
  "_Basilosaurus_Character_BP_C": {
    diet: "Piscivore", temperament: "Friendly", archetype: "aquatic_long", paintable: true,
    description: "Basilosaurus solatiumfecit. Surface water mount with insulation buff.",
    regions: FISH_REGIONS,
  },
  "_Tusoteuthis_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "aquatic_squid", paintable: true,
    description: "Tusoteuthis vampyrus. Grappling tentacles. Ink cloud escape.",
    regions: STANDARD_BODY,
  },
  "_Dunkleo_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "aquatic_fish", paintable: true,
    description: "Dunkleosteus magnamolaris. Mobile underwater drill. Harvests stone/oil.",
    regions: FISH_REGIONS,
  },
  "_Angler_Character_BP_C": {
    diet: "Piscivore", temperament: "Aggressive", archetype: "aquatic_fish", paintable: true,
    description: "Melanocetus anglerpescum. Bioluminescent lure. Best silica pearls source.",
    regions: FISH_REGIONS,
  },
  "_Toad_Character_BP_C": {
    diet: "Insectivore", temperament: "Docile", archetype: "small_mammal", paintable: true,
    description: "Beelzebufo ranisapien. Amphibious jumper. Best cementing paste source.",
    regions: STANDARD_BODY,
  },
  "_Manta_Character_BP_C": {
    diet: "Piscivore", temperament: "Reactive", archetype: "aquatic_fish", paintable: true,
    description: "Manta mobula. Fast water glider. Leaps over waves.",
    regions: FISH_REGIONS,
  },
  "_Salmon_Character_BP_C": {
    diet: "Piscivore", temperament: "Skittish", archetype: "aquatic_fish", paintable: true,
    description: "Oncorhynchus dirus. River fish — drops prime fish meat.",
    regions: FISH_REGIONS,
  },
  "_Coel_Character_BP_C": {
    diet: "Piscivore", temperament: "Naive", archetype: "aquatic_fish", paintable: true,
    description: "Coelacanth nutritilla. Common shore fish. Easy raw fish.",
    regions: FISH_REGIONS,
  },
  "_Piranha_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "aquatic_fish", paintable: true,
    description: "Megapiranha pristinus. Schooling river predator.",
    regions: FISH_REGIONS,
  },
  "_Eel_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "aquatic_long", paintable: true,
    description: "Electrophorus beluadomito. Stuns and electrocutes on contact.",
    regions: FISH_REGIONS,
  },
  "_Trilobite_Character_BP_C": {
    diet: "Omnivore", temperament: "Defensive", archetype: "insect", paintable: true,
    description: "Trilobites conchafacies. Source of chitin, oil, and silica pearls.",
    regions: STANDARD_BODY,
  },

  // ===== Misc Creatures =====
  "_Dodo_Character_BP_C": {
    diet: "Herbivore", temperament: "Naive", archetype: "small_theropod", paintable: true,
    description: "Raphus replicare. Iconic ARK starter creature. Lays eggs.",
    regions: STANDARD_BODY,
  },
  "_Compy_Character_BP_C": {
    diet: "Carnivore", temperament: "Skittish", archetype: "small_theropod", paintable: true,
    description: "Compsognathus curiosicarius. Small pack hunter. Damage scales with pack size.",
    regions: RAPTOR_REGIONS,
  },
  "_Jerboa_Character_BP_C": {
    diet: "Herbivore", temperament: "Friendly", archetype: "small_mammal", paintable: true,
    description: "Jerboa orientalis. Weather predictor. Shoulder pet.",
    regions: MAMMAL_REGIONS,
  },
  "_Otter_Character_BP_C": {
    diet: "Piscivore", temperament: "Friendly", archetype: "small_mammal", paintable: true,
    description: "Lutra peloso. Carries fish in arms. Insulation buff.",
    regions: MAMMAL_REGIONS,
  },
  "_Kairuku_Character_BP_C": {
    diet: "Piscivore", temperament: "Naive", archetype: "small_theropod", paintable: true,
    description: "Kairuku waitaki. Penguin. Source of organic polymer.",
    regions: STANDARD_BODY,
  },
  "_TerrorBird_Character_BP_C": {
    diet: "Carnivore", temperament: "Reactive", archetype: "biped", paintable: true,
    description: "Phorusrhacidae rapidsolutus. Glide-jumps with wing flaps.",
    regions: STANDARD_BODY,
  },
  "_Daeodon_Character_BP_C": {
    diet: "Omnivore", temperament: "Aggressive", archetype: "mammal", paintable: true,
    description: "Daeodon comedentis. AOE healing for allied tames.",
    regions: MAMMAL_REGIONS,
  },
  "_Achatina_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "insect", paintable: true,
    description: "Achatina limusegnis. Produces achatina paste & organic polymer.",
    regions: STANDARD_BODY,
  },
  "_Dimetro_Character_BP_C": {
    diet: "Carnivore", temperament: "Reactive", archetype: "lizard", paintable: true,
    description: "Dimetrodon calefactus. Sail provides insulation aura.",
    regions: STANDARD_BODY,
  },
  "_Diplocaulus_Character_BP_C": {
    diet: "Piscivore", temperament: "Skittish", archetype: "lizard", paintable: true,
    description: "Diplocaulus rotacaudatus. Underwater oxygen pouch for the rider.",
    regions: STANDARD_BODY,
  },
  "_Hesperornis_Character_BP_C": {
    diet: "Piscivore", temperament: "Skittish", archetype: "small_theropod", paintable: true,
    description: "Hesperornis avenatantes. Lays golden eggs after eating fish.",
    regions: STANDARD_BODY,
  },
  "_Ichthyornis_Character_BP_C": {
    diet: "Piscivore", temperament: "Aggressive", archetype: "small_flyer", paintable: true,
    description: "Ichthyornis piscoquod. Steals food from your inventory mid-flight.",
    regions: FLYER_REGIONS,
  },
  "_Vulture_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "small_flyer", paintable: true,
    description: "Argentavis egestria. Scorched scavenger. Spoiled meat from carcasses.",
    regions: FLYER_REGIONS,
  },

  // ===== Invertebrates =====
  "_Bee_Character_BP_C": {
    diet: "Herbivore", temperament: "Defensive", archetype: "insect", paintable: true,
    description: "Apis drone. Produces honey when fed flowers.",
    regions: STANDARD_BODY,
  },
  "_Arthro_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "insect", paintable: true,
    description: "Arthropluera felsanguis. Acid spit damages metal armor.",
    regions: STANDARD_BODY,
  },
  "_SpiderS_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "spider", paintable: true,
    description: "Araneo invictus. Web-shot slow. Cave dweller.",
    regions: STANDARD_BODY,
  },
  "_Scorpion_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "scorpion", paintable: true,
    description: "Pulmonoscorpius gigantus. Torpor sting — best early-game knockout mount.",
    regions: STANDARD_BODY,
  },
  "_Bat_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "small_flyer", paintable: true,
    description: "Onychonycteris specuncola. Cave bat. Drains stamina with bite.",
    regions: FLYER_REGIONS,
  },
  "_Dragonfly_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "insect", paintable: true,
    description: "Meganeura pulchrasomni. Source of chitin and high-quality meat.",
    regions: STANDARD_BODY,
  },
  "_Ant_Character_BP_C": {
    diet: "Herbivore", temperament: "Aggressive", archetype: "insect", paintable: true,
    description: "Titanomyrma lubricaelum. Soldier or worker variant. Drops oil/silica.",
    regions: STANDARD_BODY,
  },
  "_Mantis_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "insect", paintable: true,
    description: "Empusa discerniculus. Wields tools. Best chitin/keratin harvester.",
    regions: STANDARD_BODY,
  },

  // ===== Tek Variants =====
  "_BionicRex_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Tek Rex skin. Mechanical Rex with glowing accents.",
    regions: TEK_REGIONS,
  },
  "_BionicRaptor_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Tek Raptor skin. Mechanical raptor.",
    regions: TEK_REGIONS,
  },
  "_BionicGigant_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Tek Giga skin. Mechanical Giganotosaurus.",
    regions: TEK_REGIONS,
  },
  "_BionicStego_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Tek Stego skin. Mechanical Stegosaurus.",
    regions: TEK_REGIONS,
  },
  "_BionicTrike_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Tek Trike skin. Mechanical Triceratops.",
    regions: TEK_REGIONS,
  },
  "_BionicPara_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Tek Parasaur skin. Mechanical Parasaur.",
    regions: TEK_REGIONS,
  },
  "_BionicQuetz_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Tek Quetzal skin. Mechanical Quetz.",
    regions: TEK_REGIONS,
  },
  "_BionicMosa_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Tek Mosa skin. Mechanical Mosasaurus.",
    regions: TEK_REGIONS,
  },
  "_Enforcer_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Enforcer. Tek robot built from element shards. Wall-climbing.",
    regions: TEK_REGIONS,
  },
  "_Mek_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Mega Mek. Pilotable Tek mech with sword, shield, missile, and siege modules.",
    regions: TEK_REGIONS,
  },
  "_Scout_Character_BP_C": {
    diet: "N/A", temperament: "N/A", archetype: "tek_mech", paintable: true,
    description: "Scout drone. Tek recon unit with stun and flashbang.",
    regions: TEK_REGIONS,
  },

  // ===== Aberration =====
  "_RockDrake_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "flyer", paintable: true,
    description: "Draconis obscurum. Glides and climbs walls. Active camouflage.",
    regions: WYVERN_REGIONS,
  },
  "_Crab_Character_BP_C": {
    diet: "Omnivore", temperament: "Aggressive", archetype: "spider", paintable: true,
    description: "Karkinos bichirheiros. Massive crab. Wields rider and tame in pincers.",
    regions: STANDARD_BODY,
  },
  "_Basilisk_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "snake", paintable: true,
    description: "Basilisk solifurtim. Burrowing snake. Spits acid.",
    regions: STANDARD_BODY,
  },
  "_Xenomorph_Character_BP_Male_C": {
    diet: "Carnivore", temperament: "Hostile", archetype: "biped", paintable: true,
    description: "Reaper King. Acid spit and tail-stab. Earned by Reaper Queen impregnation.",
    regions: STANDARD_BODY,
  },
  "_CaveWolf_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "mammal", paintable: true,
    description: "Ravager. Pack-hunting cave canine. Zip-line traversal.",
    regions: MAMMAL_REGIONS,
  },
  "_MoleRat_Character_BP_C": {
    diet: "Herbivore", temperament: "Aggressive", archetype: "mammal", paintable: true,
    description: "Roll Rat. Rolls into a ball for high-speed travel and AOE damage.",
    regions: MAMMAL_REGIONS,
  },
  "_LanternPug_Character_BP_C": {
    diet: "Omnivore", temperament: "Friendly", archetype: "small_mammal", paintable: true,
    description: "Bulbdog. Shoulder pet. Charge light wards off Nameless.",
    regions: MAMMAL_REGIONS,
  },
  "_LanternBird_Character_BP_C": {
    diet: "Insectivore", temperament: "Friendly", archetype: "small_flyer", paintable: true,
    description: "Featherlight. Flying lantern shoulder pet.",
    regions: FLYER_REGIONS,
  },
  "_LanternLizard_Character_BP_C": {
    diet: "Insectivore", temperament: "Friendly", archetype: "lizard", paintable: true,
    description: "Glowtail. Climbing lantern lizard.",
    regions: STANDARD_BODY,
  },
  "_LanternGoat_Character_BP_C": {
    diet: "Herbivore", temperament: "Friendly", archetype: "small_mammal", paintable: true,
    description: "Shinehorn. Glowing goat shoulder pet.",
    regions: MAMMAL_REGIONS,
  },

  // ===== Extinction =====
  "_IceJumper_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "biped", paintable: true,
    description: "Managarmr. Ice breath, freeze-frost dash, hover.",
    regions: STANDARD_BODY,
  },
  "_Gacha_Character_BP_C": {
    diet: "Omnivore", temperament: "Reactive", archetype: "ape", paintable: true,
    description: "Gacha. Produces crystallized resources from fed materials.",
    regions: MAMMAL_REGIONS,
  },
  "_Spindles_Character_BP_C": {
    diet: "Herbivore", temperament: "Aggressive", archetype: "quadruped", paintable: true,
    description: "Velonasaur. Quill-spinner ranged attack. Wasteland defender.",
    regions: STANDARD_BODY,
  },
  "_Gasbags_Character_BP_C": {
    diet: "Herbivore", temperament: "Defensive", archetype: "blob", paintable: true,
    description: "Gasbags. Inflates to float and launch upward. Carries massive weight.",
    regions: STANDARD_BODY,
  },
  "_Owl_Character_BP_EX_C": {
    diet: "Carnivore", temperament: "Defensive", archetype: "flyer", paintable: true,
    description: "Snow Owl (Extinction variant). Healing encapsulation.",
    regions: FLYER_REGIONS,
  },

  // ===== Genesis =====
  "_Cherufe_Character_BP_C": {
    diet: "Herbivore", temperament: "Aggressive", archetype: "lizard", paintable: true,
    description: "Magmasaur. Lava creature. Smelts metal in its inventory.",
    regions: STANDARD_BODY,
  },
  "_SpaceWhale_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "aquatic_long", paintable: true,
    description: "Astrocetus. Mobile platform whale that glides through space.",
    regions: FISH_REGIONS,
  },
  "_SpaceDolphin_Character_BP_C": {
    diet: "Carnivore", temperament: "Friendly", archetype: "aquatic_fish", paintable: true,
    description: "Astrodelphis. Space dolphin with starwing saddle (laser/missile/booster).",
    regions: FISH_REGIONS,
  },
  "_BogSpider_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "spider", paintable: true,
    description: "Bloodstalker. Web-grapple traversal. Drains health on hit.",
    regions: STANDARD_BODY,
  },
  "_GiantTurtle_Character_BP_C": {
    diet: "Herbivore", temperament: "Docile", archetype: "turtle", paintable: true,
    description: "Megachelon. Underwater platform turtle.",
    regions: [
      { index: 0, name: "Shell" },
      { index: 1, name: "Shell Pattern" },
      { index: 4, name: "Skin" },
      { index: 5, name: "Underside" },
    ],
  },
  "_Shapeshifter_Small_Character_BP_C": {
    diet: "Omnivore", temperament: "Friendly", archetype: "small_mammal", paintable: true,
    description: "Ferox (small form). Eats element to transform into massive form.",
    regions: MAMMAL_REGIONS,
  },
  "_BrainSlug_Character_BP_C": {
    diet: "Carnivore", temperament: "Aggressive", archetype: "blob", paintable: true,
    description: "Noglin. Mind-controls enemies and bypasses tame limits.",
    regions: STANDARD_BODY,
  },
  "_TekStrider_Character_BP_C": {
    diet: "N/A", temperament: "Aggressive", archetype: "tek_mech", paintable: true,
    description: "Stryder. Tek tripod with modular weapon/utility rigs.",
    regions: TEK_REGIONS,
  },
  "_Platypus_Character_BP_C": {
    diet: "Omnivore", temperament: "Friendly", archetype: "small_mammal", paintable: true,
    description: "Maewing. Glides. Nurses baby tames and steals enemy babies.",
    regions: MAMMAL_REGIONS,
  },

  // ===== Scorched Earth =====
  "_RockGolem_Character_BP_C": {
    diet: "Herbivore", temperament: "Aggressive", archetype: "ape", paintable: true,
    description: "Rock Elemental. Massive walking boulder. Resistant to most damage.",
    regions: STANDARD_BODY,
  },

  // ===== Armor (generic) =====
  "_ClothShirt_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Cloth chestpiece. Hot-climate gear.", regions: ARMOR_REGIONS },
  "_ClothPants_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Cloth leggings.", regions: ARMOR_REGIONS },
  "_ClothBoots_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Cloth boots.", regions: ARMOR_REGIONS },
  "_ClothGloves_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Cloth gloves.", regions: ARMOR_REGIONS },
  "_ClothHat_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Cloth hat.", regions: ARMOR_REGIONS },
  "_HideShirt_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Hide chestpiece.", regions: ARMOR_REGIONS },
  "_HidePants_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Hide leggings.", regions: ARMOR_REGIONS },
  "_HideBoots_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Hide boots.", regions: ARMOR_REGIONS },
  "_HideGloves_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Hide gloves.", regions: ARMOR_REGIONS },
  "_HideHat_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Hide hat.", regions: ARMOR_REGIONS },
  "_FurShirt_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Fur chestpiece. Cold-climate gear.", regions: ARMOR_REGIONS },
  "_FurPants_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Fur leggings.", regions: ARMOR_REGIONS },
  "_FurBoots_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Fur boots.", regions: ARMOR_REGIONS },
  "_ChitinShirt_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Chitin chestpiece.", regions: ARMOR_REGIONS },
  "_ChitinPants_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Chitin leggings.", regions: ARMOR_REGIONS },
  "_ChitinHat_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Chitin helmet.", regions: ARMOR_REGIONS },
  "_MetalShirt_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Flak chestpiece.", regions: ARMOR_REGIONS },
  "_MetalPants_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Flak leggings.", regions: ARMOR_REGIONS },
  "_MetalHat_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Flak helmet.", regions: ARMOR_REGIONS },
  "_TekHat_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Tek helmet. Element-powered HUD.", regions: TEK_REGIONS },
  "_TekShirt_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Tek chestpiece. Jetpack module.", regions: TEK_REGIONS },
  "_TekPants_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Tek leggings. Sprint boost.", regions: TEK_REGIONS },
  "_TekBoots_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Tek boots. Anti-fall + sprint.", regions: TEK_REGIONS },
  "_TekGloves_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Tek gauntlets. Punch + climbing.", regions: TEK_REGIONS },
  "_HazardSuitHat_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Hazard Suit helmet. Aberration radiation gear.", regions: ARMOR_REGIONS },
  "_HazardSuitShirt_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Hazard Suit chest. Aberration radiation gear.", regions: ARMOR_REGIONS },
  "_RiotShield_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Riot shield. Front face only.", regions: [{ index: 0, name: "Shield Front" }] },
  "_Shield_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Wooden shield.", regions: [{ index: 0, name: "Shield Face" }] },
  "_MetalShield_C": { diet: "N/A", temperament: "N/A", archetype: "armor", paintable: true, description: "Metal shield.", regions: [{ index: 0, name: "Shield Face" }] },
};

export function getCreatureInfo(suffix: string): CreatureInfo | null {
  return CREATURE_DATA[suffix] ?? null;
}
