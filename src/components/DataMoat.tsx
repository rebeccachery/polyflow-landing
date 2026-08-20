"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./DataMoat.module.css";

const steps = [
  "Community voices",
  "Curated data",
  "Speech + text alignment",
  "Quality control",
  "Language models",
  "Better experiences",
];

export default function DataMoat() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className={`reveal ${styles.section}`} ref={ref} id="research">
      <div className="container">
        <div className={styles.header}>
          <p className={`${styles.eyebrow} mono`}>The data moat</p>
          <h2>Better language AI starts with better language data.</h2>
          <p>
            Polyflow is building speech infrastructure — not wrapping an existing LLM API and
            calling it a day.
          </p>
        </div>

        <ol className={styles.flow}>
          {steps.map((step, index) => (
            <li key={step} style={{ animationDelay: `${index * 90}ms` }}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
