"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "../kjvApp.module.css";
import type { Topic } from "../demoData";
import { KJV_WORDS_REPO_URL } from "../demoData";

type Props = {
  children: ReactNode;
  topics: Topic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
};

export default function KjvAppShell({
  children,
  topics,
  selectedTopicId,
  onSelectTopic,
}: Props) {
  const pathname = usePathname();

  const active = (id: string) => pathname === id;

  return (
    <div className={styles.app}>
      <header className={styles.topNav}>
        <div className={styles.brand}>
          <div className={styles.brandIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 19V7a3 3 0 0 1 3-3h9v2H9a1 1 0 0 0-1 1v12H6Z"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 19V9a2 2 0 0 1 2-2h8v2h-8v10H9Z"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.brandTitle}>
            KJV Words <span>- Milk 45</span>
          </div>
        </div>

        <nav className={styles.navLinks} aria-label="Primary navigation">
          <Link
            href="/verse"
            className={[styles.navLink, active("/verse") ? styles.navLinkActive : ""].join(" ")}
          >
            Verse
          </Link>
          <Link
            href="/compare"
            className={[
              styles.navLink,
              active("/compare") ? styles.navLinkActive : "",
            ].join(" ")}
          >
            Compare
          </Link>
          <Link
            href="/verses"
            className={[
              styles.navLink,
              active("/verses") ? styles.navLinkActive : "",
            ].join(" ")}
          >
            All verses
          </Link>
        </nav>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Topics sidebar">
          <div className={styles.sidebarTitle}>Topics</div>
          <div className={styles.topicList}>
            {topics.map((t) => (
              <button
                key={t.id}
                type="button"
                className={[
                  styles.topicButton,
                  t.id === selectedTopicId ? styles.topicButtonActive : "",
                ].join(" ")}
                onClick={() => onSelectTopic(t.id)}
              >
                <div className={styles.topicButtonTop}>
                  <div className={styles.topicButtonName}>{t.title}</div>
                  <div className={styles.topicButtonCount}>{t.verses.length} verse</div>
                </div>
                {t.subtitle ? <div className={styles.topicButtonSub}>{t.subtitle}</div> : null}
              </button>
            ))}
          </div>
        </aside>

        <main className={styles.content}>{children}</main>
      </div>

      <a
        className={styles.floatingGithub}
        href={KJV_WORDS_REPO_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Open GitHub repository"
      >
        <span className={styles.floatingGithubIcon} aria-hidden="true">
          ↗
        </span>
        <span className={styles.floatingGithubText}>GitHub</span>
      </a>
    </div>
  );
}

