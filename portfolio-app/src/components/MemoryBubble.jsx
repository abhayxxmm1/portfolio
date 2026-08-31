import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import DocumentPreview from "./DocumentPreview";

const EASE = [0.25, 0.46, 0.45, 0.94];

/**
 * MemoryBubble
 * ────────────────────────────────────────────────────────────────
 * The floating glass viewer that appears beside a hovered/focused
 * milestone. Desktop only — mobile uses a simpler inline reveal
 * (see JourneyItem).
 *
 * Continuity between milestones: every instance shares
 * `layoutId="memory-bubble"`. When the hovered item changes, this
 * component unmounts at the old position and mounts at the new one;
 * Framer Motion's shared-layout animation smoothly moves and resizes
 * the *same* bubble across that gap instead of a hard cut, which is
 * what makes it read as "one memory viewer transforming into the
 * next" rather than a fresh popup each time.
 */
export default function MemoryBubble({ item, T, reducedMotion, side = "right" }) {
  const wrapRef = useRef(null);

  // Raw pointer position within the bubble, -0.5..0.5 on each axis.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 180, damping: 20, mass: 0.4 });

  // Glass layer: subtle tilt only.
  const glassRotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const glassRotateY = useTransform(sx, [-0.5, 0.5], [-4, 4]);

  // Document layer: tilts + shifts a little more — reads as "closer".
  const docRotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const docRotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const docX = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const docY = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  const handleMove = (e) => {
    if (reducedMotion) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      layoutId="memory-bubble"
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      role="img"
      aria-label={`Preview of ${item.title}: ${item.subtitle}`}
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 6 }}
      transition={
        reducedMotion
          ? { duration: 0.15 }
          : { type: "spring", stiffness: 320, damping: 28, mass: 0.6 }
      }
      style={{
        position: "absolute",
        top: "50%",
        left: "calc(100% + 28px)",   // always left, never `right`
        translateY: "-50%",
        zIndex: 40,
        pointerEvents: "auto",
        perspective: 1000,
      }}
    >
      <motion.div
        style={{
          padding: "1.1rem",
          borderRadius: 22,
          background: T.bgGlass,
          border: `1px solid ${T.border}`,
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          boxShadow: T.shadowHov,
          transformStyle: "preserve-3d",
          rotateX: reducedMotion ? 0 : glassRotateX,
          rotateY: reducedMotion ? 0 : glassRotateY,
        }}
        transition={{ ease: EASE, duration: 0.3 }}
      >
        <DocumentPreview
          item={item}
          T={T}
          rotateX={docRotateX}
          rotateY={docRotateY}
          translateX={docX}
          translateY={docY}
          reducedMotion={reducedMotion}
        />
      </motion.div>

      {/* Small pointer tail connecting the bubble back to its milestone */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: -6,                     // always tail-on-left now
          transform: "translateY(-50%) rotate(45deg)",
          width: 12,
          height: 12,
          background: T.bgGlass,
          borderLeft: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
        }}
      />
    </motion.div>
  );
}