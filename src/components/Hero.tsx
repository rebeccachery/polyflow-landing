"use client";

import { useState } from "react";
import SpeechWaveform from "@/components/SpeechWaveform";
import { playPhrase, stopPlayback } from "@/lib/echo/audio";
import { ECHO_PHRASES } from "@/lib/echo/phrases";
import styles from "./Hero.module.css";

export default function Hero() {
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const phrase = ECHO_PHRASES[0];

  async function handlePlay() {
    if (playing) {
      stopPlayback();
      setPlaying(false);
      setStatus(null);
      return;
    }

    setPlaying(true);
    setStatus(null);
    try {
      const mode = await playPhrase(phrase.creole, 1, {
        allowBrowserFallback: true,
      });
      if (mode === "fallback") {
        setStatus("Played with browser voice (ElevenLabs unavailable).");
      }
    } catch (err) {
      setStatus(
        err instanceof Error
          ? err.message
          : "Demo audio not configured. Add ELEVENLABS_API_KEY in .env.local."
      );
    } finally {
      setPlaying(false);
    }
  }

  return (
    <section className={styles.hero} id="top">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.brand}>Polyflow</p>
          <h1 className={styles.title}>
            AI should speak
            <br />
            <em>your</em> language.
          </h1>
          <p className={styles.lead}>
            Polyflow builds speech technology for languages the AI world has overlooked —
            starting with Haitian Creole.
          </p>
          <div className={styles.actions}>
            <a href="#waitlist" className="btn btn-primary">
              Join the waitlist
            </a>
            <button type="button" className="btn btn-secondary" onClick={handlePlay}>
              {playing ? "Playing…" : "Hear Polyflow →"}
            </button>
            <a href="/echo" className="btn btn-ghost">
              Try Echo
            </a>
          </div>
          {status ? <p className={styles.status}>{status}</p> : null}
        </div>

        <div className={styles.visual}>
          <SpeechWaveform active={playing} onToggle={handlePlay} />
          <div className={styles.micro}>
            <p>Press play to hear what we&apos;re building.</p>
            <button
              type="button"
              className={`${styles.playChip} ${playing ? styles.chipActive : ""}`}
              onClick={handlePlay}
            >
              <span aria-hidden>{playing ? "❚❚" : "▶"}</span>
              <strong>{phrase.creole}</strong>
              <span className="mono">{phrase.ipa}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
