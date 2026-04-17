import bodegaImg from "../../assets/images/photos/bodega.jpg";
import flowerImg from "../../assets/images/photos/flower.jpeg";
import forestImg from "../../assets/images/photos/forest.jpg";
import halfmoonImg from "../../assets/images/photos/halfmoon.jpg";
import honoluluImg from "../../assets/images/photos/honolulu.jpg";
import montanadoroImg from "../../assets/images/photos/montanadoro.jpg";
import pillarsImg from "../../assets/images/photos/pillars.jpg";
import pghImg from "../../assets/images/photos/pgh.jpg";

// Direction that guides the kinetic idle animation for each image.
// horizontal: ocean, sky, horizon layers  — band sweeps left→right
// vertical:   forest, buildings           — band sweeps top→bottom
// diagonal:   cliffs, angled coastlines   — band sweeps diagonally
// radial:     flowers, focal subjects     — band pulses from center
export type KineticDir =
  | "ocean_waves"    // Bodega Bay   — rolling surface chop
  | "flower_wind"    // Flora        — magenta bush in a breeze
  | "forest_fog"     // Forest       — layered mist drifting through trees
  | "coastal_shrubs" // Half Moon    — shrub row at cliff top
  | "dual_horizon"   // Honolulu     — slow cloud movement
  | "coastal_waves"  // Montana      — diagonal coastal swells
  | "ivy_light"      // Pillars      — dappled sunlight on stone facade
  | "city_birds";    // Pittsburgh   — small birds crossing sky

export interface Photo {
  id: string;
  src: string;
  title: string;
  coords: string | null;
  kinetic: KineticDir;
  aspectRatio: string; // CSS aspect-ratio value e.g. '3/2', '4/3', '6/7'
  // Three curated accent colors: [dominant, mid, highlight]
  accents: [string, string, string];
  /**
   * Animation intent — plain-language description of the desired kinetic feel.
   * Edit this per photo; these notes inform the parameters in kinetic.ts.
   */
  notes: string;
}

export const photos: Photo[] = [
  {
    id: "bodega",
    src: bodegaImg,
    title: "BODEGA BAY / CA",
    coords: "38.33°N  123.04°W",
    kinetic: "ocean_waves",
    aspectRatio: "3/2",
    accents: ["#6b8fa3", "#c8b89a", "#e8e0d4"],
    notes:
      "Misty coastal inlet with rocky outcrops. The ocean/fog sits in the middle of the frame. Animate the mist drifting gently sideways — slow and atmospheric, not crashing waves. Horizontal drift should dominate over vertical.",
  },
  {
    id: "flower",
    src: flowerImg,
    title: "FLORA",
    coords: "37.80°N  122.41°W",
    kinetic: "flower_wind",
    aspectRatio: "4/3",
    accents: ["#c0392b", "#e67e22", "#f9ca8b"],
    notes:
      "Dense bougainvillea bush filling most of the frame. Wind blowing left-to-right, side-to-side sway. Individual flowers should tremble independently AND the whole mass should feel like it tilts in the breeze. Subtle, not frantic.",
  },
  {
    id: "forest",
    src: forestImg,
    title: "FOREST / OR",
    coords: "45.53°N  122.74°W",
    kinetic: "forest_fog",
    aspectRatio: "3/2",
    accents: ["#2d5a27", "#7a9e4e", "#c8d9a0"],
    notes:
      "Dense forest in fog. Layered mist drifting horizontally through the trees at different depths and speeds — foreground wisps fast, background fog slow.",
  },
  {
    id: "halfmoon",
    src: halfmoonImg,
    title: "HALF MOON BAY / CA",
    coords: "37.46°N  122.42°W",
    kinetic: "coastal_shrubs",
    aspectRatio: "3/2",
    accents: ["#2e6b8a", "#7ab3c8", "#e8ede8"],
    notes:
      "Cliff-top with a row of coastal shrubs along the top edge. Strong exposed wind — shrubs are small and tough so they move faster than forest. Animate just the shrub band near the top (rows 0.02–0.20).",
  },
  {
    id: "honolulu",
    src: honoluluImg,
    title: "HONOLULU / HI",
    coords: "21.30°N  157.85°W",
    kinetic: "dual_horizon",
    aspectRatio: "4/3",
    accents: ["#1a6b8c", "#4db8c8", "#f0c070"],
    notes:
      "Sky above, ocean below with a clear horizon. Sky: very slow screensaver-like cloud drift — the whole sky shifts as one mass, almost imperceptibly",
  },
  {
    id: "montanadoro",
    src: montanadoroImg,
    title: "MONTANA D'ORO / CA",
    coords: "35.27°N  120.88°W",
    kinetic: "coastal_waves",
    aspectRatio: "3/2",
    accents: ["#8b6914", "#c4a35a", "#8ab0a0"],
    notes:
      "Coastal cliffs and ocean. Sky clouds near the top (~top 18%) animate like Honolulu — slow sine oscillation. Ocean waves in the lower half (~58–92%) animate like Bodega Bay — diagonal rolling swells. Cliffs and terrain in the middle are static.",
  },
  {
    id: "pillars",
    src: pillarsImg,
    title: "PILLARS",
    coords: "51.54°N  0.16°W",
    kinetic: "ivy_light",
    aspectRatio: "3/2",
    accents: ["#558a48", "#d2d2d0", "#ccb0a0"],
    notes:
      "White stucco townhouse near Primrose Hill with lush ivy/creepers climbing the facade. Dappled sunlight plays across the stone — shifting light filtering through moving ivy leaves. Targets the mid-bright facade and window areas where ASCII characters are visible.",
  },
  {
    id: "pgh",
    src: pghImg,
    title: "PITTSBURGH / PA",
    coords: "40.44°N   79.99°W",
    kinetic: "city_birds",
    aspectRatio: "3/2",
    accents: ["#2c3e50", "#f39c12", "#7f8c8d"],
    notes:
      "City skyline. Two effects: (1) utility wires subtly trembling in the wind — very slow, structural chars only. (2) A flock of small birds crossing the sky from right to left. Birds disappear off the left edge and reappear on the right.",
  },
];

const recentHistory: string[] = [];
// Full navigation stack — enables back() to revisit previous photos.
const navHistory: string[] = [];

export function nextPhoto(current: Photo): Photo {
  const eligible = photos.filter(
    (p) => !recentHistory.slice(-2).includes(p.id) && p.id !== current.id,
  );
  const pool =
    eligible.length > 0 ? eligible : photos.filter((p) => p.id !== current.id);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  recentHistory.push(pick.id);
  if (recentHistory.length > 4) recentHistory.shift();
  navHistory.push(pick.id);
  return pick;
}

// Returns the photo before the current one in history, or null if at the start.
// Pops current from the stack so the returned photo becomes the new current.
export function prevPhoto(): Photo | null {
  if (navHistory.length <= 1) return null;
  navHistory.pop(); // remove current
  const prevId = navHistory[navHistory.length - 1];
  return photos.find((p) => p.id === prevId) ?? null;
}

export function shuffleInitial(): Photo {
  const pick = photos[Math.floor(Math.random() * photos.length)];
  recentHistory.push(pick.id);
  navHistory.length = 0;
  navHistory.push(pick.id);
  return pick;
}
