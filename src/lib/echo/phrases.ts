export type EchoPhrase = {
  id: string;
  creole: string;
  english: string;
  ipa: string;
  tip?: string;
};

export const ECHO_PHRASES: EchoPhrase[] = [
  {
    id: "bonjou",
    creole: "Bonjou",
    english: "Hello",
    ipa: "/bɔ̃.ʒu/",
    tip: "Say Bonjou with a nasal first vowel — closer to “bohn-joo” than “bon-joo.”",
  },
  {
    id: "kijan",
    creole: "Kijan ou ye?",
    english: "How are you?",
    ipa: "/ki.ʒan u je/",
    tip: "In kijan, the j is soft like French j — not an English “j” as in “jump.”",
  },
  {
    id: "mesi",
    creole: "Mèsi anpil",
    english: "Thank you very much",
    ipa: "/mɛ.si ɑ̃.pil/",
    tip: "Keep mèsi short; stress anpil lightly on the second syllable.",
  },
  {
    id: "pale",
    creole: "Mwen pale kreyòl.",
    english: "I speak Creole.",
    ipa: "/mwɛ̃ pa.le kʁe.jɔl/",
    tip: "In kreyòl, the r is soft/throaty — avoid an English rolled r.",
  },
  {
    id: "pita",
    creole: "N ap wè pita",
    english: "See you later",
    ipa: "/n ap we pi.ta/",
    tip: "Say N ap as a quick glide — almost “nap” — then clear wè.",
  },
  {
    id: "konprann",
    creole: "Mwen konprann",
    english: "I understand",
    ipa: "/mwɛ̃ kɔ̃.pʁɑ̃/",
    tip: "Both vowels in konprann are nasal; don’t release a hard English “n” at the end.",
  },
];
