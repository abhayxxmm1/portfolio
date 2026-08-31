import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import JourneyItem from "./JourneyItem";

const EASE = [0.25, 0.46, 0.45, 0.94];

/**
 * JourneyTimeline
 * ────────────────────────────────────────────────────────────────
 * Vertical line + milestone list. The line fills in as the section
 * scrolls through view (useScroll + scaleY), so the journey feels
 * "traveled" rather than just revealed. Only one milestone is active
 * at a time — activeId lives here so a hover/focus on one item and
 * an open tap-card on mobile can never both exist.
 */
export default function JourneyTimeline({ journey, T, isMobile, reducedMotion }) {
  const containerRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.82", "end 0.55"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const lineScale = useTransform(lineProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Track (full height, quiet) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 6,
          top: 8,
          bottom: 8,
          width: 1,
          background: T.border,
        }}
      />
      {/* Progress fill, scroll-linked */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 6,
          top: 8,
          bottom: 8,
          width: 1,
          background: T.text,
          transformOrigin: "top",
          scaleY: reducedMotion ? 1 : lineScale,
          opacity: 0.55,
        }}
      />

      <ol style={{ listStyle: "none" }}>
        {journey.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: reducedMotion ? 0 : i * 0.06, ease: EASE }}
          >
            <JourneyItem
              item={item}
              index={i}
              T={T}
              isMobile={isMobile}
              reducedMotion={reducedMotion}
              isActive={activeId === item.id}
              onEnter={() => setActiveId(item.id)}
              onLeave={() => setActiveId((cur) => (cur === item.id ? null : cur))}
              onToggle={() => setActiveId((cur) => (cur === item.id ? null : item.id))}
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}