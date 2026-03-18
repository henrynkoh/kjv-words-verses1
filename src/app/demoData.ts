export type Verse = {
  ref: string; // canonical-ish display ref
  kjv: string;
  korean: string;
};

export type Topic = {
  id: string;
  title: string;
  subtitle?: string;
  verses: Verse[];
};

export type Chip = {
  id: string;
  label: string;
  topicId: string;
  chipColor: string; // CSS color for border/text
  chipBg: string; // CSS color for background
};

export const KJV_WORDS_REPO_URL = "https://github.com/henrynkoh/kjv-words-verses1";

// Generated dataset:
// - `scripts/build-verse-data.mjs` parses your Section blocks and writes `generatedVerseData.ts`
// - we keep a small fallback so the UI still renders even before generation happens.
import { TOPICS as GENERATED_TOPICS, CHIPS as GENERATED_CHIPS } from "./generatedVerseData";

const FALLBACK_TOPICS: Topic[] = [
  {
    id: "christ-end-of-law",
    title: "Christ end of law",
    subtitle: "For righteousness to everyone that believeth.",
    verses: [
      {
        ref: "Romans 10:4",
        kjv: "For Christ is the end of the law for righteousness to every one that believeth.",
        korean: "그리스도는 믿는 모든 사람에게 의를 위하여 율법의 끝이시니라.",
      },
    ],
  },
  {
    id: "pauls-gospel",
    title: "Paul's gospel",
    subtitle: "The gospel message given through Paul.",
    verses: [
      {
        ref: "Romans 2:16",
        kjv: "In the day when God shall judge the secrets of men by Jesus Christ according to my gospel.",
        korean:
          "곧 하나님이 예수 그리스도로 말미암아 사람의 은밀한 것을 심판하시는 그 날에 나의 복음대로 하시리라.",
      },
    ],
  },
];

const FALLBACK_CHIPS: Chip[] = [
  {
    id: "chip-christ-end-of-law",
    label: "Christ end of law",
    topicId: "christ-end-of-law",
    chipColor: "#a78bfa",
    chipBg: "rgba(167, 139, 250, 0.10)",
  },
  {
    id: "chip-pauls-gospel",
    label: "Paul's gospel",
    topicId: "pauls-gospel",
    chipColor: "#fbbf24",
    chipBg: "rgba(251, 191, 36, 0.12)",
  },
];

export const TOPICS: Topic[] =
  (GENERATED_TOPICS as Topic[]).length > 0 ? (GENERATED_TOPICS as Topic[]) : FALLBACK_TOPICS;

export const CHIPS: Chip[] =
  (GENERATED_CHIPS as Chip[]).length > 0 ? (GENERATED_CHIPS as Chip[]) : FALLBACK_CHIPS;

export type ComparisonPair = {
  lawTitle: string;
  paulsTitle: string;
  law: { ref: string; kjv: string; korean: string };
  paulsGospel: { ref: string; kjv: string; korean: string };
};

export const COMPARISONS: ComparisonPair[] = [
  {
    lawTitle: "Law",
    paulsTitle: "Paul's Gospel",
    law: {
      ref: "Deuteronomy 6:25",
      kjv: "And it shall be our righteousness, if we observe to do all these commandments before the LORD our God, as he hath commanded us.",
      korean:
        "그리고 그것은 여호와 우리 하나님 앞에서 그가 명하신 대로 이 모든 명령들을 지켜 행할 때 우리의 의가 되리라.",
    },
    paulsGospel: {
      ref: "Ephesians 2:8-9",
      kjv: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.",
      korean:
        "너희가 그 은혜를 인하여 믿음으로 말미암아 구원을 받았나니 이것은 너희에게서 난 것이 아니요 하나님의 선물이니라. 행위에서 난 것이 아니니 이는 누구든지 자랑하지 못하게 함이니라.",
    },
  },
];

