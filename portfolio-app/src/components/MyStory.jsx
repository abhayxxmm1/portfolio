import { motion } from "framer-motion";
import JourneyTimeline from "./JourneyTimeline";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { journey } from "../data/journeyData";

const EASE = [0.25, 0.46, 0.45, 0.94];

/**
 * MyStory
 * ────────────────────────────────────────────────────────────────
 * Drop this into the About section of Portfolio.jsx (see the
 * integration notes in the chat response). Takes the same `T`
 * (theme token object) and `isMobile` that every other section
 * already receives, so it inherits dark/light mode for free.
 */
export default function MyStory({ T, isMobile }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div style={{ marginTop: "3.5rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ marginBottom: "2.2rem" }}
      >
        <div
          style={{
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: T.textMuted,
            marginBottom: 10,
            fontFamily: "var(--font-apple)",
          }}
        >
          
        </div>
        <h3
          style={{
            fontFamily: "var(--font-apple)",
            fontWeight: 700,
            fontSize: "clamp(1.5rem,3.2vw,2rem)",
            letterSpacing: "-0.03em",
            color: T.text,
            marginBottom: "0.6rem",
          }}
        >
        </h3>
        <p
          style={{
            color: T.textSub,
            fontSize: "0.9rem",
            lineHeight: 1.7,
            maxWidth: 480,
          }}
        >
          {isMobile
            ? "Tap a chapter to look inside."
            : "Hover a chapter to look inside."}
        </p>
      </motion.div>

      <JourneyTimeline
        journey={journey}
        T={T}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}