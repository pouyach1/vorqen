/** Static atmospheric glows — no continuous CSS animation (blur + pulse was expensive). */
export default function AmbientGlows() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-40 overflow-hidden">
      <div className="absolute left-1/2 top-[18%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-neon/[0.07] blur-[120px]" />
      <div className="absolute bottom-[10%] right-[8%] h-[360px] w-[360px] rounded-full bg-cyan-neon/[0.06] blur-[100px]" />
    </div>
  );
}
