"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./ProblemSection.module.css";

const pipeline = ["Language", "Speech", "Data", "Model", "Product"];

export default function ProblemSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className={`reveal ${styles.section}`} ref={ref} id="about">
      <div className="container">
        <div className={styles.intro}>
          <p className={`${styles.eyebrow} mono`}>The gap</p>
          <h2>The AI revolution doesn&apos;t speak everyone.</h2>
          <p>
            Major AI systems have dramatically improved speech and language technology — but
            coverage remains deeply unequal. When a language lacks abundant speech data, the
            pipeline breaks before a product can ever exist.
          </p>
        </div>

        <div className={styles.compare}>
          <div className={styles.column}>
            <h3>Languages with abundant AI data</h3>
            <div className={styles.bars}>
              {["English", "Spanish", "Mandarin"].map((lang, index) => (
                <div key={lang} className={styles.barRow}>
                  <span>{lang}</span>
                  <div className={styles.track}>
                    <div
                      className={styles.fillRich}
                      style={{ width: `${96 - index * 8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <ol className={styles.flow}>
              {pipeline.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className={styles.note}>Full path from voice to product.</p>
          </div>

          <div className={`${styles.column} ${styles.limited}`}>
            <h3>Languages with limited speech data</h3>
            <div className={styles.bars}>
              {["Haitian Creole", "Many African languages", "Indigenous languages"].map(
                (lang, index) => (
                  <div key={lang} className={styles.barRow}>
                    <span>{lang}</span>
                    <div className={styles.track}>
                      <div
                        className={styles.fillLimited}
                        style={{ width: `${28 - index * 6}%` }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
            <ol className={`${styles.flow} ${styles.broken}`}>
              {pipeline.map((step, index) => (
                <li key={step} className={index >= 2 ? styles.dim : undefined}>
                  {step}
                  {index === 2 ? <em>break</em> : null}
                </li>
              ))}
            </ol>
            <p className={styles.note}>Under-resourced languages get left behind here.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
