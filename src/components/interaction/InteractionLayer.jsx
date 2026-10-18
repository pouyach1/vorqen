import SmoothScroll from "./SmoothScroll";
import CustomCursor from "./CustomCursor";

/**
 * Mounts site-wide interaction systems (home + about).
 * SmoothScroll is disabled on /world so the experience Lenis owns scrolling.
 */
export default function InteractionLayer({ enableSmoothScroll = true }) {
  return (
    <>
      {enableSmoothScroll ? <SmoothScroll /> : null}
      <CustomCursor />
    </>
  );
}