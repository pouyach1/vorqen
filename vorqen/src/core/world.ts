import * as THREE from "three";
import { CameraRig } from "./cameraRig";
import { AppLoop } from "./loop";
import { createQualitySettings, type QualitySettings } from "./quality";
import { createRenderer, resizeRenderer } from "./renderer";
import { SceneManager } from "./sceneManager";

export interface WorldState {
  progress: number;
  velocity: number;
  reducedMotion: boolean;
}

export class World {
  readonly quality: QualitySettings;
  readonly renderer: THREE.WebGLRenderer;
  readonly scenes: SceneManager;
  readonly cameraRig: CameraRig;
  readonly state: WorldState = { progress: 0, velocity: 0, reducedMotion: false };

  private readonly loop: AppLoop;
  private readonly mouse = new THREE.Vector2(0, 0);
  private disposed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.quality = createQualitySettings();
    this.renderer = createRenderer(canvas, this.quality);
    this.scenes = new SceneManager();
    this.cameraRig = new CameraRig(window.innerWidth / Math.max(1, window.innerHeight));

    this.state.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.loop = new AppLoop((dt) => this.frame(dt));
    this.onResize = this.onResize.bind(this);
    this.onPointer = this.onPointer.bind(this);

    window.addEventListener("resize", this.onResize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    this.onResize();
  }

  start(): void {
    this.loop.start();
    console.info(`[VORQEN] World online · quality=${this.quality.tier}`);
  }

  setProgress(t: number): void {
    this.state.progress = THREE.MathUtils.clamp(t, 0, 1);
  }

  setVelocity(v: number): void {
    this.state.velocity = v;
  }

  private frame(dt: number): void {
    if (this.disposed) return;

    if (!this.state.reducedMotion) {
      this.cameraRig.setProgress(this.state.progress);
      this.cameraRig.setMouse(this.mouse.x, this.mouse.y);
      this.cameraRig.update(dt);
    }

    this.scenes.setGlobalProgress(this.state.progress);
    this.scenes.update(dt, this.state.velocity);
    this.renderer.render(this.scenes.scene, this.cameraRig.camera);
  }

  private onResize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    resizeRenderer(this.renderer, this.quality, w, h);
    this.cameraRig.resize(w / Math.max(1, h));
  }

  private onPointer(e: PointerEvent): void {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -((e.clientY / window.innerHeight) * 2 - 1);
    this.mouse.set(nx, ny);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.loop.stop();
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointer);
    this.scenes.dispose();
    this.cameraRig.dispose();
    this.renderer.dispose();
  }
}
