import SmoothScroll from "./SmoothScroll";
import CustomCursor from "./CustomCursor";

/** Mounts site-wide interaction systems once (home + about). */
export default function InteractionLayer() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
    </>
  );
}
