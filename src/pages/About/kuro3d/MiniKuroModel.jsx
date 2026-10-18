import { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { CERAMIC, CERAMIC_SHADOW } from "../../../components/robot/kuro/tokens";

/** Homepage love-mood heart accent */
const HEART = "#ff6fa5";
const HEART_GLOW = "#ff6fa5";
const TIP = "#7fd6ff";
const TIP_GLOW = "#00f3ff";

/**
 * Same heart silhouette as Homepage EyeShape love path
 * (SVG M30,34 C15,23… → Three Shape, Y flipped).
 */
function makeHeartShape(scale = 0.0058) {
  const s = new THREE.Shape();
  const p = (x, y) => [(x - 30) * scale, -(y - 20) * scale];
  s.moveTo(...p(30, 34));
  s.bezierCurveTo(...p(15, 23), ...p(9, 12), ...p(18, 7));
  s.bezierCurveTo(...p(24, 4), ...p(30, 9), ...p(30, 13));
  s.bezierCurveTo(...p(30, 9), ...p(36, 4), ...p(42, 7));
  s.bezierCurveTo(...p(51, 12), ...p(45, 23), ...p(30, 34));
  return s;
}

/**
 * Chibi Mini Kuro — Homepage silhouette, seated on y = 0 perch.
 * Oversized ceramic head · dark face screen · antennae · ears · tiny torso · dangling legs.
 */
const MiniKuroModel = forwardRef(function MiniKuroModel(_, ref) {
  const root = useRef(null);
  const body = useRef(null);
  const head = useRef(null);
  const armL = useRef(null);
  const armR = useRef(null);
  const legL = useRef(null);
  const legR = useRef(null);
  const eyeL = useRef(null);
  const eyeR = useRef(null);
  const heartMatL = useRef(null);
  const heartMatR = useRef(null);

  const heartGeo = useMemo(() => {
    const geo = new THREE.ShapeGeometry(makeHeartShape());
    geo.center();
    return geo;
  }, []);

  const mats = useMemo(
    () => ({
      ceramic: { color: CERAMIC, roughness: 0.42, metalness: 0.06 },
      ceramicHi: { color: "#ffffff", roughness: 0.35, metalness: 0.04 },
      shade: { color: CERAMIC_SHADOW, roughness: 0.55, metalness: 0.04 },
      screen: { color: "#0a0b14", roughness: 0.4, metalness: 0.15 },
      accent: { color: "#7000ff", emissive: "#7000ff", emissiveIntensity: 0.35, roughness: 0.3 },
      tip: { color: TIP, emissive: TIP_GLOW, emissiveIntensity: 0.75, roughness: 0.25 },
    }),
    []
  );

  useImperativeHandle(ref, () => ({
    root,
    body,
    head,
    armL,
    armR,
    legL,
    legR,
    eyeL,
    eyeR,
    heartMatL,
    heartMatR,
  }));

  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* Soft contact cue on the perch (unlit disc — not a real shadow) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.04]} scale={[0.52, 0.26, 1]}>
        <circleGeometry args={[0.34, 20]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.16} depthWrite={false} />
      </mesh>

      {/* Seated body sits fully above y = 0 */}
      <group ref={body} position={[0, 0.15, 0]}>
        {/* Tiny rounded torso */}
        <mesh scale={[1, 0.82, 0.88]}>
          <sphereGeometry args={[0.195, 16, 14]} />
          <meshStandardMaterial {...mats.ceramic} />
        </mesh>
        <mesh position={[0, 0.02, 0.13]} scale={[0.68, 0.5, 0.28]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial {...mats.ceramicHi} transparent opacity={0.32} />
        </mesh>
        {/* Chest gem — Homepage purple accent */}
        <mesh position={[0, 0.03, 0.175]}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <meshStandardMaterial {...mats.accent} />
        </mesh>

        {/* Oversized chibi head */}
        <group ref={head} position={[0, 0.4, 0]}>
          <mesh scale={[1.06, 0.96, 0.94]}>
            <sphereGeometry args={[0.355, 18, 16]} />
            <meshStandardMaterial {...mats.ceramic} />
          </mesh>
          {/* Soft cheek volume */}
          <mesh position={[0, -0.05, 0.06]} scale={[1.04, 0.68, 0.82]}>
            <sphereGeometry args={[0.27, 14, 12]} />
            <meshStandardMaterial {...mats.ceramic} />
          </mesh>

          {/* Antennae + glow tips */}
          <mesh position={[-0.15, 0.33, 0]} rotation={[0, 0, 0.28]}>
            <cylinderGeometry args={[0.016, 0.02, 0.26, 6]} />
            <meshStandardMaterial {...mats.shade} />
          </mesh>
          <mesh position={[0.15, 0.33, 0]} rotation={[0, 0, -0.28]}>
            <cylinderGeometry args={[0.016, 0.02, 0.26, 6]} />
            <meshStandardMaterial {...mats.shade} />
          </mesh>
          <mesh position={[-0.21, 0.46, 0]}>
            <sphereGeometry args={[0.042, 10, 10]} />
            <meshStandardMaterial {...mats.tip} />
          </mesh>
          <mesh position={[0.21, 0.46, 0]}>
            <sphereGeometry args={[0.042, 10, 10]} />
            <meshStandardMaterial {...mats.tip} />
          </mesh>

          {/* Side ears */}
          <mesh position={[-0.33, 0.02, 0]} rotation={[0, 0, 0.5]} scale={[0.68, 1.05, 0.68]}>
            <sphereGeometry args={[0.105, 10, 10]} />
            <meshStandardMaterial {...mats.shade} />
          </mesh>
          <mesh position={[0.33, 0.02, 0]} rotation={[0, 0, -0.5]} scale={[0.68, 1.05, 0.68]}>
            <sphereGeometry args={[0.105, 10, 10]} />
            <meshStandardMaterial {...mats.shade} />
          </mesh>

          {/* Dark face screen */}
          <mesh position={[0, 0.02, 0.275]} scale={[1, 0.82, 1]}>
            <boxGeometry args={[0.4, 0.26, 0.055]} />
            <meshStandardMaterial {...mats.screen} />
          </mesh>
          <mesh position={[0, 0.02, 0.25]}>
            <boxGeometry args={[0.42, 0.28, 0.018]} />
            <meshStandardMaterial color="#1a1c2e" roughness={0.5} metalness={0.1} />
          </mesh>

          {/* Heart eyes — Homepage love silhouette */}
          <group ref={eyeL} position={[-0.095, 0.035, 0.31]}>
            <mesh geometry={heartGeo}>
              <meshStandardMaterial
                ref={heartMatL}
                color={HEART}
                emissive={HEART_GLOW}
                emissiveIntensity={0.9}
                roughness={0.22}
                metalness={0.08}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
          <group ref={eyeR} position={[0.095, 0.035, 0.31]}>
            <mesh geometry={heartGeo}>
              <meshStandardMaterial
                ref={heartMatR}
                color={HEART}
                emissive={HEART_GLOW}
                emissiveIntensity={0.9}
                roughness={0.22}
                metalness={0.08}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>

        {/* Tiny articulated arms */}
        <group ref={armL} position={[-0.21, 0.01, 0.02]}>
          <mesh>
            <sphereGeometry args={[0.065, 10, 10]} />
            <meshStandardMaterial {...mats.ceramic} />
          </mesh>
          <mesh position={[-0.015, -0.095, 0.015]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial {...mats.shade} />
          </mesh>
        </group>
        <group ref={armR} position={[0.21, 0.01, 0.02]}>
          <mesh>
            <sphereGeometry args={[0.065, 10, 10]} />
            <meshStandardMaterial {...mats.ceramic} />
          </mesh>
          <mesh position={[0.015, -0.095, 0.015]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial {...mats.shade} />
          </mesh>
        </group>
      </group>

      {/* Short legs only — these cross below the perch edge */}
      <group ref={legL} position={[-0.075, 0.015, 0.035]}>
        <mesh position={[0, -0.09, 0]}>
          <capsuleGeometry args={[0.032, 0.07, 4, 8]} />
          <meshStandardMaterial {...mats.ceramic} />
        </mesh>
        <mesh position={[0, -0.16, 0.015]} rotation={[0.4, 0, 0]}>
          <sphereGeometry args={[0.036, 8, 8]} />
          <meshStandardMaterial {...mats.shade} />
        </mesh>
      </group>
      <group ref={legR} position={[0.075, 0.015, 0.035]}>
        <mesh position={[0, -0.09, 0]}>
          <capsuleGeometry args={[0.032, 0.07, 4, 8]} />
          <meshStandardMaterial {...mats.ceramic} />
        </mesh>
        <mesh position={[0, -0.16, 0.015]} rotation={[0.4, 0, 0]}>
          <sphereGeometry args={[0.036, 8, 8]} />
          <meshStandardMaterial {...mats.shade} />
        </mesh>
      </group>
    </group>
  );
});

export default MiniKuroModel;
