import "./styles/global.css";
import { World } from "./core/world";
import { createScrollController } from "./scroll/scrollController";
import { createDebugMarkerScene } from "./scenes/debugMarker";

const canvas = document.querySelector<HTMLCanvasElement>("#webgl");
const ui = document.querySelector<HTMLDivElement>("#ui-root");

if (!canvas || !ui) {
  throw new Error("[VORQEN] Missing #webgl or #ui-root");
}

const world = new World(canvas);
world.scenes.register(createDebugMarkerScene());
const scroll = createScrollController(world);
world.start();

ui.innerHTML = `
  <div class="boot-banner" style="
    position:fixed; inset-inline:var(--hud-pad); top:calc(var(--safe-top) + var(--hud-pad));
    font-family:var(--font-mono); font-size:12px; color:var(--cyan);
    text-shadow:var(--glow-cyan); pointer-events:none; z-index:var(--z-hud);
  ">
    <div class="font-display">VORQEN</div>
    <div id="vorqen-hud-line" style="color:var(--muted); margin-block-start:0.35rem;">
      quality: ${world.quality.tier} · scroll to fly
    </div>
  </div>
`;

const hudLine = document.querySelector("#vorqen-hud-line");
const updateHud = () => {
  if (!hudLine) return;
  hudLine.textContent = `quality: ${world.quality.tier} · progress ${(world.state.progress * 100).toFixed(1)}% · v ${world.state.velocity.toFixed(2)}`;
  requestAnimationFrame(updateHud);
};
updateHud();

window.addEventListener("beforeunload", () => {
  scroll.destroy();
  world.dispose();
});

console.info("[VORQEN] Steps 1–3 online (scaffold + core + scroll)");
