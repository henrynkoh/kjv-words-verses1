import fs from "node:fs";
import path from "node:path";

const inputPath = path.join(process.cwd(), "data", "transcripts", "kjv-korean-sections.txt");
const outputPath = path.join(process.cwd(), "src", "app", "generatedVerseData.ts");

const input = fs.existsSync(inputPath) ? fs.readFileSync(inputPath, "utf8") : "";

// Simple slugifier for stable ids.
function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

// Palette for topic chips.
const palette = [
  ["#a78bfa", "rgba(167, 139, 250, 0.10)"],
  ["#fbbf24", "rgba(251, 191, 36, 0.12)"],
  ["#2dd4bf", "rgba(45, 212, 191, 0.10)"],
  ["#60a5fa", "rgba(96, 165, 250, 0.10)"],
  ["#fb7185", "rgba(251, 113, 133, 0.10)"],
  ["#34d399", "rgba(52, 211, 153, 0.10)"],
  ["#f472b6", "rgba(244, 114, 182, 0.10)"],
  ["#38bdf8", "rgba(56, 189, 248, 0.10)"],
  ["#f59e0b", "rgba(245, 158, 11, 0.10)"],
  ["#22c55e", "rgba(34, 197, 94, 0.10)"],
];

function extractSections(text) {
  // Splits by lines like:
  // Section 1: Some Title
  // Section 2: Another Title
  const sectionRegex = /^Section\s+(\d+)\s*:\s*(.+)\s*$/gim;
  const sections = [];

  let match;

  const allMatches = [];
  while ((match = sectionRegex.exec(text)) !== null) {
    allMatches.push({ match, index: match.index });
  }

  for (let i = 0; i < allMatches.length; i++) {
    const { match, index } = allMatches[i];
    const nextIndex = i + 1 < allMatches.length ? allMatches[i + 1].index : text.length;
    const sectionNum = Number(match[1]);
    const title = match[2].trim();
    const body = text.slice(index, nextIndex);
    sections.push({ sectionNum, title, body });
  }

  return sections;
}

function parseVerseBlocks(sectionBody) {
  // Expected repeating pattern inside each section:
  // KJV Bible Verse: "...." (Book X:Y-Z)
  // Korean Version (흠정역 한글성경전서): ....
  //
  // We parse with dotAll regex and stop Korean capture before next "KJV Bible Verse:" or "Section ".

  const kjvRegex =
    /KJV Bible Verse:\s*"([\s\S]*?)"\s*\(([^)]+)\)\s*(?:\n\s*)?Korean Version[^\n]*?:\s*([\s\S]*?)\n(?=\s*KJV Bible Verse:|\s*Section\s+\d+\s*:|$)/gim;

  const verses = [];
  let m;
  while ((m = kjvRegex.exec(sectionBody)) !== null) {
    const kjv = m[1].trim();
    const ref = m[2].trim();
    const korean = cleanKorean(m[3]).trim();

    // Normalize: some Korean payloads end with punctuation/paren artifacts; keep as-is except trimming.
    verses.push({ ref, kjv, korean });
  }
  return verses;
}

function cleanKorean(koreanText) {
  // The source transcript sometimes includes follow-up study questions after the last verse
  // inside the same Section block. Those English question lines can get captured into the
  // trailing Korean field unless we strip them.
  const s = String(koreanText ?? "");

  // Cut off any trailing lines that look like study questions or re-instructions.
  const questionCut = s.search(
    /^(\s*)(What is|How do|How does|How can|Explain|Why does|Why|Tell me|Please note|Based on the transcript|provide the complete)/im
  );
  if (questionCut !== -1) {
    return s.slice(0, questionCut).trimEnd();
  }

  // Some blocks include extra "Section X:" headers without being caught by lookaheads.
  const sectionCut = s.search(/^(\s*)Section\s+\d+\s*:/im);
  if (sectionCut !== -1) {
    return s.slice(0, sectionCut).trimEnd();
  }

  return s;
}

function validateRef(ref) {
  // Keep permissive since refs include ranges (e.g. 2:16-17).
  return typeof ref === "string" && ref.length > 0 && /:/.test(ref);
}

function main() {
  if (!input) {
    console.warn(
      `[build-verse-data] Input file not found or empty at: ${inputPath}\n` +
        `Create/populate it with your "Section ... / KJV Bible Verse / Korean Version" blocks, then rerun.`
    );
  }

  const sections = extractSections(input);

  // If no sections detected, fall back to empty.
  const topics = [];
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const versesRaw = parseVerseBlocks(s.body);
    const verses = uniqBy(
      versesRaw.filter((v) => validateRef(v.ref)),
      (v) => v.ref
    );
    const topicId = `section-${s.sectionNum}-${slugify(s.title) || `topic-${i}`}`;

    topics.push({
      id: topicId,
      title: s.title,
      verses,
    });
  }

  // Global dedupe by ref across all topics:
  // Keep the earliest occurrence (first section order) to avoid redundancy/omissions as requested.
  const seenRefs = new Set();
  const topicsDeduped = topics
    .map((t) => {
      const verses = t.verses.filter((v) => {
        if (seenRefs.has(v.ref)) return false;
        seenRefs.add(v.ref);
        return true;
      });
      return { ...t, verses };
    })
    .filter((t) => t.verses.length > 0);

  // Build chips: one per topic.
  const chips = topicsDeduped.map((t, idx) => {
    const [chipColor, chipBg] = palette[idx % palette.length];
    return {
      id: `chip-${t.id}`,
      label: t.title,
      topicId: t.id,
      chipColor,
      chipBg,
    };
  });

  // Emit TS file.
  const ts = `// Generated file. DO NOT EDIT.
// Source: ${path.relative(process.cwd(), inputPath)}

export const TOPICS = ${JSON.stringify(topicsDeduped, null, 2)};
export const CHIPS = ${JSON.stringify(chips, null, 2)};
`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, ts, "utf8");

  console.log(
    `[build-verse-data] Wrote ${topicsDeduped.length} topics and ${chips.length} chips to ${outputPath}`
  );
}

main();

