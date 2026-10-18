export type QualityTier = "low" | "medium" | "high";

export interface QualitySettings {
  tier: QualityTier;
  particleCount: number;
  fishCount: number;
  postprocessing: boolean;
  bloom: boolean;
  chromaticAberration: boolean;
  filmGrain: boolean;
  dprCap: number;
  cityDensity: number;
}

const PRESETS: Record<QualityTier, Omit<QualitySettings, "tier">> = {
  high: {
    particleCount: 30000,
    fishCount: 8,
    postprocessing: true,
    bloom: true,
    chromaticAberration: true,
    filmGrain: true,
    dprCap: 2,
    cityDensity: 1,
  },
  medium: {
    particleCount: 12000,
    fishCount: 6,
    postprocessing: true,
    bloom: true,
    chromaticAberration: false,
    filmGrain: false,
    dprCap: 1.5,
    cityDensity: 0.7,
  },
  low: {
    particleCount: 4000,
    fishCount: 4,
    postprocessing: false,
    bloom: false,
    chromaticAberration: false,
    filmGrain: false,
    dprCap: 1.25,
    cityDensity: 0.45,
  },
};

function parseOverride(): QualityTier | null {
  const raw = new URLSearchParams(window.location.search).get("quality");
  if (raw === "low" || raw === "medium" || raw === "high") return raw;
  return null;
}

function detectTier(): QualityTier {
  const override = parseOverride();
  if (override) return override;

  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  if (isMobile || cores <= 4 || (mem !== undefined && mem <= 4)) return "low";
  if (cores <= 6 || (mem !== undefined && mem <= 8)) return "medium";
  return "high";
}

export function createQualitySettings(): QualitySettings {
  const tier = detectTier();
  return { tier, ...PRESETS[tier] };
}