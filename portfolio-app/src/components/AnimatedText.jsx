import { motion } from "framer-motion";

/**
 * Word-by-word stagger reveal for headings/statements.
 * Use sparingly: hero, section titles, project titles — not body text.
 *
 * Usage:
 *   <AnimatedText text="Building intelligent web applications" as="h1" style={{...}} />
 *   Supports line breaks: pass an array of strings for multi-line headings.
 */
const container = {
  hidden: {},
  visible: (delayChildren = 0) => ({
    transition: { staggerChildren: 0.045, delayChildren },
  }),
};

const word = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function AnimatedText({
  text,
  as: Tag = "span",
  style = {},
  delay = 0,
  wordStyle = {},
}) {
  const lines = Array.isArray(text) ? text : [text];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={delay}
      variants={container}
    >
      {lines.map((line, li) => (
        <Tag key={li} style={{ ...style, display: "block", overflow: "hidden" }}>
          {line.split(" ").map((w, wi) => (
            <motion.span
              key={wi}
              variants={word}
              style={{
                display: "inline-block",
                marginRight: "0.28em",
                willChange: "transform, filter",
                ...wordStyle,
              }}
            >
              {w}
            </motion.span>
          ))}
        </Tag>
      ))}
    </motion.div>
  );
}