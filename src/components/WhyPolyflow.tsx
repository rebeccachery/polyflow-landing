"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./WhyPolyflow.module.css";

const cards = [
  {
    title: "Hear",
    body: "Speech technology built around real voices, pronunciation, and context — not text alone.",
    icon: "hear",
  },
  {
    title: "Learn",
    body: "Curriculum-aware language experiences instead of generic translation boxes.",
    icon: "learn",
  },
  {
    title: "Build",
    body: "Infrastructure that can eventually support many under-resourced languages.",
    icon: "build",
  },
] as const;

function Icon({ name }: { name: (typeof cards)[number]["icon"] }) {
  if (name === "hear") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path
          d="M4 16c3-6 7-9 12-9s9 3 12 9c-3 6-7 9-12 9S7 22 4 16Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="16" cy="16" r="3.2" fill="currentColor" />
      </svg>
    );
  }
  if (name === "learn") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden>
        <path
          d="M6 10c4-3 8-4 10-4s6 1 10 4v12c-4-2.5-8-3.5-10-3.5S10 19.5 6 22V10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M16 8.5v12" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <path
        d="M7 22V10l9-4 9 4v12l-9 4-9-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M16 14v12M7 10l9 4 9-4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function WhyPolyflow() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className={`reveal ${styles.section}`} ref={ref} id="why">
      <div className="container">
        <div className={styles.header}>
          <p className={`${styles.eyebrow} mono`}>Why Polyflow</p>
          <h2>Speech-first by design.</h2>
        </div>
        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <span className={styles.glyph}>
                <Icon name={card.icon} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
