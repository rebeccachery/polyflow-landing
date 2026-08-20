export const runtime = "nodejs";

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";
/** Multilingual demo voice from ElevenLabs docs (override with ELEVENLABS_VOICE_ID). */
const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const MAX_TEXT_LENGTH = 500;

type TtsRequestBody = {
  text?: unknown;
  rate?: unknown;
};

/**
 * Light orthography tweaks so multilingual_v2 (no native HT) reads
 * Haitian Creole phrases more like Kreyòl than French/English.
 */
function prepareHaitianCreoleText(text: string): string {
  let prepared = text.trim();

  prepared = prepared.replace(/\bMRI\b/g, "èm èr i");

  const replacements: Array<[RegExp, string]> = [
    [/\bdoulè\b/gi, "dou-lè"],
    [/\bkouche\b/gi, "kou-che"],
    [/\bdekri\b/gi, "dé-kri"],
    [/\bechèl\b/gi, "é-chèl"],
    [/\bsouffle\b/gi, "soufle"],
    [/\bsiviv\b/gi, "si-viv"],
    [/\bkenz\b/gi, "kènz"],
    [/\bminit\b/gi, "mi-nit"],
    [/\bRezilta\b/g, "Ré-zil-ta"],
    [/\brezilta\b/g, "ré-zil-ta"],
    [/\bBonjou\b/g, "Bon-jou"],
    [/\bKijan\b/g, "Ki-jan"],
    [/\bMèsi\b/g, "Mè-si"],
    [/\bkreyòl\b/gi, "kré-yòl"],
    [/\bkonprann\b/gi, "kon-prann"],
  ];

  for (const [pattern, replacement] of replacements) {
    prepared = prepared.replace(pattern, replacement);
  }

  return prepared;
}

function clampRate(rate: unknown): number {
  if (typeof rate !== "number" || Number.isNaN(rate)) {
    return 1;
  }
  return Math.min(1.2, Math.max(0.7, rate < 1 ? 0.75 : 1));
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Demo audio not configured: missing ELEVENLABS_API_KEY" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as TtsRequestBody;
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return Response.json({ error: "Text too long" }, { status: 400 });
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
    const modelId = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID;
    const speed = clampRate(body.rate);
    const preparedText = prepareHaitianCreoleText(text);

    const url = new URL(
      `${ELEVENLABS_API_BASE}/text-to-speech/${encodeURIComponent(voiceId)}/stream`
    );
    url.searchParams.set("output_format", "mp3_44100_128");

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: preparedText,
        model_id: modelId,
        previous_text:
          "Pale kreyòl ayisyen yo klèman, ak yon aksan Karayib natirèl:",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true,
          speed,
        },
        apply_text_normalization: "on",
      }),
    });

    if (!upstream.ok || !upstream.body) {
      let detail = "";
      try {
        detail = await upstream.text();
      } catch {
        detail = "";
      }

      console.error("ElevenLabs TTS error:", upstream.status, detail);

      let error = "Speech generation failed";
      if (upstream.status === 401 || upstream.status === 403) {
        error =
          "Invalid ElevenLabs API key. Update ELEVENLABS_API_KEY in .env.local.";
      } else if (upstream.status === 429) {
        error = "ElevenLabs rate limit hit. Wait a moment and try again.";
      } else if (/quota|payment|billing/i.test(detail)) {
        error =
          "ElevenLabs quota exceeded. Check your ElevenLabs account billing.";
      }

      return Response.json(
        { error },
        { status: upstream.status >= 400 ? upstream.status : 500 }
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    console.error("TTS error:", err);

    const message =
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message: unknown }).message === "string"
        ? (err as { message: string }).message
        : "Speech generation failed";

    let error = "Speech generation failed";
    if (/Connection error|ECONNRESET|fetch failed/i.test(message)) {
      error =
        "Could not reach ElevenLabs. Check your network, then try again.";
    }

    return Response.json({ error }, { status: 500 });
  }
}
