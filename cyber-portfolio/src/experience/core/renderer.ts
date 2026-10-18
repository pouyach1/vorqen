import * as THREE from "three";
import type { QualitySettings } from "./quality";

export function createRenderer(
  canvas: HTMLCanvasElement,
  quality: QualitySettings
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality.tier !== "low",
    powerPreference: quality.tier === "high" ? "high-performance" : "default",
    alpha: false,
    stencil: false,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x05060a, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.dprCap));

  return renderer;
}

export function resizeRenderer(
  renderer: THREE.WebGLRenderer,
  quality: QualitySettings,
  width: number,
  height: number
): void {
  const w = Math.max(1, Math.floor(width));
  const h = Math.max(1, Math.floor(height));
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.dprCap));
  renderer.setSize(w, h, false);
}
