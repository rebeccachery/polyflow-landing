export type Phrase = {
  id: string;
  creole: string;
  english: string;
  ipa: string;
};

export const HERO_WORDS = [
  "Bonjou",
  "Kijan ou ye?",
  "Mèsi",
  "N ap wè pita",
  "Mwen konprann",
] as const;

export const PHRASES: Phrase[] = [
  {
    id: "bonjou",
    creole: "Bonjou",
    english: "Hello",
    ipa: "/bɔ̃.ʒu/",
  },
  {
    id: "kijan",
    creole: "Kijan ou ye?",
    english: "How are you?",
    ipa: "/ki.ʒan u je/",
  },
  {
    id: "mesi",
    creole: "Mèsi anpil",
    english: "Thank you very much",
    ipa: "/mɛ.si ɑ̃.pil/",
  },
  {
    id: "pale",
    creole: "Mwen pale kreyòl.",
    english: "I speak Creole.",
    ipa: "/mwɛ̃ pa.le kʁe.jɔl/",
  },
  {
    id: "pita",
    creole: "N ap wè pita",
    english: "See you later",
    ipa: "/n ap we pi.ta/",
  },
  {
    id: "konprann",
    creole: "Mwen konprann",
    english: "I understand",
    ipa: "/mwɛ̃ kɔ̃.pʁɑ̃/",
  },
];
