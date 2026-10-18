import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import MiniKuroModel from "./MiniKuroModel";

const WAVE_EVERY_MIN = 9.5;
const WAVE_EVERY_MAX = 13.5;
const WAVE_DURATION = 1.35;
const LOOK_DURATION = 1.25;
const ACK_DURATION = 0.7;
const BODY_Y = 0.15;
const HEART_IDLE = 0.9;
const HEART_BRIGHT = 1.55;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Ref-driven animation — idle / wave / look (curious lean) / ack.
 * No React setState inside useFrame.
 */
export default function MiniKuroController({
  enabled = true,
  lookBias = 0,
  ackToken = 0,
  reduceMotion = false,
}) {
  const parts = useRef(null);
  const machine = useRef({
    state: "idle",
    stateT: 0,
    nextWaveAt: WAVE_EVERY_MIN + Math.random() * 2,
    blinkT: 0,
    blinkPhase: 0,
    lookSign: 1,
    time: 0,
    lastAck: 0,
  });

  useEffect(() => {
    if (!ackToken || reduceMotion) return;
    const m = machine.current;
    if (m.state === "wave") return;
    m.state = "ack";
    m.stateT = 0;
    m.lastAck = ackToken;
  }, [ackToken, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const m = machine.current;
    if (lookBias === 0) return;
    if (m.state === "wave" || m.state === "ack") return;
    m.state = "look";
    m.stateT = 0;
    m.lookSign = lookBias >= 0 ? 1 : -1;
  }, [lookBias, reduceMotion]);

  useFrame((_state, delta) => {
    const p = parts.current;
    if (!p?.root?.current) return;

    const dt = Math.min(delta, 0.048);
    const m = machine.current;
    m.time += dt;

    const root = p.root.current;
    const body = p.body.current;
    const head = p.head.current;
    const armL = p.armL.current;
    const armR = p.armR.current;
    const legL = p.legL.current;
    const legR = p.legR.current;
    const eyeL = p.eyeL.current;
    const eyeR = p.eyeR.current;
    const matL = p.heartMatL?.current;
    const matR = p.heartMatR?.current;

    if (!enabled || reduceMotion) {
      if (body) {
        body.position.y = BODY_Y;
        body.rotation.x = 0;
      }
      if (head) {
        head.rotation.y = 0;
        head.rotation.z = 0;
        head.rotation.x = 0;
      }
      if (armR) armR.rotation.set(0.12, 0, -0.32);
      if (armL) armL.rotation.set(0.12, 0, 0.32);
      if (legL) legL.rotation.x = 0.12;
      if (legR) legR.rotation.x = 0.12;
      if (matL) matL.emissiveIntensity = HEART_IDLE;
      if (matR) matR.emissiveIntensity = HEART_IDLE;
      return;
    }

    m.stateT += dt;

    // Blink
    m.blinkT -= dt;
    if (m.blinkT <= 0) {
      m.blinkPhase = 0.12;
      m.blinkT = 2.4 + Math.random() * 2.8;
    }
    if (m.blinkPhase > 0) m.blinkPhase -= dt;
    const eyeScaleY = m.blinkPhase > 0 ? 0.1 : 1;
    if (eyeL) eyeL.scale.y = damp(eyeL.scale.y, eyeScaleY, 18, dt);
    if (eyeR) eyeR.scale.y = damp(eyeR.scale.y, eyeScaleY, 18, dt);

    // Breath + default limb targets
    const breath = Math.sin(m.time * 2.05) * 0.01;
    let bodyY = BODY_Y + breath;
    let bodyLean = 0;
    let headY = Math.sin(m.time * 0.65) * 0.07;
    let headZ = Math.sin(m.time * 0.5) * 0.035;
    let headX = 0;
    let armLX = 0.12;
    let armLZ = 0.32;
    let armRX = 0.12;
    let armRZ = -0.32;
    let legLX = 0.14 + Math.sin(m.time * 2.4) * 0.2;
    let legRX = 0.14 + Math.sin(m.time * 2.4 + Math.PI) * 0.2;
    let heartGlow = HEART_IDLE;

    if (m.state === "idle") {
      // Occasional gentle head tilt
      if (Math.sin(m.time * 0.22) > 0.92) headZ += 0.06;
      if (m.time >= m.nextWaveAt) {
        m.state = "wave";
        m.stateT = 0;
        m.nextWaveAt = m.time + WAVE_EVERY_MIN + Math.random() * (WAVE_EVERY_MAX - WAVE_EVERY_MIN);
      }
    } else if (m.state === "wave") {
      const u = Math.min(1, m.stateT / WAVE_DURATION);
      const raise = u < 0.22 ? u / 0.22 : u > 0.78 ? (1 - u) / 0.22 : 1;
      const wave = Math.sin(m.stateT * 13.5) * 0.5 * raise;
      armRX = lerp(0.12, -2.05, raise);
      armRZ = lerp(-0.32, -0.12, raise) + wave * 0.38;
      headY = 0.18 * raise;
      headZ = -0.1 * raise;
      headX = -0.06 * raise;
      heartGlow = lerp(HEART_IDLE, HEART_BRIGHT, raise);
      if (u >= 1) {
        m.state = "idle";
        m.stateT = 0;
      }
    } else if (m.state === "look") {
      // Curious lean toward page content, then settle
      const u = Math.min(1, m.stateT / LOOK_DURATION);
      const hold = u < 0.65 ? Math.min(1, u / 0.22) : Math.max(0, (1 - u) / 0.35);
      headY = 0.42 * m.lookSign * hold;
      headX = 0.14 * hold;
      bodyLean = 0.1 * hold;
      armRX = 0.22;
      armLX = 0.22;
      if (u >= 1) {
        m.state = "idle";
        m.stateT = 0;
      }
    } else if (m.state === "ack") {
      const u = Math.min(1, m.stateT / ACK_DURATION);
      const nod = Math.sin(u * Math.PI) * 0.32;
      headX = -nod;
      armLX = lerp(0.12, -1.15, Math.sin(u * Math.PI));
      armLZ = 0.18;
      heartGlow = lerp(HEART_IDLE, HEART_BRIGHT, Math.sin(u * Math.PI));
      if (u >= 1) {
        m.state = "idle";
        m.stateT = 0;
      }
    }

    if (body) {
      body.position.y = damp(body.position.y, bodyY, 10, dt);
      body.rotation.x = damp(body.rotation.x, bodyLean, 7, dt);
    }
    if (head) {
      head.rotation.y = damp(head.rotation.y, headY, 8, dt);
      head.rotation.z = damp(head.rotation.z, headZ, 8, dt);
      head.rotation.x = damp(head.rotation.x, headX, 8, dt);
    }
    if (armL) {
      armL.rotation.x = damp(armL.rotation.x, armLX, 10, dt);
      armL.rotation.z = damp(armL.rotation.z, armLZ, 10, dt);
    }
    if (armR) {
      armR.rotation.x = damp(armR.rotation.x, armRX, 10, dt);
      armR.rotation.z = damp(armR.rotation.z, armRZ, 10, dt);
    }
    if (legL) legL.rotation.x = damp(legL.rotation.x, legLX, 7, dt);
    if (legR) legR.rotation.x = damp(legR.rotation.x, legRX, 7, dt);

    if (matL) matL.emissiveIntensity = damp(matL.emissiveIntensity, heartGlow, 10, dt);
    if (matR) matR.emissiveIntensity = damp(matR.emissiveIntensity, heartGlow, 10, dt);

    if (root) {
      root.rotation.y = damp(root.rotation.y, Math.sin(m.time * 0.38) * 0.05, 4, dt);
    }
  });

  return <MiniKuroModel ref={parts} />;
}
