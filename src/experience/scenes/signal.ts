import * as THREE from "three";
import type { SceneFrameCtx, SceneModule } from "../core/sceneManager";
import type { QualitySettings } from "../core/quality";

const CYAN = new THREE.Color(0x00f0ff);

function smoothstep(t: number, edge0: number, edge1: number): number {
  const x = THREE.MathUtils.clamp((t - edge0) / Math.max(1e-5, edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}
const MAGENTA = new THREE.Color(0xff2bd6);

/**
 * Scene 1 — SIGNAL
 * Noise / particle converge → wireframe skyline → neon city fill (uRender).
 * Driven only by the shared World RAF loop (no per-scene loops).
 */
export function createSignalScene(
  quality: QualitySettings,
  reducedMotion: boolean
): SceneModule {
  const root = new THREE.Group();
  root.name = "signal";

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uRender: { value: 0 },
    uVelocity: { value: 0 },
    uGlitch: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uPulse: { value: 0 },
    uReduced: { value: reducedMotion ? 1 : 0 },
  };

  // Shared across particle + city materials
  const shared = uniforms;

  const count = Math.max(512, quality.particleCount | 0);
  const density = quality.cityDensity;

  // ─── Background noise / gradient plane ─────────────────────────────
  const bgGeo = new THREE.PlaneGeometry(2, 2);
  const bgMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: shared.uTime,
      uProgress: shared.uProgress,
      uGlitch: shared.uGlitch,
      uReduced: shared.uReduced,
    },
    vertexShader: /* glsl */ `
      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uProgress;
      uniform float uGlitch;
      uniform float uReduced;
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / max(vec2(1.0), vec2(1920.0, 1080.0));
        vec3 base = mix(vec3(0.02, 0.025, 0.04), vec3(0.0, 0.06, 0.1), uv.y);
        if (uReduced > 0.5) {
          gl_FragColor = vec4(base, 1.0);
          return;
        }
        float n = hash(floor(gl_FragCoord.xy * 0.5) + floor(uTime * 18.0));
        float scan = step(0.92, fract(gl_FragCoord.y * 0.08 + uTime * 2.0));
        float noiseAmt = (1.0 - smoothstep(0.0, 0.2, uProgress)) * 0.55;
        vec3 col = base + vec3(n) * noiseAmt * 0.35;
        col += vec3(0.0, 0.9, 1.0) * scan * noiseAmt * 0.15;
        col += vec3(1.0, 0.2, 0.85) * uGlitch * 0.35;
        float fade = 1.0 - smoothstep(0.25, 0.55, uProgress) * 0.65;
        gl_FragColor = vec4(col, fade);
      }
    `,
  });
  const bg = new THREE.Mesh(bgGeo, bgMat);
  bg.frustumCulled = false;
  bg.renderOrder = -10;
  bg.position.z = -40;
  // Keep bg as fullscreen via onBeforeRender camera override... simpler: large plane in world
  bg.scale.set(120, 70, 1);
  bg.position.set(0, 4, -30);
  root.add(bg);

  // ─── Particles (InstancedMesh + curl in shader) ────────────────────
  const particleGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  const startArr = new Float32Array(count * 3);
  const gridArr = new Float32Array(count * 3);
  const seedArr = new Float32Array(count);

  const gridCols = Math.ceil(Math.sqrt(count / 2));
  const gridRows = Math.ceil(count / gridCols);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    startArr[i3] = (Math.random() - 0.5) * 48;
    startArr[i3 + 1] = (Math.random() - 0.5) * 28 + 4;
    startArr[i3 + 2] = (Math.random() - 0.5) * 60 - 10;

    const gx = i % gridCols;
    const gy = Math.floor(i / gridCols) % gridRows;
    const gz = Math.floor(i / (gridCols * gridRows));
    gridArr[i3] = (gx - gridCols * 0.5) * 0.55;
    gridArr[i3 + 1] = (gy - gridRows * 0.35) * 0.45 + 1.5;
    gridArr[i3 + 2] = -gz * 1.1 - 4;
    seedArr[i] = Math.random() * 1000;
  }

  particleGeo.setAttribute("aStart", new THREE.InstancedBufferAttribute(startArr, 3));
  particleGeo.setAttribute("aGrid", new THREE.InstancedBufferAttribute(gridArr, 3));
  particleGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seedArr, 1));

  const particleMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: shared.uTime,
      uProgress: shared.uProgress,
      uVelocity: shared.uVelocity,
      uMouse: shared.uMouse,
      uPulse: shared.uPulse,
      uGlitch: shared.uGlitch,
      uReduced: shared.uReduced,
      uCyan: { value: CYAN },
      uMagenta: { value: MAGENTA },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aStart;
      attribute vec3 aGrid;
      attribute float aSeed;
      uniform float uTime;
      uniform float uProgress;
      uniform float uVelocity;
      uniform vec2 uMouse;
      uniform float uPulse;
      uniform float uReduced;
      varying float vMix;
      varying float vSeed;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
      }
      vec3 curlNoise(vec3 p) {
        const float e = 0.1;
        vec3 dx = vec3(e, 0.0, 0.0);
        vec3 dy = vec3(0.0, e, 0.0);
        vec3 dz = vec3(0.0, 0.0, e);
        float x = snoise(p + dy) - snoise(p - dy) - (snoise(p + dz) - snoise(p - dz));
        float y = snoise(p + dz) - snoise(p - dz) - (snoise(p + dx) - snoise(p - dx));
        float z = snoise(p + dx) - snoise(p - dx) - (snoise(p + dy) - snoise(p - dy));
        return normalize(vec3(x, y, z) + 0.0001);
      }

      void main() {
        vSeed = aSeed;
        float toGrid = smoothstep(0.0, 0.15, uProgress);
        vMix = toGrid;
        vec3 flow = vec3(0.0);
        if (uReduced < 0.5) {
          float speed = 0.35 + abs(uVelocity) * 0.08;
          flow = curlNoise(aStart * 0.08 + vec3(0.0, uTime * speed, aSeed * 0.01)) * (1.0 - toGrid) * (1.2 + abs(uVelocity) * 0.15);
        }
        vec3 pos = mix(aStart + flow, aGrid, toGrid);
        if (uReduced < 0.5) {
          vec2 m = uMouse * vec2(14.0, 8.0);
          float d = length(pos.xy - m);
          float influence = exp(-d * 0.35) * uPulse;
          pos.xy += normalize(pos.xy - m + 0.001) * influence * 1.4;
        }
        float s = mix(0.55, 1.15, toGrid) * (1.0 + uPulse * 0.25 * (1.0 - toGrid));
        vec3 transformed = position * s + pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uProgress;
      uniform float uGlitch;
      uniform vec3 uCyan;
      uniform vec3 uMagenta;
      varying float vMix;
      varying float vSeed;
      void main() {
        vec3 col = mix(uCyan, uMagenta, fract(vSeed * 0.13));
        float a = mix(0.85, 0.35, smoothstep(0.2, 0.5, uProgress));
        a *= mix(1.0, 0.15, smoothstep(0.45, 0.7, uProgress));
        col += uGlitch * 0.4;
        gl_FragColor = vec4(col, a * (0.55 + vMix * 0.45));
      }
    `,
  });

  const particles = new THREE.InstancedMesh(particleGeo, particleMat, count);
  particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  // Identity instances (positions driven in shader via attributes)
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    dummy.position.set(0, 0, 0);
    dummy.updateMatrix();
    particles.setMatrixAt(i, dummy.matrix);
  }
  particles.instanceMatrix.needsUpdate = true;
  particles.frustumCulled = false;
  root.add(particles);

  // ─── Wireframe + filled city skyline ───────────────────────────────
  const buildings: { x: number; z: number; w: number; d: number; h: number; hue: number }[] = [];
  const buildingCount = Math.floor(18 + density * 28);
  for (let i = 0; i < buildingCount; i++) {
    buildings.push({
      x: (Math.random() - 0.5) * 36,
      z: -8 - Math.random() * 42,
      w: 1.2 + Math.random() * 2.4,
      d: 1.2 + Math.random() * 2.4,
      h: 3 + Math.random() * 14 * density,
      hue: Math.random() > 0.55 ? 0 : 1,
    });
  }

  const cityGroup = new THREE.Group();
  cityGroup.name = "signal-city";
  root.add(cityGroup);

  const edgePositions: number[] = [];
  const cityMeshes: THREE.Mesh[] = [];
  const cityMats: THREE.ShaderMaterial[] = [];

  const cityVert = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPos;
    void main() {
      vUv = uv;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const cityFrag = /* glsl */ `
    uniform float uRender;
    uniform float uTime;
    uniform float uGlitch;
    uniform float uFlicker;
    uniform float uReduced;
    uniform vec3 uEdge;
    uniform vec3 uFill;
    varying vec2 vUv;
    varying vec3 vPos;
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    void main() {
      float edge = max(
        smoothstep(0.08, 0.0, min(vUv.x, 1.0 - vUv.x)),
        smoothstep(0.08, 0.0, min(vUv.y, 1.0 - vUv.y))
      );
      float windows = step(0.72, hash(floor(vUv.x * 12.0) + floor(vUv.y * 18.0) * 17.0));
      float flicker = 1.0;
      if (uReduced < 0.5) {
        flicker = mix(0.55, 1.0, step(0.08, hash(floor(vUv.x * 12.0) + floor(uTime * 3.0) + floor(vUv.y * 18.0))));
        flicker = mix(flicker, 1.0, 1.0 - uFlicker);
      }
      vec3 col = mix(uFill, uEdge, edge * 0.95);
      col += uEdge * windows * 0.55 * flicker * uRender;
      col += uGlitch * 0.25;
      float alpha = mix(0.0, 0.72, uRender) + edge * 0.35 * smoothstep(0.15, 0.4, uRender);
      if (alpha < 0.02) discard;
      gl_FragColor = vec4(col, alpha);
    }
  `;

  for (const b of buildings) {
    const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
    const edgeColor = b.hue > 0.5 ? MAGENTA : CYAN;
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uRender: shared.uRender,
        uTime: shared.uTime,
        uGlitch: shared.uGlitch,
        uFlicker: { value: 1 },
        uReduced: shared.uReduced,
        uEdge: { value: edgeColor.clone() },
        uFill: { value: new THREE.Color(0x0b0d14) },
      },
      vertexShader: cityVert,
      fragmentShader: cityFrag,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(b.x, b.h * 0.5 - 6, b.z);
    cityGroup.add(mesh);
    cityMeshes.push(mesh);
    cityMats.push(mat);

    // Wire edges for LineSegments (box wireframe corners)
    const hw = b.w * 0.5;
    const hh = b.h * 0.5;
    const hd = b.d * 0.5;
    const cx = b.x;
    const cy = b.h * 0.5 - 6;
    const cz = b.z;
    const corners = [
      [-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd],
      [-hw, hh, -hd], [hw, hh, -hd], [hw, hh, hd], [-hw, hh, hd],
    ] as const;
    const edgesIdx = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    for (const [a, c] of edgesIdx) {
      const pa = corners[a]!;
      const pb = corners[c]!;
      edgePositions.push(cx + pa[0], cy + pa[1], cz + pa[2], cx + pb[0], cy + pb[1], cz + pb[2]);
    }
  }

  const wireGeo = new THREE.BufferGeometry();
  wireGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
  const wireMat = new THREE.LineBasicMaterial({
    color: CYAN,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const wire = new THREE.LineSegments(wireGeo, wireMat);
  cityGroup.add(wire);

  // ─── Rain layer ────────────────────────────────────────────────────
  const rainCount = quality.tier === "low" ? 400 : quality.tier === "medium" ? 900 : 1600;
  const rainGeo = new THREE.BufferGeometry();
  const rainPos = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3] = (Math.random() - 0.5) * 50;
    rainPos[i * 3 + 1] = Math.random() * 40 - 5;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 70 - 10;
  }
  rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
  const rainMat = new THREE.PointsMaterial({
    color: 0x88e8ff,
    size: 0.05,
    transparent: true,
    opacity: reducedMotion ? 0 : 0.35,
    depthWrite: false,
  });
  const rain = new THREE.Points(rainGeo, rainMat);
  root.add(rain);

  // ─── Ground grid hint (subtle) ─────────────────────────────────────
  const gridHelper = new THREE.GridHelper(80, 40, 0x00f0ff, 0x121820);
  gridHelper.position.y = -6.05;
  const gridMats = Array.isArray(gridHelper.material)
    ? gridHelper.material
    : [gridHelper.material];
  gridMats.forEach((m) => {
    const mat = m as THREE.Material & { opacity?: number; transparent?: boolean };
    mat.transparent = true;
    mat.opacity = 0.25;
  });
  root.add(gridHelper);

  // Glitch scheduler
  let nextGlitchAt = 6 + Math.random() * 6;
  let glitchUntil = 0;
  let progress = 0;
  let pulse = 0;

  function setProgress(local: number, _global: number): void {
    progress = local;
    shared.uProgress.value = local;
    // 0.35–0.55 → uRender 0→1
    shared.uRender.value = THREE.MathUtils.clamp((local - 0.35) / 0.2, 0, 1);

    // Wireframe appears 0.15–0.35, then fades as fill takes over
    const wireIn = smoothstep(local, 0.12, 0.22);
    const wireOut = 1 - smoothstep(local, 0.4, 0.55);
    wireMat.opacity = reducedMotion ? 0 : wireIn * wireOut * 0.85;
    wireMat.color.copy(local > 0.28 ? MAGENTA : CYAN);
  }

  function update(dt: number, velocity: number, ctx?: SceneFrameCtx): void {
    const elapsed = ctx?.elapsed ?? shared.uTime.value + dt;
    const mouse = ctx?.mouse;
    const reduced = ctx?.reducedMotion ?? reducedMotion;

    shared.uTime.value = elapsed;
    shared.uVelocity.value = velocity;
    shared.uReduced.value = reduced ? 1 : 0;

    if (mouse) {
      shared.uMouse.value.set(mouse.x, mouse.y);
      const targetPulse = Math.min(1.5, mouse.length() * 0.85 + 0.15);
      pulse += (targetPulse - pulse) * Math.min(1, dt * 6);
      shared.uPulse.value = reduced ? 0 : pulse;
    }

    // Glitch flashes every 6–12s
    let glitch = Math.min(1.5, Math.abs(velocity) * 0.12);
    if (!reduced) {
      if (elapsed >= nextGlitchAt) {
        glitchUntil = elapsed + 0.12 + Math.random() * 0.1;
        nextGlitchAt = elapsed + 6 + Math.random() * 6;
      }
      if (elapsed < glitchUntil) glitch = Math.max(glitch, 1);
    } else {
      glitch = 0;
    }
    shared.uGlitch.value = glitch;

    // Window flicker strength (idle life)
    const flicker = reduced ? 0 : 0.7 + Math.sin(elapsed * 1.7) * 0.3;
    for (const mat of cityMats) {
      mat.uniforms.uFlicker.value = flicker;
    }

    // Rain fall
    if (!reduced) {
      const arr = rainGeo.attributes.position as THREE.BufferAttribute;
      const speed = 8 + Math.abs(velocity) * 2;
      for (let i = 0; i < rainCount; i++) {
        let y = arr.getY(i) - speed * dt;
        if (y < -8) y = 28 + Math.random() * 8;
        arr.setY(i, y);
      }
      arr.needsUpdate = true;
      rainMat.opacity = 0.2 + Math.min(0.35, Math.abs(velocity) * 0.05);
    }

    // Hide particles once city largely rendered (keep slight residual)
    particles.visible = !reduced && progress < 0.72;
    if (reduced) {
      particles.visible = false;
      rain.visible = false;
      wire.visible = false;
      cityGroup.visible = true;
      shared.uRender.value = 1;
    }
  }

  function dispose(): void {
    particleGeo.dispose();
    particleMat.dispose();
    bgGeo.dispose();
    bgMat.dispose();
    wireGeo.dispose();
    wireMat.dispose();
    rainGeo.dispose();
    rainMat.dispose();
    for (const mesh of cityMeshes) {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
    gridMats.forEach((m) => (m as THREE.Material).dispose());
    root.clear();
  }

  return {
    id: "signal",
    root,
    setProgress,
    update,
    dispose,
  };
}