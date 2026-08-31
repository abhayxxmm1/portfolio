import { useState } from "react";
import { motion } from "framer-motion";

/**
 * DocumentPreview
 * ────────────────────────────────────────────────────────────────
 * The "physical memory" inside the glass bubble. Two independent
 * layers move at different speeds against the same rotateX/rotateY
 * springs (passed down as motion values from MemoryBubble) so the
 * document reads as sitting *behind* a pane of glass rather than
 * printed flat on it:
 *
 *   glassSheen   — a soft diagonal highlight, barely moves (depth: far)
 *   documentCard — the image/placeholder itself, moves more (depth: near)
 *
 * Falls back to a quiet placeholder card if `image` 404s or is absent —
 * never a broken-image icon.
 *
 * CLICK TO OPEN PDF
 * If `item.document` is set, the whole card (image OR placeholder) is
 * clickable and opens that PDF in a new tab. `e.stopPropagation()` keeps
 * the click from bubbling up to the parent <button> in JourneyItem,
 * which on mobile is wired to toggle the card open/closed — without
 * this the click would open the PDF *and* immediately re-toggle the card.
 */
export default function DocumentPreview({
  item,
  T,
  rotateX,
  rotateY,
  translateX,
  translateY,
  reducedMotion,
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = !!item.image && !imgFailed;
  const hasDocument = !!item.document;

  const docStyle = reducedMotion
    ? {}
    : {
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
      };

  const openDocument = (e) => {
    if (!hasDocument) return;
    e.stopPropagation();
    window.open(item.document, "_blank", "noopener,noreferrer");
  };

  const openDocumentKeyboard = (e) => {
    if (!hasDocument) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDocument(e);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: 168,
        height: 220,
        perspective: 900,
      }}
    >
      {/* Document layer — nearest, moves the most */}
      <motion.div
        role={hasDocument ? "button" : undefined}
        tabIndex={hasDocument ? 0 : undefined}
        aria-label={hasDocument ? `Open ${item.title} PDF` : undefined}
        onClick={openDocument}
        onKeyDown={openDocumentKeyboard}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          overflow: "hidden",
          transformStyle: "preserve-3d",
          boxShadow:
            "0 14px 34px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.22)",
          border: `1px solid ${T.borderHover}`,
          background: T.bgAlt,
          cursor: hasDocument ? "pointer" : "default",
          ...docStyle,
        }}
      >
        {hasImage ? (
          <img
            src={item.image}
            alt={`${item.title} — document preview`}
            onError={() => setImgFailed(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <PlaceholderPage item={item} T={T} />
        )}

        {/* Reflection / glass sheen — sits above the doc, moves the least */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(128deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 28%, rgba(255,255,255,0) 46%, rgba(255,255,255,0.04) 78%, rgba(255,255,255,0.14) 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Subtle grain — barely-there texture so the card reads as material, not flat pixels */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.05,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* "View PDF" badge — only shown when a document actually exists */}
        {hasDocument && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "5px 8px",
              fontSize: "0.58rem",
              fontWeight: 600,
              letterSpacing: "0.03em",
              textAlign: "center",
              color: "#fff",
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
          >
            View PDF ↗
          </div>
        )}
      </motion.div>

      {/* Contact shadow — grounds the card, doesn't move with parallax */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          bottom: -14,
          height: 20,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 72%)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

/* Quiet paper mockup shown when no image asset has been added yet. */
function PlaceholderPage({ item, T }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.1rem 1rem",
        background: `linear-gradient(160deg, ${T.bgAlt} 0%, ${T.bgCard} 100%)`,
      }}
    >
      {/* Folded corner */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 22px 22px 0",
          borderColor: `transparent ${T.bg} transparent transparent`,
          filter: "drop-shadow(-1px 1px 1px rgba(0,0,0,0.25))",
        }}
      />
      <div>
        <div
          style={{
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: T.textMuted,
            fontFamily: "var(--font-apple)",
            marginBottom: 8,
          }}
        >
          {item.year}
        </div>
        <div
          style={{
            fontSize: "0.92rem",
            fontWeight: 600,
            color: T.text,
            fontFamily: "var(--font-apple)",
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </div>
      </div>

      {/* A few text-line placeholders, reading like a scanned page */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[92, 78, 85, 60].map((w, i) => (
          <div
            key={i}
            style={{
              height: 3,
              width: `${w}%`,
              borderRadius: 2,
              background: T.tagBg,
            }}
          />
        ))}
      </div>

      <div
        style={{
          fontSize: "0.58rem",
          color: T.textMuted,
          fontFamily: "var(--font-apple)",
        }}
      >
        Tap to view the PDF
      </div>
    </div>
  );
}