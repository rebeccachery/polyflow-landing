import type { EchoPhrase } from "./phrases";

export function normalizeForScore(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,?!'"’“”]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function calculateScore(target: string, transcript: string): number {
  const a = normalizeForScore(target);
  const b = normalizeForScore(transcript);
  if (!a || !b) return 0;
  const distance = levenshtein(a, b);
  const maxLength = Math.max(a.length, b.length);
  return Math.round(((maxLength - distance) / maxLength) * 100);
}

/** Split overall similarity into rough pronunciation / rhythm / clarity meters. */
export function scoreBreakdown(overall: number): {
  pronunciation: number;
  rhythm: number;
  clarity: number;
} {
  const pronunciation = Math.max(0, Math.min(100, overall + (overall >= 80 ? 2 : -3)));
  const rhythm = Math.max(0, Math.min(100, overall + (overall >= 70 ? 6 : -2)));
  const clarity = Math.max(0, Math.min(100, overall - (overall >= 85 ? 1 : 5)));
  return { pronunciation, rhythm, clarity };
}

export function tipForPhrase(phrase: EchoPhrase | undefined, score: number): string {
  if (!phrase || score >= 100) return "";
  return phrase.tip || "";
}
