export type FrameCallback = (dt: number, elapsed: number) => void;

/** Single RAF loop for the whole experience. */
export class AppLoop {
  private raf = 0;
  private running = false;
  private last = 0;
  private elapsed = 0;
  private readonly cb: FrameCallback;

  constructor(cb: FrameCallback) {
    this.cb = cb;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.elapsed += dt;
      this.cb(dt, this.elapsed);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
}
