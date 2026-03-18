"use client";

import { useMemo, useState } from "react";
import KjvAppShell from "../components/KjvAppShell";
import styles from "../kjvApp.module.css";
import { CHIPS, TOPICS, type Chip, type Verse } from "../demoData";

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function VersePage() {
  const [selectedTopicId, setSelectedTopicId] = useState(TOPICS[0]?.id ?? "");
  const [selectedChipId, setSelectedChipId] = useState(CHIPS[0]?.id ?? "");
  const [selectedVerse, setSelectedVerse] = useState<Verse>(() => TOPICS[0]?.verses[0]);

  const selectedTopic = useMemo(
    () => TOPICS.find((t) => t.id === selectedTopicId) ?? TOPICS[0],
    [selectedTopicId],
  );

  const topicChips = useMemo(
    () => CHIPS.filter((c) => c.topicId === selectedTopicId),
    [selectedTopicId],
  );

  const cardTitle = "Rightly Dividing the Word of Truth";

  function onGenerateVerse() {
    if (!selectedTopic?.verses?.length) return;
    setSelectedVerse(randomFrom(selectedTopic.verses));
  }

  function onSelectChip(chip: Chip) {
    setSelectedChipId(chip.id);
    // For now, chip maps to topic; once transcript linking exists, it will map to a specific verse set.
    if (!selectedTopic?.verses?.length) return;
    setSelectedVerse(randomFrom(selectedTopic.verses));
  }

  return (
    <KjvAppShell
      topics={TOPICS}
      selectedTopicId={selectedTopicId}
      onSelectTopic={(id) => {
        setSelectedTopicId(id);
        const firstChip = CHIPS.find((c) => c.topicId === id);
        if (firstChip) setSelectedChipId(firstChip.id);
        const nextTopic = TOPICS.find((t) => t.id === id);
        if (nextTopic?.verses?.[0]) setSelectedVerse(nextTopic.verses[0]);
      }}
    >
      <div className={styles.pageTitleWrap}>
        <div className={styles.pageTitle}>Verse</div>
        <div className={styles.pageSubtitle}>
          Generate a verse for the selected topic. Colored chips help you navigate by theme (placeholder
          dataset for now).
        </div>
      </div>

      <section className={styles.card} aria-label="Verse generator">
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardHeaderTitle}>
              <div className={styles.cardBadge} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 7h10v10H7V7Z"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12h6"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {cardTitle}
            </div>
            <div className={styles.cardHeaderKicker}>&quot;Study to shew thyself approved unto God&quot; - 2 Timothy 2:15 KJV</div>
          </div>
        </div>

        <div className={styles.generateRow}>
          <button type="button" className={styles.primaryButton} onClick={onGenerateVerse}>
            Generate verse
          </button>
          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => {
              if (!selectedVerse?.ref) return;
              navigator.clipboard?.writeText(selectedVerse.ref).catch(() => {});
            }}
          >
            Copy ref
          </button>
        </div>

        <div className={styles.verseArea}>
          <div className={styles.verseRef}>{selectedVerse?.ref ?? ""}</div>
          <div className={styles.verseGrid}>
            <div>
              <div className={styles.verseColTitle}>KJV</div>
              <div className={styles.verseText}>{selectedVerse?.kjv ?? ""}</div>
            </div>
            <div>
              <div className={styles.verseColTitle}>흠정역 한글성경전서</div>
              <div className={[styles.verseText, styles.verseTextMuted].join(" ")}>
                {selectedVerse?.korean ?? ""}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chipsWrap}>
          <div className={styles.chipsTitle}>
            Topics / chips for <span style={{ color: "rgba(255,255,255,0.9)" }}>{selectedTopic.title}</span>
          </div>
          <div className={styles.chipsGrid}>
            {topicChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={[
                  styles.chipButton,
                  chip.id === selectedChipId ? styles.chipButtonActive : "",
                ].join(" ")}
                onClick={() => onSelectChip(chip)}
                style={{
                  borderColor: chip.chipColor,
                  background: chip.chipBg,
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </KjvAppShell>
  );
}

