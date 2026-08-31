/**
 * journeyData.js
 * ────────────────────────────────────────────────────────────────
 * Single source of truth for the "My Story" section.
 *
 * Everything the UI renders (year, title, copy, and the asset shown
 * inside the memory bubble) comes from this array. Add, remove, or
 * reorder milestones here — the components never need to change.
 *
 * ASSETS
 *  - `image`     preferred. A png/jpg placed in /public, e.g. /images/journey/class10.png
 *  - `document`  the PDF for this milestone (e.g. /documents/journey/class10.pdf).
 *                Clicking the card (image OR placeholder) opens this in a new tab.
 *
 * Neither field is required. If both are missing, DocumentPreview renders a clean
 * placeholder card instead of a broken image — nothing crashes.
 *
 * NOTE: institution / achievement are placeholders below (marked "—").
 * Replace them with your real details — nothing here is invented.
 */
export const journey = [
  {
    id: 1,
    year: "2019",
    title: "Class 10",
    subtitle: "Secondary School",
    institution: "— add your school name —",
    achievement: "— add board / percentage if you want to show it —",
    description:
      "Where it started — the first taste of structured learning and the first signs of what I gravitated toward.",
    image: "/images/journey/class10.png",
    document: "/documents/journey/class10.pdf",
  },
  {
    id: 2,
    year: "2021",
    title: "Class 12",
    subtitle: "Higher Secondary",
    institution: "— add your school/college name —",
    achievement: "— add stream / percentage if you want to show it —",
    description:
      "Chose the science stream and started narrowing in on computing — the point where curiosity turned into direction.",
    image: "/images/journey/class12.png",
    document: "/documents/journey/class12.pdf",
  },
  {
    id: 3,
    year: "2021 — 2025",
    title: "B.Tech",
    subtitle: "Computer Engineering",
    institution: "— add your college/university name —",
    achievement: "— add CGPA / honors if you want to show it —",
    description:
      "Four years of building real things — from first programs to full-stack projects — and learning how software actually gets made.",
    image: "/images/journey/btech.png",
    document: "/documents/journey/btech.pdf",
  },
  {
    id: 4,
    year: "2025 — 2026",
    title: "1-Year Course",
    subtitle: "— add course name —",
    institution: "— add institute name —",
    achievement: "",
    description:
      "A focused year spent going deeper into a specific track, sharpening skills that the degree only introduced.",
    image: "/images/journey/one-year-course.png",
    document: "/documents/journey/one-year-course.pdf",
  },
  {
    id: 5,
    year: "2026",
    title: "C-DAC",
    subtitle: "— add exact program name —",
    institution: "Centre for Development of Advanced Computing",
    achievement: "",
    description:
      "The most recent chapter — an intensive, industry-facing program that pushed everything before it into practice.",
    image: "/images/journey/cdac.png",
    document: "/documents/journey/cdac.pdf",
  },
];