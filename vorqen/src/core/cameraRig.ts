import * as THREE from "three";

/** Scroll-driven camera along a CatmullRom spline + lerped mouse parallax. */
export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  readonly curve: THREE.CatmullRomCurve3;
  readonly lookCurve: THREE.CatmullRomCurve3;

  private readonly pos = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly parallax = new THREE.Vector2(0, 0);
  private readonly targetParallax = new THREE.Vector2(0, 0);
  private progress = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 800);
    this.camera.position.set(0, 8, 28);

    // World flight path — refined as scenes land (Signal → City → Ocean → Arcade → Portal → Core)
    this.curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 12, 40),
        new THREE.Vector3(0, 10, 18),
        new THREE.Vector3(-6, 8, 4),
        new THREE.Vector3(8, 6, -18),
        new THREE.Vector3(2, 2, -40),
        new THREE.Vector3(-4, -6, -62),
        new THREE.Vector3(0, -14, -80),
        new THREE.Vector3(4, -8, -100),
        new THREE.Vector3(0, 0, -120),
        new THREE.Vector3(0, 4, -145),
      ],
      false,
      "catmullrom",
      0.35
    );

    this.lookCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 8, 20),
        new THREE.Vector3(0, 6, 0),
        new THREE.Vector3(0, 4, -20),
        new THREE.Vector3(2, 2, -40),
        new THREE.Vector3(0, -4, -60),
        new THREE.Vector3(0, -12, -78),
        new THREE.Vector3(0, -6, -100),
        new THREE.Vector3(0, 0, -120),
        new THREE.Vector3(0, 2, -140),
        new THREE.Vector3(0, 2, -160),
      ],
      false,
      "catmullrom",
      0.35
    );
  }

  setProgress(t: number): void {
    this.progress = THREE.MathUtils.clamp(t, 0, 1);
  }

  setMouse(nx: number, ny: number): void {
    // nx/ny in roughly [-1, 1]
    this.targetParallax.set(nx * 0.8, ny * 0.45);
  }

  resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  update(dt: number): void {
    const lerp = 1 - Math.exp(-6 * dt);
    this.parallax.lerp(this.targetParallax, lerp);

    this.curve.getPointAt(this.progress, this.pos);
    this.lookCurve.getPointAt(this.progress, this.look);

    this.pos.x += this.parallax.x;
    this.pos.y += this.parallax.y;
    this.look.x += this.parallax.x * 0.35;
    this.look.y += this.parallax.y * 0.35;

    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
  }

  dispose(): void {
    // PerspectiveCamera has no GPU resources to free
  }
}
