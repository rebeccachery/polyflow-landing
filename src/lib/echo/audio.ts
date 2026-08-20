const SPEECH_RMS_THRESHOLD = 0.02;
const SILENCE_RMS_THRESHOLD = 0.015;
const END_SILENCE_MS = 1400;
const MIN_SPEECH_MS = 600;

const ttsCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

function revokeObjectUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function stopPlayback() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export async function fetchTtsAudioUrl(text: string, rate = 1): Promise<string> {
  const cacheKey = `${rate < 1 ? "slow" : "normal"}:${text}`;
  const cached = ttsCache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, rate }),
  });

  if (!res.ok) {
    let data: { error?: string } | null = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    throw new Error(data?.error || "Speech generation failed");
  }

  const blob = await res.blob();
  if (!blob.size) {
    throw new Error("Empty audio response");
  }

  const url = URL.createObjectURL(blob);
  const previous = ttsCache.get(cacheKey);
  if (previous) revokeObjectUrl(previous);
  ttsCache.set(cacheKey, url);
  return url;
}

function playBrowserFallback(text: string, rate: number): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate < 1 ? 0.75 : 1;
    utterance.lang = "ht-HT";
    const voices = window.speechSynthesis.getVoices();
    const best = voices.find((v) => v.lang.toLowerCase().includes("fr")) || voices[0];
    if (best) utterance.voice = best;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export async function playPhrase(
  text: string,
  rate = 1,
  options?: { allowBrowserFallback?: boolean }
): Promise<"tts" | "fallback"> {
  stopPlayback();

  try {
    const src = await fetchTtsAudioUrl(text, rate);
    const audio = new Audio(src);
    currentAudio = audio;

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        currentAudio = null;
        resolve();
      };
      audio.onerror = () => {
        currentAudio = null;
        reject(new Error("Audio playback failed"));
      };
      audio.play().catch(reject);
    });

    return "tts";
  } catch (err) {
    if (options?.allowBrowserFallback === false) {
      throw err;
    }
    console.warn("ElevenLabs TTS unavailable, using browser fallback:", err);
    await playBrowserFallback(text, rate);
    return "fallback";
  }
}

export async function transcribeBlob(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  let data: { text?: string; error?: string } | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error || "Transcription failed. Please try again.");
  }

  const text = (data?.text || "").trim();
  if (!text) {
    throw new Error("Could not understand the audio. Please try again.");
  }

  return text;
}

type RecordOptions = {
  maxMs?: number;
  onSpeechStart?: () => void;
  signal?: AbortSignal;
};

export async function recordUntilSilence(
  options: RecordOptions = {}
): Promise<Blob> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone is not available in this browser.");
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    throw new Error(
      "Microphone access is required. Please allow mic permission and try again."
    );
  }

  const maxMs = options.maxMs ?? 14000;
  const recordedChunks: BlobPart[] = [];
  const mimeType = MediaRecorder.isTypeSupported("audio/webm")
    ? "audio/webm"
    : undefined;

  return new Promise<Blob>((resolve, reject) => {
    let settled = false;
    let mediaRecorder: MediaRecorder;
    let recordingMaxTimer: number | null = null;
    let silenceWatchId: number | null = null;
    let recordingAudioContext: AudioContext | null = null;

    const cleanup = () => {
      if (recordingMaxTimer) {
        window.clearTimeout(recordingMaxTimer);
        recordingMaxTimer = null;
      }
      if (silenceWatchId) {
        cancelAnimationFrame(silenceWatchId);
        silenceWatchId = null;
      }
      if (recordingAudioContext) {
        recordingAudioContext.close().catch(() => {});
        recordingAudioContext = null;
      }
      stream.getTracks().forEach((track) => track.stop());
    };

    const finish = (blob: Blob) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(blob);
    };

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    try {
      mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
    } catch {
      fail(new Error("Could not start recording in this browser."));
      return;
    }

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onerror = () => {
      fail(new Error("Recording failed. Please try again."));
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, {
        type: mediaRecorder.mimeType || "audio/webm",
      });
      if (!blob.size) {
        fail(new Error("No audio captured. Please try recording again."));
        return;
      }
      finish(blob);
    };

    const stopRecording = () => {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };

    options.signal?.addEventListener(
      "abort",
      () => {
        stopRecording();
        fail(new Error("Recording cancelled."));
      },
      { once: true }
    );

    mediaRecorder.start();

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (AudioCtx) {
      recordingAudioContext = new AudioCtx();
      const source = recordingAudioContext.createMediaStreamSource(stream);
      const analyser = recordingAudioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      let hasSpoken = false;
      let speechStartedAt = 0;
      let silenceStartedAt = 0;

      const tick = (now: number) => {
        if (mediaRecorder.state !== "recording") return;

        analyser.getByteTimeDomainData(samples);
        let sumSquares = 0;
        for (let i = 0; i < samples.length; i++) {
          const v = (samples[i] - 128) / 128;
          sumSquares += v * v;
        }
        const rms = Math.sqrt(sumSquares / samples.length);

        if (!hasSpoken) {
          if (rms >= SPEECH_RMS_THRESHOLD) {
            hasSpoken = true;
            speechStartedAt = now;
            silenceStartedAt = 0;
            options.onSpeechStart?.();
          }
        } else if (rms < SILENCE_RMS_THRESHOLD) {
          if (!silenceStartedAt) {
            silenceStartedAt = now;
          } else if (
            now - speechStartedAt >= MIN_SPEECH_MS &&
            now - silenceStartedAt >= END_SILENCE_MS
          ) {
            stopRecording();
            return;
          }
        } else {
          silenceStartedAt = 0;
        }

        silenceWatchId = requestAnimationFrame(tick);
      };

      silenceWatchId = requestAnimationFrame(tick);
    }

    recordingMaxTimer = window.setTimeout(stopRecording, maxMs);
  });
}

export function maxRecordingMsForPhrase(phrase: string): number {
  return Math.min(18000, Math.max(12000, phrase.length * 220));
}
