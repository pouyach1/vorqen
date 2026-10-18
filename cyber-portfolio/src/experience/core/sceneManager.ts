import * as THREE from "three";

export interface SceneModule {
  readonly id: string;
  readonly root: THREE.Group;
  /** progress in [0,1] for this scene's local window */
  setProgress(local: number, global: number): void;
  update?(dt: number, velocity: number): void;
  dispose(): void;
}

/** One persistent scene graph; modules mount as groups. */
export class SceneManager {
  readonly scene = new THREE.Scene();
  private readonly modules: SceneModule[] = [];

  constructor() {
    this.scene.fog = new THREE.FogExp2(0x05060a, 0.018);
    const amb = new THREE.AmbientLight(0x406080, 0.55);
    const key = new THREE.DirectionalLight(0x00f0ff, 0.65);
    key.position.set(8, 18, 10);
    const rim = new THREE.DirectionalLight(0xff2bd6, 0.35);
    rim.position.set(-12, 6, -8);
    this.scene.add(amb, key, rim);
  }

  register(mod: SceneModule): void {
    this.modules.push(mod);
    this.scene.add(mod.root);
  }

  setGlobalProgress(global: number): void {
    for (const mod of this.modules) {
      // Default: full global progress; scenes override via windows in scroll map later
      mod.setProgress(global, global);
    }
  }

  update(dt: number, velocity: number): void {
    for (const mod of this.modules) {
      mod.update?.(dt, velocity);
    }
  }

  dispose(): void {
    for (const mod of this.modules) {
      this.scene.remove(mod.root);
      mod.dispose();
    }
    this.modules.length = 0;
    this.scene.clear();
  }
}
