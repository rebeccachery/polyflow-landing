"use client";

import { useEffect, useRef, useState } from "react";
import {
  maxRecordingMsForPhrase,
  playPhrase,
  recordUntilSilence,
  stopPlayback,
  transcribeBlob,
} from "@/lib/echo/audio";
import { ECHO_PHRASES } from "@/lib/echo/phrases";
import { calculateScore, scoreBreakdown, tipForPhrase } from "@/lib/echo/score";
import styles from "./EchoDemo.module.css";

type Status = "idle" | "listening" | "recording" | "scoring" | "error";

type Props = {
  compact?: boolean;
  showHeader?: boolean;
};

export default function EchoDemo({ compact = false, showHeader = true }: Props) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [hint, setHint] = useState("Listen to the phrase, then practice aloud.");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [overall, setOverall] = useState<number | null>(null);
  const [meters, setMeters] = useState({
    pronunciation: 0,
    rhythm: 0,
    clarity: 0,
  });
  const abortRef = useRef<AbortController | null>(null);

  const phrase = ECHO_PHRASES[index % ECHO_PHRASES.length];
  const busy = status === "listening" || status === "recording" || status === "scoring";

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopPlayback();
    };
  }, []);

  function resetFeedback() {
    setError(null);
    setTranscript(null);
    setOverall(null);
    setMeters({ pronunciation: 0, rhythm: 0, clarity: 0 });
  }

  async function listen(rate = 1) {
    if (busy) return;
    abortRef.current?.abort();
    resetFeedback();
    setStatus("listening");
    setHint("Listen…");

    try {
      const mode = await playPhrase(phrase.creole, rate, {
        allowBrowserFallback: true,
      });
      setHint(
        mode === "fallback"
          ? "Played with browser voice (ElevenLabs unavailable). Your turn — Practice."
          : "Your turn — tap Practice and say it."
      );
      setStatus("idle");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Demo audio not configured. Add ELEVENLABS_API_KEY in .env.local.";
      setError(message);
      setHint("Fix audio config, then try Listen again.");
      setStatus("error");
    }
  }

  async function practice() {
    if (busy) return;
    abortRef.current?.abort();
    stopPlayback();
    resetFeedback();

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("recording");
    setHint("Recording… start speaking");

    try {
      const blob = await recordUntilSilence({
        maxMs: maxRecordingMsForPhrase(phrase.creole),
        signal: controller.signal,
        onSpeechStart: () => setHint("Listening… keep going, then pause."),
      });

      setStatus("scoring");
      setHint("Analyzing speech…");

      const heard = await transcribeBlob(blob);
      const score = calculateScore(phrase.creole, heard);
      const breakdown = scoreBreakdown(score);

      setTranscript(heard);
      setOverall(score);
      setMeters(breakdown);
      setHint(
        score >= 85
          ? "Strong match — try the next phrase."
          : tipForPhrase(phrase, score) || "Close — listen once more, then try again."
      );
      setStatus("idle");
    } catch (err) {
      if (controller.signal.aborted) return;
      const message =
        err instanceof Error ? err.message : "Practice failed. Please try again.";
      setError(message);
      setHint("Tap Practice to try again.");
      setStatus("error");
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }

  function nextPhrase() {
    abortRef.current?.abort();
    stopPlayback();
    resetFeedback();
    setIndex((value) => (value + 1) % ECHO_PHRASES.length);
    setHint("Listen to the phrase, then practice aloud.");
    setStatus("idle");
  }

  return (
    <section
      className={`${styles.section} ${compact ? styles.compact : ""}`}
      id="product"
    >
      <div className={compact ? undefined : "container"}>
        {showHeader ? (
          <div className={styles.header}>
            <p className={`${styles.eyebrow} mono`}>First product</p>
            <h2>Meet Echo.</h2>
            <p>A new way to learn, hear, and practice Haitian Creole.</p>
          </div>
        ) : null}

        <div className={styles.mock}>
          <div className={styles.chrome}>
            <span />
            <span />
            <span />
            <p className="mono">
              Echo · live practice · {index + 1}/{ECHO_PHRASES.length}
            </p>
          </div>

          <div className={styles.body}>
            <div className={styles.prompt}>
              <span className="mono">Repeat after me</span>
              <h3>“{phrase.creole}”</h3>
              <p>{phrase.english}</p>
              <p className={`${styles.ipa} mono`}>{phrase.ipa}</p>
            </div>

            <div className={styles.controls}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => listen(1)}
                disabled={busy}
              >
                {status === "listening" ? "Playing…" : "Listen"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => listen(0.5)}
                disabled={busy}
              >
                Slow
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={practice}
                disabled={busy}
              >
                {status === "recording"
                  ? "Listening…"
                  : status === "scoring"
                    ? "Scoring…"
                    : "Practice"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={nextPhrase}
                disabled={busy}
              >
                Next phrase
              </button>
            </div>

            <div
              className={`${styles.feedback} ${
                overall !== null || error ? styles.visible : ""
              }`}
            >
              <p className="mono">AI feedback</p>

              {error ? (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              ) : null}

              {overall !== null ? (
                <>
                  {(
                    [
                      ["Pronunciation", meters.pronunciation],
                      ["Rhythm", meters.rhythm],
                      ["Clarity", meters.clarity],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className={styles.meter}>
                      <div className={styles.meterLabel}>
                        <span>{label}</span>
                        <strong>{value}%</strong>
                      </div>
                      <div className={styles.meterTrack}>
                        <div style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                  <p className={styles.overall}>
                    Overall match <strong>{overall}%</strong>
                    {transcript ? (
                      <span className="mono"> · Heard: “{transcript}”</span>
                    ) : null}
                  </p>
                </>
              ) : (
                !error && (
                  <p className={styles.placeholder}>
                    Scores appear after you practice with your microphone.
                  </p>
                )
              )}
            </div>

            <p className={styles.hint} aria-live="polite">
              {hint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
