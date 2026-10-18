import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";
import { ensureScrollTrigger } from "../../../lib/scrollTriggerLenis";
import MiniKuroModel from "./MiniKuroModel";

/* ---------- Scene layout (world units) ---------- */
const FLOOR_Y = -0.9;
const SIT_X = 0.5;
const SIT_Y = 0;
const SIT_Z = 0.1;
const STAND_Y = -0.7;
const WALK_Z = 0.25;
const BOWL_X = -0.6;
const BOWL_Y = -0.62;
const BOWL_R = 0.2;
const WALK_X = BOWL_X + BOWL_R + 0.4;

const WOOD = "#8a6442";
const WOOD_DARK = "#5e4128";
const WOOD_LIGHT = "#b08762";
const GLASS = "#9fd8ff";

const DEFAULT_LINES = { startle: "!", sigh: "اوف…", hello: "سلام 👋" };

/* ---------- Bench ---------- */
function Bench() {
  const legH = -0.06 - FLOOR_Y;
  const legY = (FLOOR_Y + -0.06) / 2;
  return (
    <group>
      <mesh position={[0.5, -0.03, 0]}>
        <boxGeometry args={[1, 0.06, 0.34]} />
        <meshStandardMaterial color={WOOD_LIGHT} roughness={0.7} />
      </mesh>
      <mesh position={[0.5, 0.2, -0.2]}>
        <boxGeometry args={[1, 0.36, 0.05]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>
      {[
        [0.1, 0.13],
        [0.9, 0.13],
        [0.1, -0.13],
        [0.9, -0.13],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, legY, z]}>
          <boxGeometry args={[0.06, legH, 0.06]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Goldfish bowl ---------- */
function Bowl({ bowlRef, fishRef, fishSwimRef }) {
  return (
    <group ref={bowlRef} position={[BOWL_X, 0, 0]}>
      <mesh position={[0, FLOOR_Y + 0.04, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.08, 20]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0, BOWL_Y, 0]}>
        <sphereGeometry args={[BOWL_R, 32, 24]} />
        <meshPhysicalMaterial color={GLASS} transparent opacity={0.2} roughness={0.05} depthWrite={false} />
      </mesh>
      <mesh position={[0, BOWL_Y - 0.03, 0]}>
        <sphereGeometry args={[BOWL_R * 0.86, 24, 16]} />
        <meshStandardMaterial color="#2d7fd1" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh position={[-0.06, FLOOR_Y + 0.1, 0.04]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0.07, FLOOR_Y + 0.1, -0.03]}>
        <sphereGeometry args={[0.02, 10, 8]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      <group ref={fishRef} position={[0, BOWL_Y, 0]}>
        <group ref={fishSwimRef}>
          <mesh scale={[1.6, 1, 0.8]}>
            <sphereGeometry args={[0.05, 16, 12]} />
            <meshStandardMaterial color="#ff7a2f" emissive="#ff4d00" emissiveIntensity={0.25} roughness={0.4} />
          </mesh>
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.035, 0.05, 12]} />
            <meshStandardMaterial color="#ff7a2f" emissive="#ff4d00" emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[0.05, 0.012, 0.04]}>
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshBasicMaterial color="#000" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <circleGeometry args={[2.2, 48]} />
        <meshBasicMaterial color="#0b0b10" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.002, 0]}>
        <ringGeometry args={[1.2, 1.22, 96]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function Actor({ bowlRef, fishRef, fishSwimRef, bubbleRef, wrapRef, reduce, lines }) {
  const root = useRef(null);
  const breath = useRef(null);
  const parts = useRef(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  const { camera, size } = useThree();
  const copy = lines || DEFAULT_LINES;

  useEffect(() => {
    const aspect = size.width / size.height;
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const d = Math.max(1.95 / (aspect * t), 1.25 / t);
    camera.position.set(0, -0.15, d);
    camera.lookAt(0, -0.2, 0);
    camera.updateProjectionMatrix();
  }, [size, camera]);

  useEffect(() => {
    const P = parts.current;
    if (!P || !root.current) return undefined;

    const r = root.current;
    const head = P.head?.current;
    const body = P.body?.current;
    const armL = P.armL?.current;
    const armR = P.armR?.current;
    const legL = P.legL?.current;
    const legR = P.legR?.current;
    const eyeL = P.eyeL?.current;
    const eyeR = P.eyeR?.current;
    const bowl = bowlRef.current;
    const fish = fishRef.current;

    if (!head || !body || !armL || !armR || !legL || !legR || !eyeL || !eyeR || !bowl || !fish) {
      return undefined;
    }

    const eyes = [eyeL.scale, eyeR.scale];

    r.position.set(SIT_X, SIT_Y, SIT_Z);
    armL.rotation.set(0.12, 0, 0.32);
    armR.rotation.set(0.12, 0, -0.32);
    legL.rotation.x = 0.12;
    legR.rotation.x = 0.12;

    if (reduce) return undefined;

    const say = (t) => {
      const el = bubbleRef.current;
      if (!el) return;
      el.textContent = t;
      el.style.opacity = t ? "1" : "0";
    };

    const tl = gsap.timeline({ repeat: -1, paused: true });

    tl
      .to({}, { duration: 1.2 })
      .to(eyes, { y: 0.08, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.inOut" })
      .to(head.rotation, { y: -0.5, duration: 0.5, ease: "power2.out" })
      .to({}, { duration: 0.7 })
      .addLabel("stand")
      .to(r.position, { y: STAND_Y, z: WALK_Z, duration: 0.5, ease: "power2.in" }, "stand")
      .to(head.rotation, { y: -0.1, duration: 0.3 }, "stand")
      .addLabel("walk")
      .to(r.position, { x: WALK_X, duration: 1.5, ease: "power1.inOut" }, "walk")
      .to(legL.rotation, { x: 0.45, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, "walk")
      .to(legR.rotation, { x: -0.45, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, "walk")
      .to(r.position, { y: STAND_Y + 0.035, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, "walk")
      .to(armL.rotation, { x: -1.1, z: -0.9, duration: 0.5, ease: "back.out(1.4)" })
      .to(head.rotation, { y: -0.3, duration: 0.5 }, "<")
      .to(armL.rotation, { z: -0.7, duration: 0.12, yoyo: true, repeat: 3 })
      .to(fish.position, { x: 0.05, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }, "<")
      .to(bowl.rotation, { z: 0.06, duration: 0.1, yoyo: true, repeat: 3 }, "<")
      .call(say, [copy.startle])
      .to(eyes, { x: 1.35, y: 1.35, z: 1.35, duration: 0.15 })
      .to(r.position, { y: STAND_Y + 0.25, duration: 0.2, ease: "power3.out" }, "<")
      .to(r.position, { y: STAND_Y, duration: 0.4, ease: "bounce.out" })
      .to(head.rotation, { z: 0.14, duration: 0.07, yoyo: true, repeat: 5 }, "<")
      .to(eyes, { x: 1, y: 1, z: 1, duration: 0.2 }, "+=0.1")
      .call(say, [""])
      .addLabel("run")
      .to(r.position, { x: SIT_X, z: 0.22, duration: 0.9, ease: "power1.inOut" }, "run")
      .to(legL.rotation, { x: 0.45, duration: 0.1125, yoyo: true, repeat: 7, ease: "sine.inOut" }, "run")
      .to(legR.rotation, { x: -0.45, duration: 0.1125, yoyo: true, repeat: 7, ease: "sine.inOut" }, "run")
      .to(r.position, { y: STAND_Y + 0.035, duration: 0.1125, yoyo: true, repeat: 7, ease: "sine.inOut" }, "run")
      .to(head.rotation, { y: 0, z: 0, duration: 0.3 }, "run")
      .to(armL.rotation, { x: 0.12, z: 0.32, duration: 0.3 }, "run")
      .addLabel("sit")
      .to(r.position, { y: SIT_Y, z: SIT_Z, duration: 0.4, ease: "power2.out" }, "sit")
      .to(legL.rotation, { x: 0.12, duration: 0.3 }, "sit")
      .to(legR.rotation, { x: 0.12, duration: 0.3 }, "sit")
      .to(r.position, { y: -0.03, duration: 0.1, yoyo: true, repeat: 1 })
      .addLabel("calm")
      .call(say, [copy.sigh], "calm")
      .to(eyes, { y: 0.45, duration: 0.5 }, "calm")
      .to(body.position, { y: 0.1, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, "calm")
      .to({}, { duration: 1.4 })
      .to(eyes, { y: 1, duration: 0.3 })
      .call(say, [""])
      .to(head.rotation, { x: 0, y: 0, z: 0, duration: 0.4 }, "<")
      .to({}, { duration: 0.3 })
      .call(say, [copy.hello])
      .to(armR.rotation, { x: -2.05, z: -0.12, duration: 0.4, ease: "back.out(1.2)" })
      .to(armR.rotation, { z: -0.5, duration: 0.2, yoyo: true, repeat: 5, ease: "sine.inOut" })
      .to(armR.rotation, { x: 0.12, z: -0.32, duration: 0.5, ease: "power2.inOut" })
      .call(say, [""])
      .to({}, { duration: 3 });

    tl.play();

    const ST = ensureScrollTrigger();
    const st = ST.create({
      trigger: wrapRef.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });

    return () => {
      st.kill();
      tl.kill();
      say("");
    };
  }, [reduce, bowlRef, fishRef, bubbleRef, wrapRef, copy.startle, copy.sigh, copy.hello]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (breath.current) breath.current.scale.y = 1 + Math.sin(t * 2.05) * 0.012;
    if (fishSwimRef.current) {
      fishSwimRef.current.position.x = Math.sin(t * 0.9) * 0.05;
      fishSwimRef.current.rotation.y = Math.sin(t * 1.8) * 0.3;
    }
    const head = parts.current?.head?.current;
    const el = bubbleRef.current;
    if (head && el) {
      head.getWorldPosition(v);
      v.y += 0.55;
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
    }
  });

  return (
    <group ref={root} position={[SIT_X, SIT_Y, SIT_Z]}>
      <group ref={breath}>
        <MiniKuroModel ref={parts} />
      </group>
    </group>
  );
}

export default function KuroBenchScene({ bubbleRef, wrapRef, lines }) {
  const reduce = useReducedMotion();
  const bowlRef = useRef(null);
  const fishRef = useRef(null);
  const fishSwimRef = useRef(null);

  return (
    <Canvas
      camera={{ fov: 32, position: [0, -0.15, 4], near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ width: "100%", height: "100%", background: "transparent", touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[2.4, 3.2, 2.2]} intensity={1} color="#e8f9ff" />
      <pointLight position={[-1.2, 0.6, 1.2]} intensity={0.8} color="#b48cff" distance={4} />
      <Floor />
      <Bench />
      <Bowl bowlRef={bowlRef} fishRef={fishRef} fishSwimRef={fishSwimRef} />
      <Actor
        bowlRef={bowlRef}
        fishRef={fishRef}
        fishSwimRef={fishSwimRef}
        bubbleRef={bubbleRef}
        wrapRef={wrapRef}
        reduce={reduce}
        lines={lines}
      />
    </Canvas>
  );
}
