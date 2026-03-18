"use client";

import { useMemo, useState } from "react";
import KjvAppShell from "../components/KjvAppShell";
import styles from "../kjvApp.module.css";
import { COMPARISONS, TOPICS, type ComparisonPair } from "../demoData";

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ComparePage() {
  const [selectedTopicId, setSelectedTopicId] = useState(TOPICS[0]?.id ?? "");
  const [pair, setPair] = useState<ComparisonPair>(COMPARISONS[0]);

  const allPairs = useMemo(() => COMPARISONS, []);

  return (
    <KjvAppShell
      topics={TOPICS}
      selectedTopicId={selectedTopicId}
      onSelectTopic={(id) => setSelectedTopicId(id)}
    >
      <div className={styles.pageTitleWrap}>
        <div className={styles.pageTitle}>Compare</div>
        <div className={styles.pageSubtitle}>
          Side-by-side theme comparison (placeholder pairs). Once your dataset importer is wired, these
          pairs will be derived from the relevant topic mappings.
        </div>
      </div>

      <section className={styles.compareCard} aria-label="Law vs Paul's gospel comparison">
        <div className={styles.compareHeader}>Law vs Paul&apos;s Gospel</div>
        <div className={styles.tableWrap}>
          <div className={styles.compareGrid}>
            <div>
              <div className={styles.compareRef}>{pair.lawTitle}</div>
              <div className={styles.verseRef}>{pair.law.ref}</div>
              <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>
                {pair.law.kjv}
              </div>
              <div style={{ marginTop: 14, color: "rgba(255,255,255,0.7)", fontWeight: 900, fontSize: 12 }}>
                흠정역 한글성경전서
              </div>
              <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>
                {pair.law.korean}
              </div>
            </div>
            <div>
              <div className={styles.compareRef}>{pair.paulsTitle}</div>
              <div className={styles.verseRef}>{pair.paulsGospel.ref}</div>
              <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>
                {pair.paulsGospel.kjv}
              </div>
              <div style={{ marginTop: 14, color: "rgba(255,255,255,0.7)", fontWeight: 900, fontSize: 12 }}>
                흠정역 한글성경전서
              </div>
              <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>
                {pair.paulsGospel.korean}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, paddingLeft: 2, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setPair(randomFrom(allPairs))}
            >
              Generate comparison
            </button>
          </div>
        </div>
      </section>
    </KjvAppShell>
  );
}

