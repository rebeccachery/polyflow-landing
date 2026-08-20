import type { Metadata } from "next";
import Link from "next/link";
import EchoDemo from "@/components/EchoDemo";
import styles from "./echo.module.css";

export const metadata: Metadata = {
  title: "Echo | Polyflow",
  description:
    "Practice Haitian Creole with Echo — listen, speak, and get pronunciation feedback.",
};

export default function EchoPage() {
  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <div className={`container ${styles.topInner}`}>
          <Link href="/" className={styles.brand}>
            <span className={styles.mark} aria-hidden />
            Polyflow
          </Link>
          <nav className={styles.nav}>
            <Link href="/#product">Product</Link>
            <Link href="/#waitlist" className="btn btn-primary">
              Join the waitlist →
            </Link>
          </nav>
        </div>
      </header>

      <div className={`container ${styles.content}`}>
        <div className={styles.intro}>
          <p className={`${styles.eyebrow} mono`}>Live demo</p>
          <h1>Try Echo.</h1>
          <p>
            Listen to a Haitian Creole phrase, practice with your microphone, and see how closely
            you matched.
          </p>
        </div>
        <EchoDemo showHeader={false} compact />
      </div>
    </main>
  );
}
