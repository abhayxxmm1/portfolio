import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

/* ─── DATA ─────────────────────────────────────── */
const NAV_LINKS = ["Home", "Work", "About", "Contact"];

const PROJECTS = [
  {
    title: "Developer Portfolio",
    category: "Portfolio",
    year: "2026",
    desc: "A modern, minimal portfolio website showcasing projects, skills, and contact information with smooth animations and responsive design.",
    tech: ["Html", "CSS", "Bootstrap"],
    link: "https://abhayxxmm1portfolio.netlify.app/"
  },
  { title: "Employee Management System", category: "Full Stack", year: "2026", desc: "CRUD web application using Spring MVC managing complete employee lifecycle operations with database persistence.", tech: ["Java", "Spring MVC", "MySQL"], link: "https://drive.google.com/file/d/16NK7lWxvcFHDO5kSfEsghRyLii05-qNl/view" },
  { title: "Property Management DB System", category: "Database", year: "2025", desc: "Normalized relational schemas improving data integrity and consistency across all entities.", tech: ["SQL", "pgAdmin 4"], link: "https://drive.google.com/file/d/1k57b6r5zgKRzoLIrVi2oGCMPIZO5JX1-/view" },
  { title: "Traffic Management DB System", category: "Database", year: "2025", desc: "Relational database schemas with normalized design for traffic data integrity and reporting.", tech: ["SQL", "Oracle", "ERD Design"], link: "https://canva.link/8yihchjedcoj7al" },
  { title: "Weather Dashboard", category: "Frontend", year: "2025", desc: "Dynamic weather dashboard fetching real-time data from a weather API with an intuitive responsive interface.", tech: ["HTML5", "CSS3", "JavaScript", "REST API"], link: "https://weatherornotitis.netlify.app" },
  { title: "Weather App", category: "Frontend", year: "2026", desc: "Real-time weather app using API integration displaying live forecasts and conditions cleanly.", tech: ["React", "REST API", "CSS3"], link: "https://joyful-cendol-c0e035.netlify.app" },
  { title: "Maclike Portfolio", category: "Vibe Coding", year: "2026", desc: "A macOS-inspired portfolio interface with creative UI design and smooth interactions.", tech: ["HTML", "CSS", "JavaScript"], link: "https://maclike.netlify.app" },
];

const SKILLS = [
  { icon: "🤖", category: "AI Tools & Platforms", tags: ["ChatGPT", "OpenAI API", "Claude", "Google Gemini", "LangChain", "Hugging Face", "Prompt Engineering", "Vector Databases"] },
  { icon: "⚙️", category: "Backend Development", tags: ["Java", "Spring Boot", "REST APIs", "Spring Data JPA", "Spring AI", "PostgreSQL"] },
  { icon: "🎨", category: "Frontend Development", tags: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS"] },
  { icon: "🛠️", category: "Dev Tools & IDEs", tags: ["VS Code", "IntelliJ IDEA", "Spring Tool Suite", "pgAdmin 4", "Git"] },
];

const SOCIALS = [
  { label: "GitHub", url: "https://github.com/abhayxxmm1" },
  { label: "LinkedIn", url: "https://linkedin.com/in/abhay-ghongade" },
  { label: "Twitter", url: "https://x.com/abhayxxmm1" },
  { label: "Instagram", url: "https://www.instagram.com/abhayxxmm1/" },
];

/* ─── THEME TOKENS ──────────────────────────────── */
const THEMES = {
  dark: {
    bg:            "#000000",
    bgAlt:         "#0a0a0a",
    bgCard:        "rgba(255,255,255,0.04)",
    bgCardHover:   "rgba(255,255,255,0.072)",
    bgGlass:       "rgba(0,0,0,0.6)",
    navBg:         "rgba(0,0,0,0.75)",
    border:        "rgba(255,255,255,0.09)",
    borderHover:   "rgba(255,255,255,0.18)",
    text:          "#f5f5f7",
    textSub:       "rgba(245,245,247,0.58)",
    textMuted:     "rgba(245,245,247,0.34)",
    tagBg:         "rgba(255,255,255,0.055)",
    tagText:       "rgba(245,245,247,0.52)",
    btnBg:         "#f5f5f7",
    btnText:       "#000000",
    btnSecBg:      "rgba(255,255,255,0.06)",
    btnSecText:    "#f5f5f7",
    shadow:        "0 1px 2px rgba(0,0,0,0.7), 0 8px 28px rgba(0,0,0,0.45)",
    shadowCard:    "0 0 0 0.5px rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.35)",
    shadowHov:     "0 0 0 0.5px rgba(255,255,255,0.1), 0 8px 36px rgba(0,0,0,0.55)",
    scrollbar:     "rgba(255,255,255,0.1)",
    selectBg:      "#111111",
    cursorFill:    "rgba(245,245,247,0.85)",
    cursorRing:    "rgba(245,245,247,0.18)",
    accent:        "#34c759",
    toggleLabel:   "Light",
    toggleIcon:    "☀️",
  },
  light: {
    bg:            "#ffffff",
    bgAlt:         "#f5f5f7",
    bgCard:        "rgba(0,0,0,0.028)",
    bgCardHover:   "rgba(0,0,0,0.05)",
    bgGlass:       "rgba(255,255,255,0.78)",
    navBg:         "rgba(255,255,255,0.75)",
    border:        "rgba(0,0,0,0.08)",
    borderHover:   "rgba(0,0,0,0.18)",
    text:          "#1d1d1f",
    textSub:       "rgba(29,29,31,0.58)",
    textMuted:     "rgba(29,29,31,0.36)",
    tagBg:         "rgba(0,0,0,0.045)",
    tagText:       "rgba(29,29,31,0.54)",
    btnBg:         "#1d1d1f",
    btnText:       "#ffffff",
    btnSecBg:      "rgba(0,0,0,0.05)",
    btnSecText:    "#1d1d1f",
    shadow:        "0 1px 2px rgba(0,0,0,0.05), 0 8px 28px rgba(0,0,0,0.07)",
    shadowCard:    "0 0 0 0.5px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.06)",
    shadowHov:     "0 0 0 0.5px rgba(0,0,0,0.1), 0 8px 36px rgba(0,0,0,0.12)",
    scrollbar:     "rgba(0,0,0,0.15)",
    selectBg:      "#f5f5f7",
    cursorFill:    "rgba(29,29,31,0.82)",
    cursorRing:    "rgba(29,29,31,0.18)",
    accent:        "#34c759",
    toggleLabel:   "Dark",
    toggleIcon:    "🌙",
  },
};

/* ─── ANIMATION VARIANTS ────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.58, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

/* ─── SCROLL REVEAL ─────────────────────────────── */
function Reveal({ children, variants = fadeUp, custom = 0, style = {} }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div ref={ref} style={style}
      initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={variants} custom={custom}
    >{children}</motion.div>
  );
}

/* ─── THEME TOGGLE BUTTON ───────────────────────── */
function ThemeToggle({ theme, onToggle, T, isMobile }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      title={`Switch to ${T.toggleLabel} Mode`}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "0.3rem 0.7rem", borderRadius: 20,
        background: T.bgCard, border: `1px solid ${T.border}`,
        cursor: isMobile ? "pointer" : "none",
        transition: "background 0.3s, border-color 0.3s",
        flexShrink: 0,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span key={theme}
          initial={{ rotate: -20, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 20, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: "0.82rem", lineHeight: 1 }}
        >{T.toggleIcon}</motion.span>
      </AnimatePresence>
      <span style={{ fontSize: "0.72rem", fontWeight: 500, color: T.textSub, fontFamily: "var(--font-apple)", lineHeight: 1, letterSpacing: "0.01em" }}>
        {T.toggleLabel}
      </span>
    </motion.button>
  );
}

/* ─── CUSTOM CURSOR ─────────────────────────────── */
function Cursor({ T }) {
  const pos   = useRef({ x: -100, y: -100 });
  const dot   = useRef(null);
  const ring  = useRef(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    let rafId, rx = -100, ry = -100;
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) dot.current.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 3}px)`;
    };
    const tick = () => {
      rx += (pos.current.x - rx) * 0.11;
      ry += (pos.current.y - ry) * 0.11;
      if (ring.current) ring.current.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      rafId = requestAnimationFrame(tick);
    };
    const enter = (e) => { if (e.target.closest("a,button,input,textarea,select")) setHov(true); };
    const leave = (e) => { if (e.target.closest("a,button,input,textarea,select")) setHov(false); };
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const sz = hov ? 44 : 36;
  return (
    <>
      <div ref={dot} style={{ position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none", width: 6, height: 6, borderRadius: "50%", background: T.cursorFill, willChange: "transform" }} />
      <div ref={ring} style={{ position: "fixed", top: 0, left: 0, zIndex: 9998, pointerEvents: "none", width: sz, height: sz, borderRadius: "50%", border: `1px solid ${hov ? T.borderHover : T.cursorRing}`, willChange: "transform", marginLeft: hov ? -4 : 0, marginTop: hov ? -4 : 0, transition: "width 0.22s, height 0.22s, border-color 0.22s, margin 0.22s" }} />
    </>
  );
}

/* ─── VIDEO PLACEHOLDER ─────────────────────────── */
function VideoSlot({ label, hint, id, T }) {
  return (
    <div style={{ width: "100%", minHeight: 188, border: `1.5px dashed ${T.border}`, borderRadius: 14, background: T.bgCard, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "1.5rem", textAlign: "center" }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", background: T.tagBg, color: T.textMuted }}>▶</div>
      <div style={{ fontFamily: "var(--font-apple)", fontWeight: 500, fontSize: "0.82rem", color: T.textSub }}>{label}</div>
      <div style={{ fontFamily: "var(--font-apple)", fontSize: "0.7rem", color: T.textMuted, lineHeight: 1.6, maxWidth: 260 }}>{hint}</div>
      <code style={{ fontSize: "0.6rem", color: T.textMuted, fontFamily: "ui-monospace,'SF Mono',monospace", opacity: 0.6 }}>id: {id}</code>
    </div>
  );
}

/* ─── PROJECT CARD ──────────────────────────────── */
function ProjectCard({ p, i, T, isMobile }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal variants={scaleIn} custom={i % 3} style={{ height: "100%" }}>
      <motion.a
        href={p.link} target="_blank" rel="noopener noreferrer"
        onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
        whileHover={{ y: -4, transition: { type: "spring", stiffness: 260, damping: 22 } }}
        style={{
          display: "flex", flexDirection: "column", gap: "0.95rem",
          padding: "1.55rem 1.6rem", height: "100%",
          background: hov ? T.bgCardHover : T.bgCard,
          border: `1px solid ${hov ? T.borderHover : T.border}`,
          borderRadius: 16, textDecoration: "none",
          boxShadow: hov ? T.shadowHov : T.shadowCard,
          transition: "background 0.25s, border-color 0.25s, box-shadow 0.3s",
          cursor: isMobile ? "pointer" : "none",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Shimmer line */}
        <motion.div animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.28 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.2) 50%,transparent 100%)" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: T.textMuted, fontFamily: "var(--font-apple)", display: "block", marginBottom: 6 }}>{p.category}</span>
            <h3 style={{ fontFamily: "var(--font-apple)", fontWeight: 600, fontSize: "0.96rem", color: T.text, lineHeight: 1.38, letterSpacing: "-0.01em" }}>{p.title}</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0, marginLeft: "1rem" }}>
            <span style={{ fontSize: "0.68rem", color: T.textMuted, fontFamily: "var(--font-apple)" }}>{p.year}</span>
            <motion.span animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -4 }} transition={{ duration: 0.2 }}
              style={{ fontSize: "0.9rem", color: T.textSub }}>↗</motion.span>
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: T.textSub, lineHeight: 1.76, fontWeight: 400, fontFamily: "var(--font-apple)", flex: 1, letterSpacing: "0.006em" }}>{p.desc}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem" }}>
          {p.tech.map((t, ti) => (
            <span key={ti} style={{ fontSize: "0.65rem", padding: "0.2rem 0.6rem", borderRadius: 20, border: `1px solid ${T.border}`, color: T.tagText, fontFamily: "var(--font-apple)", background: T.tagBg, letterSpacing: "0.02em" }}>{t}</span>
          ))}
        </div>
      </motion.a>
    </Reveal>
  );
}

/* ─── MAIN ──────────────────────────────────────── */
export default function Portfolio() {
  /* Theme init — respects localStorage then system pref */
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("portfolio-theme");
      if (s) return s;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
  });
  const T = THEMES[theme];

  const [active,   setActive]   = useState("Home");
  const [menu,     setMenu]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form,     setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [sent,     setSent]     = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const R = {
    Home: useRef(null), Work: useRef(null),
    About: useRef(null), Contact: useRef(null),
  };

  /* Parallax */
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY, [0, 500], [0, 55]);
  const heroOp = useTransform(scrollY, [0, 320], [1, 0]);
  const sY     = useSpring(heroY, { stiffness: 72, damping: 22 });

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("portfolio-theme", next);
      return next;
    });
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      const order = ["Contact", "About", "Work", "Home"];
      for (const k of order) {
        if (R[k].current && window.scrollY >= R[k].current.offsetTop - 140) { setActive(k); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = T.bg;
  }, [theme, T.bg]);

  const go = (k) => { R[k]?.current?.scrollIntoView({ behavior: "smooth" }); setMenu(false); };

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 3500);
  };

  /* Shared input style */
  const inp = {
    width: "100%", padding: "0.8rem 1rem",
    background: T.bgCard, border: `1px solid ${T.border}`,
    borderRadius: 10, color: T.text,
    fontSize: "0.86rem", fontFamily: "var(--font-apple)", fontWeight: 400,
    outline: "none", transition: "border-color 0.2s, background 0.3s",
    boxSizing: "border-box", letterSpacing: "0.008em",
  };

  /* Shared section header parts */
  const labelStyle  = { fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.11em", textTransform: "uppercase", color: T.textMuted, marginBottom: 10, fontFamily: "var(--font-apple)" };
  const titleStyle  = { fontFamily: "var(--font-apple)", fontWeight: 700, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", letterSpacing: "-0.035em", color: T.text, lineHeight: 1.08 };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "var(--font-apple)", overflowX: "hidden", cursor: isMobile ? "auto" : "none", transition: "background 0.35s, color 0.35s" }}>

      {!isMobile && <Cursor T={T} />}

      {/* ── NAV ─────────────────────────────────────────────── */}
      <motion.nav
        animate={{
          background: scrolled ? T.navBg : "transparent",
          backdropFilter: scrolled ? "blur(36px) saturate(180%)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(36px) saturate(180%)" : "blur(0px)",
          borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
          boxShadow: scrolled ? T.shadow : "none",
        }}
        transition={{ duration: 0.28 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 900, height: 58 }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>

          {/* Wordmark */}
          <motion.button onClick={() => go("Home")} whileTap={{ scale: 0.97 }}
            style={{ background: "none", border: "none", cursor: isMobile ? "pointer" : "none", fontFamily: "var(--font-apple)", fontWeight: 700, fontSize: "1rem", color: T.text, letterSpacing: "-0.02em", flexShrink: 0 }}
          >Abhay Ghongade</motion.button>

          {/* Desktop nav links */}
          <div className="desk-nav" style={{ display: "flex", gap: "0.1rem", alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <motion.button key={l} onClick={() => go(l)}
                style={{ background: active === l ? T.tagBg : "none", border: `1px solid ${active === l ? T.border : "transparent"}`, borderRadius: 8, cursor: isMobile ? "pointer" : "none", padding: "0.38rem 0.88rem", fontFamily: "var(--font-apple)", fontWeight: 400, fontSize: "0.85rem", letterSpacing: "0.005em", color: active === l ? T.text : T.textSub, transition: "all 0.2s" }}
              >{l}</motion.button>
            ))}
            <motion.a href="/Abhay_Resume.pdf" target="_blank" rel="noopener noreferrer"
              whileHover={{ background: T.bgCardHover }}
              style={{ marginLeft: "0.4rem", padding: "0.38rem 0.88rem", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgCard, color: T.text, textDecoration: "none", fontFamily: "var(--font-apple)", fontWeight: 500, fontSize: "0.85rem", transition: "background 0.2s" }}
            >Resume ↗</motion.a>
            <div style={{ marginLeft: "0.4rem" }}>
              <ThemeToggle theme={theme} onToggle={toggleTheme} T={T} isMobile={isMobile} />
            </div>
          </div>

          {/* Mobile controls */}
          <div className="mob-controls" style={{ display: "none", alignItems: "center", gap: "0.55rem" }}>
            <ThemeToggle theme={theme} onToggle={toggleTheme} T={T} isMobile={isMobile} />
            <button onClick={() => setMenu(v => !v)} aria-label="Menu"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 5 }}
            >
              <span style={{ display: "block", width: 22, height: 1.5, background: T.text, transition: "all 0.25s", transform: menu ? "rotate(45deg) translateY(3.25px)" : "none", transformOrigin: "center" }} />
              <span style={{ display: "block", width: 22, height: 1.5, background: T.text, transition: "all 0.25s", transform: menu ? "rotate(-45deg) translateY(-3.25px)" : "none", transformOrigin: "center" }} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ position: "fixed", inset: 0, zIndex: 800, background: T.bgGlass, backdropFilter: "blur(36px) saturate(180%)", WebkitBackdropFilter: "blur(36px) saturate(180%)", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "2rem 2rem 5rem" }}
          >
            <div style={{ ...labelStyle, marginBottom: "2rem" }}>Navigation</div>
            {NAV_LINKS.map((l, i) => (
              <motion.button key={l} onClick={() => go(l)}
                initial={{ x: -14, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ display: "flex", alignItems: "baseline", gap: "1rem", background: "none", border: "none", cursor: "pointer", padding: "0.45rem 0", width: "100%", textAlign: "left" }}
              >
                <span style={{ fontFamily: "var(--font-apple)", fontSize: "0.65rem", color: T.textMuted, minWidth: 20 }}>0{i + 1}</span>
                <span style={{ fontFamily: "var(--font-apple)", fontWeight: 700, fontSize: "clamp(1.75rem,7vw,2.5rem)", color: active === l ? T.text : T.textSub, letterSpacing: "-0.035em", lineHeight: 1.1, transition: "color 0.2s" }}>{l}</span>
              </motion.button>
            ))}
            <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
              {SOCIALS.map(s => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: T.textSub, textDecoration: "none", fontFamily: "var(--font-apple)", fontSize: "0.85rem" }}>{s.label}</a>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ HERO ══════════════════════════════════ */}
      <section ref={R.Home} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "9rem 1.5rem 5rem", position: "relative", zIndex: 2, overflow: "hidden" }}>

        {/* Ambient radial — subtle, theme-aware */}
        <div style={{ position: "absolute", top: "-8%", left: "50%", transform: "translateX(-50%)", width: 720, height: 720, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: theme === "dark" ? "radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 68%)" : "radial-gradient(circle,rgba(0,0,0,0.018) 0%,transparent 68%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: `linear-gradient(to top, ${T.bg}, transparent)`, zIndex: 1, pointerEvents: "none" }} />

        <motion.div style={{ maxWidth: 720, textAlign: "center", position: "relative", zIndex: 2, y: isMobile ? 0 : sY, opacity: isMobile ? 1 : heroOp }}>

          {/* Status badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${T.border}`, borderRadius: 100, padding: "0.42rem 1.1rem", marginBottom: "2.4rem", background: T.bgCard, backdropFilter: "blur(14px)", fontSize: "0.75rem", letterSpacing: "0.02em", color: T.textSub, fontFamily: "var(--font-apple)", fontWeight: 500 }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, display: "inline-block", boxShadow: `0 0 8px ${T.accent}99` }} />
            Available for work · 2026
          </motion.div>

          {/* H1 */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{ fontFamily: "var(--font-apple)", fontWeight: 700, fontSize: "clamp(2.7rem,7.2vw,5.4rem)", lineHeight: 1.05, letterSpacing: "-0.045em", color: T.text, marginBottom: "1.5rem" }}
          >
            Building intelligent<br />
            <span style={{ color: T.textSub }}>web applications</span><br />
            for the AI era.
          </motion.h1>

          {/* Sub */}
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{ fontSize: "clamp(0.96rem,2.1vw,1.12rem)", color: T.textSub, lineHeight: 1.78, maxWidth: 478, margin: "0 auto 2.8rem", fontWeight: 400, letterSpacing: "0.01em" }}
          >
            CS student specialising in Java, Spring Boot and modern frontend.
            Focused on AI integration, clean architecture and real-world impact.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{ display: "flex", gap: "0.7rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button onClick={() => go("Work")}
              whileHover={{ scale: 1.025, opacity: 0.88 }} whileTap={{ scale: 0.975 }}
              style={{ padding: "0.78rem 1.8rem", borderRadius: 100, background: T.btnBg, border: "none", cursor: isMobile ? "pointer" : "none", color: T.btnText, fontFamily: "var(--font-apple)", fontWeight: 500, fontSize: "0.9rem", letterSpacing: "0.008em", boxShadow: T.shadow }}
            >View My Work</motion.button>
            <motion.button onClick={() => go("Contact")}
              whileHover={{ scale: 1.025, background: T.bgCardHover }} whileTap={{ scale: 0.975 }}
              style={{ padding: "0.78rem 1.8rem", borderRadius: 100, background: T.btnSecBg, border: `1px solid ${T.border}`, backdropFilter: "blur(14px)", cursor: isMobile ? "pointer" : "none", color: T.btnSecText, fontFamily: "var(--font-apple)", fontWeight: 500, fontSize: "0.9rem", letterSpacing: "0.008em", transition: "background 0.2s" }}
            >Get in Touch</motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.32 }} transition={{ delay: 1.6, duration: 0.8 }}
          style={{ position: "absolute", bottom: "2.2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2 }}
        >
          <span style={{ fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-apple)", color: T.textMuted }}>Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 1, height: 38, background: `linear-gradient(to bottom,${T.textMuted},transparent)`, transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* ══════════════ WORK ══════════════════════════════════ */}
      <section ref={R.Work} style={{ padding: "7rem 1.5rem", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: "3.5rem" }}>
            <div style={labelStyle}>01 — Featured Work</div>
            <h2 style={titleStyle}>Projects</h2>
          </Reveal>

          {/* Video slots */}
          {/* <Reveal style={{ marginBottom: "2.5rem" }}>
            <p style={{ ...labelStyle, marginBottom: "1rem" }}>Showcase Videos</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1rem" }}>
              <VideoSlot label="Demo Reel" hint="A short walkthrough or screen recording of your best project." id="video-demo-reel" T={T} />
              <VideoSlot label="Code Walkthrough" hint="Architecture or live code walkthrough." id="video-code-walk" T={T} />
            </div>
          </Reveal> */}

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1rem" }}>
            {PROJECTS.map((p, i) => <ProjectCard key={i} p={p} i={i} T={T} isMobile={isMobile} />)}
          </div>
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════════════════════════ */}
      <section ref={R.About} style={{ padding: "7rem 1.5rem", position: "relative", zIndex: 2, background: theme === "light" ? "rgba(0,0,0,0.016)" : "rgba(255,255,255,0.013)", transition: "background 0.35s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: "3.5rem" }}>
            <div style={labelStyle}>02 — About Me</div>
            <h2 style={titleStyle}>My Story</h2>
          </Reveal>

          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.2rem" }}>

            {/* Bio card */}
            <Reveal custom={0} style={{ height: "100%" }}>
              <div style={{ padding: "2rem", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, display: "flex", flexDirection: "column", gap: "1.1rem", height: "100%", boxShadow: T.shadowCard }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", background: T.tagBg }}> <img
    src="/ab.jpeg"
    alt="icon"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  /> </div>
                <h3 style={{ fontFamily: "var(--font-apple)", fontWeight: 600, fontSize: "1.1rem", color: T.text, letterSpacing: "-0.015em" }}>Hey, I'm Abhay</h3>
                <p style={{ color: T.textSub, lineHeight: 1.78, fontSize: "0.88rem", fontWeight: 400, letterSpacing: "0.008em" }}>A passionate full-stack developer and Computer Science student with a love for creating beautiful, functional digital experiences. My journey spans backend systems with Java &amp; Spring Boot through to modern frontend interfaces.</p>
                <p style={{ color: T.textSub, lineHeight: 1.78, fontSize: "0.88rem", fontWeight: 400, letterSpacing: "0.008em" }}>Deeply fascinated by the intersection of AI and web development — constantly exploring how intelligent systems can enhance user experiences and solve real-world problems.</p>

                <VideoSlot label="Personal Introduction" hint="A short intro video — a face-to-face greeting for visitors." id="video-intro" T={T} />

                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                  {SOCIALS.map(s => (
                    <motion.a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      style={{ padding: "0.42rem 0.88rem", borderRadius: 20, border: `1px solid ${T.border}`, background: T.tagBg, color: T.textSub, textDecoration: "none", fontFamily: "var(--font-apple)", fontWeight: 500, fontSize: "0.78rem", transition: "all 0.2s" }}
                    >{s.label}</motion.a>
                  ))}
                  <motion.a href="/Abhay_Resume.pdf" target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, background: T.bgCardHover }}
                    style={{ padding: "0.42rem 0.88rem", borderRadius: 20, border: `1px solid ${T.border}`, background: T.bgCard, color: T.text, textDecoration: "none", fontFamily: "var(--font-apple)", fontWeight: 500, fontSize: "0.78rem", transition: "all 0.2s", boxShadow: T.shadowCard }}
                  >Resume ↗</motion.a>
                </div>
              </div>
            </Reveal>

            {/* Skills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {SKILLS.map((s, i) => (
                <Reveal key={i} variants={scaleIn} custom={i * 0.4}>
                  <motion.div
                    whileHover={{ boxShadow: T.shadowHov, borderColor: T.borderHover }}
                    style={{ padding: "1.1rem 1.35rem", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: T.shadowCard, transition: "box-shadow 0.25s, border-color 0.25s" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.72rem" }}>
                      <span style={{ fontSize: "1rem" }}>{s.icon}</span>
                      <h4 style={{ fontFamily: "var(--font-apple)", fontWeight: 600, fontSize: "0.86rem", color: T.text, letterSpacing: "-0.005em" }}>{s.category}</h4>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem" }}>
                      {s.tags.map((t, ti) => (
                        <span key={ti} style={{ fontSize: "0.67rem", padding: "0.2rem 0.62rem", borderRadius: 20, border: `1px solid ${T.border}`, color: T.tagText, fontFamily: "var(--font-apple)", background: T.tagBg }}>{t}</span>
                      ))}
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Stats */}
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: T.shadowCard }}>
              {[["6+","Projects Completed"],["2+","Years of Learning"],["100%","Dedication"]].map(([n, l], i) => (
                <div key={i} style={{ background: i === 1 ? T.bgCard : "transparent", padding: "1.8rem", textAlign: "center", borderRight: i < 2 ? `1px solid ${T.border}` : "none", transition: "background 0.35s" }}>
                  <div style={{ fontFamily: "var(--font-apple)", fontWeight: 700, fontSize: "2.2rem", color: T.text, marginBottom: 6, letterSpacing: "-0.04em" }}>{n}</div>
                  <div style={{ fontSize: "0.67rem", letterSpacing: "0.09em", textTransform: "uppercase", color: T.textMuted, fontFamily: "var(--font-apple)", fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ CONTACT ════════════════════════════════ */}
      <section ref={R.Contact} style={{ padding: "7rem 1.5rem 9rem", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: "3.5rem" }}>
            <div style={labelStyle}>03 — Contact</div>
            <h2 style={titleStyle}>Let's Work Together</h2>
            <p style={{ color: T.textSub, fontSize: "0.95rem", marginTop: "0.6rem", fontWeight: 400, letterSpacing: "0.008em" }}>Have a project in mind? Let's bring it to life.</p>
          </Reveal>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.55fr", gap: "1.2rem" }}>

            {/* Info panel */}
            <Reveal custom={0}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {[["📧","Email","ghongadeabhay60@gmail.com"],["📱","Phone","+91 8459357358"],["📍","Location","India"],["💼","LinkedIn","@abhay-ghongade"]].map(([icon, label, val], i) => (
                  <motion.div key={i}
                    whileHover={{ boxShadow: T.shadowHov, borderColor: T.borderHover }}
                    style={{ padding: "0.9rem 1.2rem", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, display: "flex", alignItems: "center", gap: "0.9rem", boxShadow: T.shadowCard, transition: "box-shadow 0.25s, border-color 0.25s" }}
                  >
                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, marginBottom: 3, fontFamily: "var(--font-apple)" }}>{label}</div>
                      <div style={{ fontSize: "0.82rem", color: T.textSub, fontWeight: 400 }}>{val}</div>
                    </div>
                  </motion.div>
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.48rem" }}>
                  {SOCIALS.map(s => (
                    <motion.a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                      whileHover={{ scale: 1.025, boxShadow: T.shadowHov }}
                      style={{ padding: "0.62rem", borderRadius: 10, textAlign: "center", border: `1px solid ${T.border}`, background: T.bgCard, color: T.textSub, textDecoration: "none", fontFamily: "var(--font-apple)", fontWeight: 500, fontSize: "0.78rem", transition: "all 0.2s" }}
                    >{s.label}</motion.a>
                  ))}
                </div>

                {/* <VideoSlot label="Message for Clients" hint="A short video pitch for potential collaborators or employers." id="video-client-pitch" T={T} /> */}
              </div>
            </Reveal>

            {/* Form */}
            <Reveal custom={1}>
              <div style={{ padding: "2rem", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, boxShadow: T.shadowCard }}>
                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.88rem" }}>
                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.88rem" }}>
                    <input type="text" placeholder="Full Name *" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inp} />
                    <input type="email" placeholder="Email Address *" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inp} />
                  </div>
                  <input type="text" placeholder="Subject *" required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} style={inp} />
                  <select defaultValue="" style={{ ...inp, appearance: "none", WebkitAppearance: "none" }}>
                    <option value="" disabled>Select Project Type</option>
                    <option>Web Development</option>
                    <option>Web Design</option>
                    <option>Full Stack Application</option>
                    <option>Consultation</option>
                    <option>Other</option>
                  </select>
                  <textarea placeholder="Tell me about your project..." required rows={6} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ ...inp, resize: "vertical", minHeight: 130 }} />
                  <motion.button type="submit"
                    whileHover={{ scale: 1.015, opacity: 0.9 }} whileTap={{ scale: 0.985 }}
                    animate={{
                      background: sent ? (theme === "dark" ? "rgba(52,199,89,0.12)" : "rgba(52,199,89,0.09)") : T.btnBg,
                      color: sent ? T.accent : T.btnText,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ padding: "0.88rem", borderRadius: 100, border: sent ? `1px solid ${T.accent}44` : "none", cursor: isMobile ? "pointer" : "none", fontFamily: "var(--font-apple)", fontWeight: 500, fontSize: "0.9rem", letterSpacing: "0.008em", boxShadow: sent ? "none" : T.shadow }}
                  >
                    {sent ? "✓ Message Sent!" : "Send Message →"}
                  </motion.button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "1.75rem 1.5rem", background: T.bgCard, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", position: "relative", zIndex: 2, transition: "background 0.35s, border-color 0.35s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontFamily: "var(--font-apple)", fontWeight: 700, fontSize: "0.9rem", color: T.text, letterSpacing: "-0.02em" }}>Abhay Ghongade</div>
            <div style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 3, fontFamily: "var(--font-apple)", fontWeight: 400 }}>CS Student · Java · Spring Boot · AI · India</div>
          </div>
          <div style={{ display: "flex", gap: "1.4rem", flexWrap: "wrap", alignItems: "center" }}>
            {SOCIALS.map(s => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.78rem", color: T.textMuted, textDecoration: "none", fontFamily: "var(--font-apple)", transition: "color 0.2s" }}>{s.label}</a>)}
            <span style={{ fontSize: "0.72rem", color: T.textMuted, fontFamily: "var(--font-apple)" }}>© 2026 Abhay Ghongade</span>
          </div>
        </div>
      </footer>

      {/* ══════════════ GLOBAL STYLES ══════════════════════════ */}
      <style>{`
        :root {
          --font-apple: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
                        "Helvetica Neue", Arial, sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: ${T.bg};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transition: background 0.35s;
        }

        /* Inputs */
        input:focus, textarea:focus, select:focus {
          border-color: ${T.borderHover} !important;
          outline: none;
        }
        input::placeholder, textarea::placeholder { color: ${T.textMuted}; }

        /* Select arrow */
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath stroke='rgba(128,128,128,0.6)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none' d='m1 1 4 4 4-4'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.9rem center;
          background-size: 10px;
          padding-right: 2.4rem !important;
        }
        select option { background: ${T.selectBg}; color: ${T.text}; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.scrollbar}; border-radius: 3px; }
        ::selection { background: rgba(0,122,255,0.18); color: ${T.text}; }

        /* Cursor */
        @media (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .desk-nav     { display: none !important; }
          .mob-controls { display: flex !important; }
          .about-grid   { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row     { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .mob-controls { display: none !important; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
