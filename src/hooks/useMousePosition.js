import { useEffect, useState } from "react";

/**
 * Tracks the pointer position normalized to a -1..1 range
 * (0,0 at the viewport center), used for eye-tracking / parallax.
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(event) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -((event.clientY / window.innerHeight) * 2 - 1);
      setPosition({ x, y });
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return position;
}
