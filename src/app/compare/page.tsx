"use client";

import { useMemo, useState } from "react";
import KjvAppShell from "../components/KjvAppShell";
import styles from "../kjvApp.module.css";
import { TOPICS, type Verse } from "../demoData";

type VerseWithTopic = Verse & { topicTitle: string };

function uniqByRef<T extends { ref: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    if (seen.has(item.ref)) continue;
    seen.add(item.ref);
    out.push(item);
  }
  return out;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scoreText(text: string, keywords: string[]): number {
  const t = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (!kw) continue;
    if (t.includes(kw)) score += 1;
  }
  return score;
}

export default function ComparePage() {
  const [selectedTopicId, setSelectedTopicId] = useState(TOPICS[0]?.id ?? "");
  const [expanded, setExpanded] = useState(false);

  const { lawPool, paulsPool } = useMemo(() => {
    const all: VerseWithTopic[] = TOPICS.flatMap((t) =>
      t.verses.map((v) => ({
        ...v,
        topicTitle: t.title,
      })),
    );

    // Heuristic classification from KJV text. This is intentionally simple:
    // it picks "law/works/commandments/tradition" vs "grace/faith/gospel/justified".
    const lawKeywords = [
      "law",
      "commandment",
      "commandments",
      "works",
      "circumcision",
      "obey",
      "tradition",
      "ministration",
      "death",
      "condemnation",
    ];
    const paulsKeywords = [
      "grace",
      "faith",
      "gospel",
      "justified",
      "righteousness",
      "redemption",
      "ransom",
      "propitiation",
      "unsearchable",
      "in christ",
      "spirit",
      "new man",
      "deliver",
      "peace",
      "saved",
    ];

    const scored = all.map((v) => ({
      v,
      lawScore: scoreText(v.kjv, lawKeywords),
      paulsScore: scoreText(v.kjv, paulsKeywords),
    }));

    const lawCandidates = scored
      .filter((x) => x.lawScore > 0)
      .sort((a, b) => b.lawScore - a.lawScore)
      .map((x) => x.v);

    const paulsCandidates = scored
      .filter((x) => x.paulsScore > 0)
      .sort((a, b) => b.paulsScore - a.paulsScore)
      .map((x) => x.v);

    return {
      lawPool: uniqByRef(lawCandidates),
      paulsPool: uniqByRef(paulsCandidates),
    };
  }, []);

  const [lawVerses, setLawVerses] = useState<VerseWithTopic[]>(() =>
    lawPool[0] ? [lawPool[0]] : [],
  );
  const [paulsVerses, setPaulsVerses] = useState<VerseWithTopic[]>(() =>
    paulsPool[0] ? [paulsPool[0]] : [],
  );

  function pickExpandedVerses(pool: VerseWithTopic[], count: number) {
    if (pool.length <= count) return pool.slice(0, count);
    // Sample without repetition.
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  function onGenerateComparison() {
    // Always refresh content; expanded shows ~30x more verses.
    if (!lawPool.length || !paulsPool.length) return;

    if (!expanded) {
      setExpanded(true);
      setLawVerses(pickExpandedVerses(lawPool, 30));
      setPaulsVerses(pickExpandedVerses(paulsPool, 30));
      return;
    }

    setLawVerses(pickExpandedVerses(lawPool, 30));
    setPaulsVerses(pickExpandedVerses(paulsPool, 30));
  }

  return (
    <KjvAppShell
      topics={TOPICS}
      selectedTopicId={selectedTopicId}
      onSelectTopic={(id) => setSelectedTopicId(id)}
    >
      <div className={styles.pageTitleWrap}>
        <div className={styles.pageTitle}>Compare</div>
        <div className={styles.pageSubtitle}>
          Side-by-side theme comparison. Click the button to expand ~30x with relevant verses from your dataset.
        </div>
      </div>

      <section className={styles.compareCard} aria-label="Law vs Paul's gospel comparison">
        <div className={styles.compareHeader}>Law vs Paul&apos;s Gospel</div>
        <div className={styles.tableWrap}>
          <div className={styles.compareGrid}>
            <div>
              <div className={styles.compareRef}>Law</div>

              <div className={styles.compareSideLabel}>
                Showing {lawVerses.length} verse(s){expanded ? " (expanded)" : ""}
              </div>

              <div className={styles.compareScroll}>
                {lawVerses.map((v) => (
                  <div key={v.ref} className={styles.compareItem}>
                    <div className={styles.verseRef}>{v.ref}</div>
                    <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>{v.kjv}</div>
                    <div className={styles.compareKoreanLabel}>흠정역 한글성경전서</div>
                    <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>{v.korean}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={styles.compareRef}>Paul&apos;s Gospel</div>

              <div className={styles.compareSideLabel}>
                Showing {paulsVerses.length} verse(s){expanded ? " (expanded)" : ""}
              </div>

              <div className={styles.compareScroll}>
                {paulsVerses.map((v) => (
                  <div key={v.ref} className={styles.compareItem}>
                    <div className={styles.verseRef}>{v.ref}</div>
                    <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>{v.kjv}</div>
                    <div className={styles.compareKoreanLabel}>흠정역 한글성경전서</div>
                    <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>{v.korean}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, paddingLeft: 2, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={onGenerateComparison}
            >
              {expanded ? "Regenerate expanded comparison" : "Generate expanded comparison"}
            </button>

            {!expanded ? (
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => {
                  if (!lawPool.length || !paulsPool.length) return;
                  const law = randomFrom(lawPool);
                  const pauls = randomFrom(paulsPool);
                  setLawVerses([law]);
                  setPaulsVerses([pauls]);
                }}
              >
                Randomize (collapsed)
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </KjvAppShell>
  );
}

