import "./styles/global.css";

/**
 * VORQEN bootstrap — Step 1 scaffold.
 * Steps 2+ wire the WebGL world, scroll, and scenes.
 */
const app = document.querySelector<HTMLDivElement>("#app");
const ui = document.querySelector<HTMLDivElement>("#ui-root");

if (!app || !ui) {
  throw new Error("[VORQEN] Missing #app or #ui-root");
}

ui.innerHTML = `
  <div class="boot-banner" style="
    position:fixed; inset-inline:var(--hud-pad); top:calc(var(--safe-top) + var(--hud-pad));
    font-family:var(--font-mono); font-size:12px; color:var(--cyan);
    text-shadow:var(--glow-cyan); pointer-events:none; z-index:var(--z-loader);
  ">
    <div class="font-display">VORQEN</div>
    <div style="color:var(--muted); margin-block-start:0.35rem;">
      STEP 1 ONLINE — scaffold ready. Core renderer next.
    </div>
  </div>
`;

console.info("[VORQEN] Step 1 scaffold mounted");
