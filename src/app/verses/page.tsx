"use client";

import { useMemo, useState } from "react";
import KjvAppShell from "../components/KjvAppShell";
import styles from "../kjvApp.module.css";
import { TOPICS } from "../demoData";

export default function AllVersesPage() {
  const [selectedTopicId, setSelectedTopicId] = useState(TOPICS[0]?.id ?? "");

  const selectedTopic = useMemo(
    () => TOPICS.find((t) => t.id === selectedTopicId) ?? TOPICS[0],
    [selectedTopicId],
  );

  return (
    <KjvAppShell
      topics={TOPICS}
      selectedTopicId={selectedTopicId}
      onSelectTopic={(id) => setSelectedTopicId(id)}
    >
      <div className={styles.pageTitleWrap}>
        <div className={styles.pageTitle}>All verses</div>
        <div className={styles.pageSubtitle}>
          {selectedTopic ? (
            <>
              Showing <b>{selectedTopic.verses.length}</b> verse(s) for:{" "}
              <span style={{ color: "rgba(255,255,255,0.92)" }}>
                {selectedTopic.title}
              </span>
            </>
          ) : (
            "Select a topic from the left."
          )}
        </div>
      </div>

      <div className={styles.list} aria-label="All verses grouped by topic">
        {selectedTopic ? (
          <section key={selectedTopic.id} className={styles.topicSection}>
            <div className={styles.topicSectionTitle}>{selectedTopic.title}</div>
            {selectedTopic.subtitle ? (
              <div style={{ marginTop: 6, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                {selectedTopic.subtitle}
              </div>
            ) : null}

            {selectedTopic.verses.map((v) => (
              <div key={v.ref} className={styles.verseItem}>
                <div className={styles.verseItemRef}>{v.ref}</div>
                <div
                  className={[styles.verseText, styles.verseTextMuted].join(" ")}
                >
                  {v.kjv}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 900,
                    fontSize: 12,
                  }}
                >
                  흠정역 한글성경전서
                </div>
                <div
                  className={[styles.verseText, styles.verseTextMuted].join(" ")}
                >
                  {v.korean}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.7)", padding: 10 }}>
            No topic selected.
          </div>
        )}
      </div>
    </KjvAppShell>
  );
}

