import OpenAI from "openai";
import { toFile } from "openai/uploads";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "Demo audio not configured: missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!audio || !(audio instanceof Blob) || audio.size === 0) {
      return Response.json({ error: "Missing audio file" }, { status: 400 });
    }

    const filename =
      audio instanceof File && audio.name ? audio.name : "recording.webm";

    const file = await toFile(audio, filename, {
      type: audio.type || "audio/webm",
    });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      language: "ht",
    });

    const text = (transcription.text || "").trim();

    if (!text) {
      return Response.json({ error: "Empty transcript" }, { status: 422 });
    }

    return Response.json({ text });
  } catch (err: unknown) {
    console.error("Transcription error:", err);

    const status =
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      typeof (err as { status: unknown }).status === "number"
        ? (err as { status: number }).status
        : 500;

    const apiMessage =
      typeof err === "object" &&
      err !== null &&
      "error" in err &&
      typeof (err as { error: unknown }).error === "object" &&
      (err as { error: { message?: unknown } }).error !== null &&
      typeof (err as { error: { message?: unknown } }).error.message === "string"
        ? (err as { error: { message: string } }).error.message
        : typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof (err as { message: unknown }).message === "string"
          ? (err as { message: string }).message
          : "Transcription failed";

    let error = "Transcription failed";
    if (status === 429 || /quota|billing|rate limit/i.test(apiMessage)) {
      error = "Groq rate limit hit. Wait a moment and try again.";
    } else if (/Connection error|ECONNRESET|fetch failed/i.test(apiMessage)) {
      error = "Could not reach Groq. Check your network, then try again.";
    } else if (
      status === 401 ||
      /invalid.*api key|incorrect api key|invalid api key/i.test(apiMessage)
    ) {
      error = "Invalid Groq API key. Update GROQ_API_KEY in .env.local.";
    }

    return Response.json({ error }, { status: status >= 400 ? status : 500 });
  }
}
