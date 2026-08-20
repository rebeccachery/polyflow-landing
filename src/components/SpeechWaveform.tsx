"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_WORDS } from "@/lib/phrases";
import styles from "./SpeechWaveform.module.css";

type Props = {
  active?: boolean;
  onToggle?: () => void;
};

type Floater = {
  id: number;
  word: string;
  x: number;
  y: number;
};

export default function SpeechWaveform({ active = false, onToggle }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const phase = useRef(0);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const floaterId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let disposed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      if (disposed) return;
      const { width, height } = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.52;
      const energy = active ? 1.35 : 0.72 + Math.abs(pointer.current.x - 0.5) * 0.5;
      phase.current += active ? 0.045 : 0.016;

      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.42);
      glow.addColorStop(0, "rgba(22, 78, 122, 0.16)");
      glow.addColorStop(0.45, "rgba(224, 176, 74, 0.08)");
      glow.addColorStop(1, "rgba(246, 241, 232, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const layers = [
        { amp: 42 * energy, freq: 1.6, color: "rgba(22, 78, 122, 0.85)", width: 2.4 },
        { amp: 28 * energy, freq: 2.4, color: "rgba(210, 74, 56, 0.55)", width: 1.6 },
        { amp: 18 * energy, freq: 3.3, color: "rgba(224, 176, 74, 0.7)", width: 1.4 },
      ];

      layers.forEach((layer, index) => {
        ctx.beginPath();
        const steps = Math.ceil(width / 4);
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * width;
          const nx = i / steps;
          const wobble =
            Math.sin(nx * Math.PI * layer.freq * 2 + phase.current + index) *
              layer.amp *
              (0.35 + Math.sin(nx * Math.PI) * 0.65) +
            Math.sin(nx * 18 + phase.current * 1.7) * (active ? 6 : 2.5);
          const y = cy + wobble + (pointer.current.y - 0.5) * 18;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.width;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      const bars = 48;
      for (let i = 0; i < bars; i++) {
        const t = i / (bars - 1);
        const x = width * 0.12 + t * width * 0.76;
        const h =
          (8 +
            Math.abs(Math.sin(phase.current * 1.8 + i * 0.45)) * 26 * energy +
            Math.abs(Math.sin(phase.current * 3 + i)) * (active ? 18 : 6)) *
          (0.4 + Math.sin(t * Math.PI) * 0.6);
        const top = cy - h;
        ctx.fillStyle = i % 7 === 0 ? "rgba(210, 74, 56, 0.55)" : "rgba(22, 78, 122, 0.28)";
        ctx.fillRect(x, top, 2.5, h * 2);
      }

      if (!reduced) {
        for (let i = 0; i < 18; i++) {
          const t = (phase.current * 0.08 + i / 18) % 1;
          const x = width * 0.1 + t * width * 0.8;
          const wave =
            Math.sin(t * Math.PI * 3.2 + phase.current) * 34 * energy +
            (pointer.current.y - 0.5) * 16;
          ctx.beginPath();
          ctx.fillStyle = i % 3 === 0 ? "rgba(224, 176, 74, 0.85)" : "rgba(22, 78, 122, 0.55)";
          ctx.arc(x, cy + wave, i % 4 === 0 ? 2.4 : 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  const spawnWord = (clientX: number, clientY: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const word = HERO_WORDS[floaterId.current % HERO_WORDS.length];
    floaterId.current += 1;
    const id = floaterId.current;
    setFloaters((prev) => [
      ...prev.slice(-5),
      {
        id,
        word,
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100,
      },
    ]);
    window.setTimeout(() => {
      setFloaters((prev) => prev.filter((item) => item.id !== id));
    }, 1600);
  };

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${active ? styles.active : ""}`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current = {
          x: (event.clientX - rect.left) / rect.width,
          y: (event.clientY - rect.top) / rect.height,
        };
      }}
      onClick={(event) => {
        spawnWord(event.clientX, event.clientY);
        onToggle?.();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle?.();
        }
      }}
      aria-label={active ? "Pause speech visualization" : "Play speech visualization"}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.ring} aria-hidden />
      <div className={styles.phonemes} aria-hidden>
        <span>/bɔ̃/</span>
        <span>/ʒu/</span>
        <span>/kʁe/</span>
        <span>/jɔl/</span>
      </div>
      {floaters.map((item) => (
        <span
          key={item.id}
          className={styles.floater}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {item.word}
        </span>
      ))}
    </div>
  );
}
