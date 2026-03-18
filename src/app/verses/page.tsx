"use client";

import KjvAppShell from "../components/KjvAppShell";
import styles from "../kjvApp.module.css";
import { TOPICS } from "../demoData";
import type { Topic } from "../demoData";

export default function AllVersesPage() {
  // Shell sidebar selection exists; for now we just render the full list.
  return (
    <KjvAppShell
      topics={TOPICS}
      selectedTopicId={TOPICS[0]?.id ?? ""}
      onSelectTopic={() => {
        // No-op for now (UI parity with the reference: sidebar stays available).
      }}
    >
      <div className={styles.pageTitleWrap}>
        <div className={styles.pageTitle}>All verses</div>
        <div className={styles.pageSubtitle}>
          Every verse listed once, grouped by topic (placeholder dataset for now).
        </div>
      </div>

      <div className={styles.list} aria-label="All verses grouped by topic">
        {TOPICS.map((topic: Topic) => (
          <section key={topic.id} className={styles.topicSection}>
            <div className={styles.topicSectionTitle}>{topic.title}</div>
            {topic.verses.map((v) => (
              <div key={v.ref} className={styles.verseItem}>
                <div className={styles.verseItemRef}>{v.ref}</div>
                <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>{v.kjv}</div>
                <div style={{ marginTop: 10, color: "rgba(255,255,255,0.7)", fontWeight: 900, fontSize: 12 }}>
                  흠정역 한글성경전서
                </div>
                <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>{v.korean}</div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </KjvAppShell>
  );
}

