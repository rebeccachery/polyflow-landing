"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./Stats.module.css";

const stats = [
  { value: "26,800+", label: "curated language examples" },
  { value: "60+ hrs", label: "proprietary Haitian Creole speech" },
  { value: "32", label: "user interviews" },
  { value: "42%", label: "organic referrals" },
];

export default function Stats() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className={`reveal ${styles.section}`} ref={ref}>
      <div className="container">
        <p className={styles.kicker}>Building speech infrastructure for under-resourced languages</p>
        <div className={styles.row}>
          {stats.map((stat) => (
            <div key={stat.value} className={styles.item}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
