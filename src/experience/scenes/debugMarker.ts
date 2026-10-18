import * as THREE from "three";
import type { SceneModule } from "../core/sceneManager";

/** Temporary markers along the flight path so Step 2–3 are visually testable. */
export function createDebugMarkerScene(): SceneModule {
  const root = new THREE.Group();
  root.name = "debug-markers";

  const colors = [0x00f0ff, 0xff2bd6, 0xb8ff3c, 0x00f0ff, 0xff2bd6, 0xb8ff3c];
  const meshes: THREE.Mesh[] = [];

  for (let i = 0; i < 6; i++) {
    const geo = new THREE.BoxGeometry(2.2, 2.2 + i * 0.4, 2.2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0b0d14,
      emissive: new THREE.Color(colors[i]!),
      emissiveIntensity: 0.85,
      roughness: 0.35,
      metalness: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.sin(i * 1.1) * 6, 2 - i * 2.5, -i * 22);
    root.add(mesh);
    meshes.push(mesh);
  }

  // Ground grid hint
  const grid = new THREE.GridHelper(120, 40, 0x00f0ff, 0x1a2030);
  grid.position.y = -16;
  root.add(grid);

  return {
    id: "debug",
    root,
    setProgress(local: number) {
      meshes.forEach((m, i) => {
        const pulse = 0.5 + Math.sin(local * Math.PI * 2 + i) * 0.5;
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.4 + pulse * 0.8;
        m.rotation.y = local * Math.PI * 2 * (0.2 + i * 0.05);
      });
    },
    update(_dt: number) {
      /* scroll-driven via setProgress */
    },
    dispose() {
      root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) (mat as THREE.Material).dispose();
      });
    },
  };
}
