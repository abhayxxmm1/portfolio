import { AnimatePresence, motion } from "framer-motion";
import MemoryBubble from "./MemoryBubble";
import DocumentPreview from "./DocumentPreview";

const EASE = [0.25, 0.46, 0.45, 0.94];

/**
 * JourneyItem
 * ────────────────────────────────────────────────────────────────
 * Renders one milestone. Desktop: hover/focus opens a MemoryBubble
 * floating beside the dot. Mobile: tap toggles a flat inline card
 * directly below the row — same content, no absolute positioning,
 * no parallax (nothing to hover on a touch screen).
 */
export default function JourneyItem({
  item,
  index,
  T,
  isMobile,
  isActive,
  onEnter,
  onLeave,
  onToggle,
  reducedMotion,
}) {
  const side = isMobile ? undefined : index % 2 === 0 ? "right" : "left";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: "1.1rem",
        padding: "1.1rem 0",
      }}
    >
      {/* Dot + connecting stem */}
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          width: 14,
          display: "flex",
          justifyContent: "center",
          paddingTop: 4,
        }}
      >
        <motion.span
          animate={{
            scale: isActive ? 1.35 : 1,
            background: isActive ? T.text : T.bg,
          }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            border: `1.5px solid ${isActive ? T.text : T.borderHover}`,
            zIndex: 2,
          }}
        />
      </div>

      {/* Content — the interactive hit-area */}
      <button
        type="button"
        onMouseEnter={!isMobile ? onEnter : undefined}
        onMouseLeave={!isMobile ? onLeave : undefined}
        onFocus={!isMobile ? onEnter : undefined}
        onBlur={!isMobile ? onLeave : undefined}
        onClick={isMobile ? onToggle : undefined}
        aria-expanded={isActive}
        aria-label={`${item.title} — ${item.subtitle}. ${
          isMobile ? "Tap to preview." : "Hover to preview."
        }`}
        style={{
          all: "unset",
          position: "relative",
          display: "block",
          flex: 1,
          minWidth: 0,
          maxWidth: isMobile ? "none" : 480,   // ← add this
          cursor: "pointer",
          borderRadius: 14,
          padding: "0.85rem 1.05rem",
          background: isActive ? T.bgCardHover : "transparent",
          border: `1px solid ${isActive ? T.border : "transparent"}`,
          transition: "background 0.25s, border-color 0.25s",
        }}
      >
        <div
          style={{
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: T.textMuted,
            fontFamily: "var(--font-apple)",
            marginBottom: 6,
          }}
        >
          {item.year}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-apple)",
            fontWeight: 700,
            fontSize: "1.28rem",
            letterSpacing: "-0.02em",
            color: T.text,
            marginBottom: 4,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-apple)",
            fontSize: "0.86rem",
            color: T.textSub,
            lineHeight: 1.6,
            maxWidth: 440,
          }}
        >
          {item.description}
        </p>

        {/* Desktop: floating memory bubble beside this row */}
        {!isMobile && (
          <AnimatePresence>
            {isActive && (
              <MemoryBubble item={item} T={T} reducedMotion={reducedMotion} side={side} />
            )}
          </AnimatePresence>
        )}
      </button>

      {/* Mobile: flat inline reveal, no absolute positioning */}
      {isMobile && (
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.3, ease: EASE }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  margin: "0.4rem 0 0.6rem 2.1rem",
                  padding: "1rem",
                  borderRadius: 16,
                  background: T.bgGlass,
                  border: `1px solid ${T.border}`,
                  backdropFilter: "blur(18px)",
                  display: "flex",
                  gap: "0.9rem",
                  alignItems: "center",
                }}
              >
                <div style={{ transform: "scale(0.72)", transformOrigin: "left center" }}>
                  <DocumentPreview item={item} T={T} reducedMotion />
                </div>
                <div style={{ fontSize: "0.78rem", color: T.textSub, lineHeight: 1.6 }}>
                  {item.institution}
                  {item.achievement ? (
                    <>
                      <br />
                      {item.achievement}
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}