import { useEffect, useRef, useCallback } from "react";

/* Curated glyph set — letters, numbers, restrained symbols.
   No rainbow / matrix aesthetic, just enough noise to read as "computed". */
const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?/{}[]";

/* Only letters/digits scramble — punctuation (periods, etc.) stays put,
   which reads as more intentional than noise on every glyph. */
const ANIMATABLE = /[a-zA-Z0-9]/;

/* Deterministic PRNG (mulberry32) so each character gets a stable, organic
   timing pattern rather than a fresh Math.random() spread every render. */
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomChar(rng) {
  return CHARSET[Math.floor(rng() * CHARSET.length)];
}

/**
 * TextShuffle — cinematic character-shuffle reveal.
 *
 * `lines` is an array of strings, one per visual row (mirrors the old
 * AnimatedText `text` prop). Each animatable character gets its own
 * DOM-ref'd span; glyphs are swapped imperatively via scheduled timeouts
 * (no per-frame React state), decelerate, and resolve back to the original
 * character in a left-to-right cascade. Character boxes are width-locked
 * after first paint so nothing reflows while glyphs are swapping.
 *
 * Props:
 *  - lines: string[]              required, one entry per rendered line
 *  - play: boolean                 starts the one-time entrance when true
 *  - baseDelay: number (seconds)   initial delay before the entrance begins
 *  - textColor / accentColor       theme-driven colors (no hardcoding here)
 *  - waveStepMs: number             cascade speed, ms between characters
 *  - enableHover: boolean           short micro-shuffle replay on hover
 *  - style / className              passed to the outer inline container
 */
export default function TextShuffle({
  lines,
  play = true,
  baseDelay = 0.15,
  textColor = "currentColor",
  accentColor = "#8B5CF6",
  waveStepMs = 20,
  cyclesRange = [5, 9], // ← new, hero's old hardcoded values as default
  durationBase = 42, // ← new, hero's old hardcoded value as default
  noWrapWords = true, // ← new, hero's old nbsp-join behavior as default
  style = {},
  className,
  enableHover = true,
  ariaLabel,
}) {
  const containerRef = useRef(null);
  const charRefs = useRef([]); // index -> { el, final, timeouts: [] }
  const hasPlayedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const hoverCooldownRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const resizeTimeoutRef = useRef(null);
  const idxCounter = useRef(0);

  const fullText = lines.join(" ");

  useEffect(() => {
    if (!play || hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    if (reducedMotionRef.current) return;

    const start = setTimeout(() => {
      runShuffle({ intensityScale: 1, cyclesRange, durationBase });
    }, baseDelay * 1000);

    return () => clearTimeout(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  /* Lock every animatable character's width to its natural rendered size so
     glyph swapping never causes reflow. Re-measured on resize since the
     headline uses a clamp() font-size. */
  const lockWidths = useCallback(() => {
    charRefs.current.forEach((entry) => {
      if (!entry?.el) return;
      entry.el.style.width = "auto";
    });
    void containerRef.current?.offsetHeight; // force reflow before re-measuring
    charRefs.current.forEach((entry) => {
      if (!entry?.el) return;
      entry.el.style.width = entry.el.offsetWidth + "px";
    });
  }, []);

  useEffect(() => {
    lockWidths();
    const onResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(lockWidths, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimeoutRef.current);
    };
  }, [lockWidths]);

  useEffect(() => {
    return () => {
      charRefs.current.forEach((entry) => {
        entry?.timeouts?.forEach(clearTimeout);
      });
    };
  }, []);

  const runShuffle = useCallback(
    ({ intensityScale = 1, cyclesRange = [5, 9], durationBase = 40 } = {}) => {
      if (reducedMotionRef.current) return;
      const animatable = charRefs.current.filter((e) => e?.el);
      if (animatable.length === 0) return;

      isAnimatingRef.current = true;
      let remaining = animatable.length;

      animatable.forEach((entry, i) => {
        const rng = mulberry32(i * 9973 + 17);
        const jitter = rng() * 14 * intensityScale;
        const startDelay = i * waveStepMs * intensityScale + jitter;
        const cycles =
          cyclesRange[0] +
          Math.floor(rng() * (cyclesRange[1] - cyclesRange[0]));
        const el = entry.el;
        entry.timeouts = entry.timeouts || [];

        const begin = setTimeout(() => {
          el.style.color = accentColor;
          el.style.textShadow = `0 0 10px ${accentColor}55`;

          let cycle = 0;
          let interval = durationBase * intensityScale;

          const step = () => {
            if (cycle >= cycles) {
              el.textContent = entry.final;
              el.style.color = textColor;
              el.style.textShadow = "none";
              remaining -= 1;
              if (remaining <= 0) isAnimatingRef.current = false;
              return;
            }
            el.textContent = randomChar(rng);
            cycle += 1;
            interval *= 1.32; // decelerate toward resolution
            const t = setTimeout(step, interval);
            entry.timeouts.push(t);
          };
          step();
        }, startDelay);

        entry.timeouts.push(begin);
      });
    },
    [accentColor, textColor, waveStepMs]
  );

  useEffect(() => {
    if (!play || hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    if (reducedMotionRef.current) return; // static text, no scramble

    const start = setTimeout(() => {
      runShuffle({ intensityScale: 1, cyclesRange: [5, 9], durationBase: 42 });
    }, baseDelay * 1000);

    return () => clearTimeout(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  const handleHover = () => {
    if (!enableHover || reducedMotionRef.current) return;
    if (!hasPlayedRef.current || isAnimatingRef.current) return;
    const now = Date.now();
    if (now - hoverCooldownRef.current < 1400) return;
    hoverCooldownRef.current = now;
    runShuffle({ intensityScale: 0.55, cyclesRange: [2, 4], durationBase: 30 });
  };

  idxCounter.current = 0;

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseEnter={handleHover}
      style={{ display: "inline-block", color: textColor, ...style }}
    >
      {/* Real sentence for screen readers / keyboard users — never hidden
          behind the animated glyphs. */}
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {ariaLabel || fullText}
      </span>

      <span aria-hidden="true">
        {lines.map((line, li) => (
          <span key={li} style={{ display: "block" }}>
            {line.split(" ").map((word, wi, words) => (
              <span
                key={wi}
                style={{ display: "inline-block", whiteSpace: "nowrap" }}
              >
                {word.split("").map((ch, ci) => {
                  if (!ANIMATABLE.test(ch)) {
                    // Punctuation: stays static, still theme-colored.
                    return (
                      <span key={ci} style={{ display: "inline-block" }}>
                        {ch}
                      </span>
                    );
                  }
                  const idx = idxCounter.current;
                  idxCounter.current += 1;
                  return (
                    <span
                      key={ci}
                      ref={(el) => {
                        if (!el) return;
                        if (!charRefs.current[idx]) {
                          charRefs.current[idx] = {
                            el,
                            final: ch,
                            timeouts: [],
                          };
                        } else {
                          charRefs.current[idx].el = el;
                          charRefs.current[idx].final = ch;
                        }
                      }}
                      style={{
                        display: "inline-block",
                        color: textColor,
                        transition: "color 0.32s ease, text-shadow 0.32s ease",
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
                {wi < words.length - 1 ? (
                  <span style={{ display: "inline-block" }}>
                    {noWrapWords ? "\u00A0" : " "}
                  </span>
                ) : null}
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
