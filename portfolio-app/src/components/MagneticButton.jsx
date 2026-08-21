import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Wraps any button/link and gives it a subtle magnetic pull toward the cursor.
 * Use for primary CTAs only — don't apply to every clickable element.
 *
 * Usage:
 *   <MagneticButton strength={0.35}>
 *     <button onClick={...}>View My Work</button>
 *   </MagneticButton>
 */
export default function MagneticButton({ children, strength = 0.35, range = 80 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < range + rect.width / 2) {
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, display: "inline-flex" }}
    >
      {children}
    </motion.div>
  );
}