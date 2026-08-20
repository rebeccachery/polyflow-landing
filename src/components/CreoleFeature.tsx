"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { playPhrase, stopPlayback } from "@/lib/echo/audio";
import { ECHO_PHRASES } from "@/lib/echo/phrases";
import styles from "./CreoleFeature.module.css";

export default function CreoleFeature() {
  const ref = useReveal<HTMLElement>();
  const phrase = ECHO_PHRASES.find((item) => item.id === "pale") ?? ECHO_PHRASES[3];
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function play() {
    if (playing) {
      stopPlayback();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    setError(null);
    try {
      await playPhrase(phrase.creole, 1, { allowBrowserFallback: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Demo audio not configured. Add ELEVENLABS_API_KEY in .env.local."
      );
    } finally {
      setPlaying(false);
    }
  }

  return (
    <section className={`reveal ${styles.section}`} ref={ref}>
      <div className="container">
        <div className={styles.frame}>
          <div className={styles.copy}>
            <p className={`${styles.eyebrow} mono`}>Language first</p>
            <h2>Starting with Haitian Creole.</h2>
            <p>
              Haitian Creole is spoken by millions of people around the world. Yet modern speech
              technology still struggles with pronunciation, recognition, and context.
            </p>
          </div>

          <figure className={styles.phrase}>
            <blockquote>{phrase.creole}</blockquote>
            <figcaption>
              <span>English</span>
              <strong>{phrase.english}</strong>
            </figcaption>
            <div className={styles.meta}>
              <span className="mono">{phrase.ipa}</span>
              <button type="button" onClick={play} className={styles.audio}>
                {playing ? "Playing…" : "▶ Play"}
              </button>
            </div>
            {error ? <p className={styles.error}>{error}</p> : null}
          </figure>
        </div>
      </div>
    </section>
  );
}
