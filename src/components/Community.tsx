"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./Community.module.css";

const cities = ["NYC", "Miami", "Montreal", "Haiti"];

export default function Community() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className={`reveal ${styles.section}`} ref={ref}>
      <div className="container">
        <div className={styles.layout}>
          <div>
            <p className={`${styles.eyebrow} mono`}>Community</p>
            <h2>Built with the people who speak it.</h2>
            <p>
              Polyflow is being shaped alongside Haitian Creole speakers, educators, learners, and
              diaspora communities.
            </p>
            <a href="#waitlist" className="btn btn-secondary">
              Help us build it →
            </a>
          </div>

          <div className={styles.corridor} aria-label="Diaspora corridor">
            {cities.map((city, index) => (
              <div key={city} className={styles.node}>
                <span className={styles.dot} />
                <strong>{city}</strong>
                {index < cities.length - 1 ? <span className={styles.link} aria-hidden /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
