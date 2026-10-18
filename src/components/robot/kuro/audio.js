import { SFX } from "./moods";

function beep(ctx, dest, { freq = 880, start = 0, dur = 0.12, type = "sine", peak = 0.25, glideTo = null }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const t0 = ctx.currentTime + start;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(dest);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

export function speakJapanese(text, { onStart, onEnd } = {}) {
  if (!("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  const pickVoice = (voices) => {
    const ja = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("ja"));
    if (ja.length === 0) return null;
    const ranked = [...ja].sort((a, b) => {
      const score = (v) => {
        let s = 0;
        if (/google/i.test(v.name)) s += 3;
        if (/female|kyoko|female 1|nanami|haruka/i.test(v.name)) s += 2;
        if (v.localService === false) s += 1;
        return s;
      };
      return score(b) - score(a);
    });
    return ranked[0];
  };
  const say = () => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ja-JP";
    utter.pitch = 1.3;
    utter.rate = 0.88;
    utter.volume = 1;
    const voice = pickVoice(synth.getVoices());
    if (voice) utter.voice = voice;
    if (onStart) utter.onstart = onStart;
    if (onEnd) {
      utter.onend = onEnd;
      utter.onerror = onEnd;
    }
    synth.cancel();
    synth.speak(utter);
  };
  if (synth.getVoices().length === 0) {
    synth.addEventListener("voiceschanged", say, { once: true });
  } else {
    say();
  }
  return true;
}

export function playChime(ctx, dest) {
  beep(ctx, dest, { freq: 1500, dur: 0.09, type: "sine", peak: 0.14 });
  beep(ctx, dest, { freq: 2000, start: 0.08, dur: 0.12, type: "sine", peak: 0.12 });
}

export function playMoodSFX(ctx, dest, mood) {
  switch (mood) {
    case "happy":
      beep(ctx, dest, { freq: 880, dur: 0.12, type: "sine", peak: 0.22 });
      beep(ctx, dest, { freq: 1175, start: 0.11, dur: 0.2, type: "sine", peak: 0.22 });
      break;
    case "excited":
      beep(ctx, dest, { freq: 600, glideTo: 1500, dur: 0.24, type: "sawtooth", peak: 0.16 });
      break;
    case "thinking":
      beep(ctx, dest, { freq: 300, dur: 0.45, type: "sine", peak: 0.14 });
      beep(ctx, dest, { freq: 312, dur: 0.45, type: "sine", peak: 0.1 });
      break;
    case "sleepy":
      beep(ctx, dest, { freq: 260, glideTo: 170, dur: 0.55, type: "sine", peak: 0.13 });
      break;
    case "playful":
      [0, 0.1, 0.2, 0.3].forEach((s, i) =>
        beep(ctx, dest, { freq: i % 2 === 0 ? 720 : 960, start: s, dur: 0.08, type: "triangle", peak: 0.2 })
      );
      break;
    case "sad":
      beep(ctx, dest, { freq: 420, glideTo: 220, dur: 0.5, type: "sine", peak: 0.16 });
      break;
    case "focused":
      beep(ctx, dest, { freq: 520, dur: 0.06, type: "square", peak: 0.22 });
      break;
    case "charging":
      [0, 0.13, 0.26].forEach((s, i) =>
        beep(ctx, dest, { freq: 500 + i * 150, start: s, dur: 0.08, type: "sine", peak: 0.2 })
      );
      break;
    case "love":
      beep(ctx, dest, { freq: 150, dur: 0.14, type: "sine", peak: 0.28 });
      beep(ctx, dest, { freq: 150, start: 0.24, dur: 0.14, type: "sine", peak: 0.28 });
      break;
    default:
      break;
  }
}

export function playKuroMood(moodKey, { soundOn = true, onStart, onEnd } = {}) {
  if (!soundOn || typeof window === "undefined") return;
  let ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
    playChime(ctx, ctx.destination);
  } catch {
    /* ignore */
  }
  const spoke = speakJapanese(SFX[moodKey]?.jp ?? "", { onStart, onEnd });
  if (spoke || !ctx) return;
  try {
    playMoodSFX(ctx, ctx.destination, moodKey);
  } catch {
    /* ignore */
  }
}
