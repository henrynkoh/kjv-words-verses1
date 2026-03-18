"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./page.module.css";

type NavItem = { id: string; label: string };

// Used by the floating bottom-right button.
const GITHUB_REPO_URL = "https://github.com/henryroh/kjv-words-verses1";
const GITHUB_BLOB_BASE = `${GITHUB_REPO_URL}/blob/main`;

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "integrity", label: "Verse integrity" },
  { id: "docs", label: "Docs" },
  { id: "ads", label: "Ad copy" },
  { id: "faq", label: "FAQ" },
  { id: "get-started", label: "Get started" },
];

type DemoVerse = {
  ref: string;
  kjvPreview: string;
  koreanNote: string;
};

const DEMO_VERSES: DemoVerse[] = [
  {
    ref: "John 1:14",
    kjvPreview:
      "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
    koreanNote: "흠정역 한글 번역(데이터가 연결되면 표시됩니다).",
  },
  {
    ref: "Romans 8:1",
    kjvPreview:
      "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
    koreanNote: "흠정역 한글 번역(데이터가 연결되면 표시됩니다).",
  },
  {
    ref: "2 Timothy 3:16",
    kjvPreview:
      "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:",
    koreanNote: "흠정역 한글 번역(데이터가 연결되면 표시됩니다).",
  },
  {
    ref: "Psalm 119:105",
    kjvPreview:
      "Thy word is a lamp unto my feet, and a light unto my path.",
    koreanNote: "흠정역 한글 번역(데이터가 연결되면 표시됩니다).",
  },
];

const ACCENTS = [
  { id: "teal", label: "Teal", css: "#2dd4bf" },
  { id: "violet", label: "Violet", css: "#a78bfa" },
  { id: "amber", label: "Amber", css: "#fbbf24" },
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activeId, setActiveId] = useState<string>("overview");
  const [accentId, setAccentId] = useState<(typeof ACCENTS)[number]["id"]>("teal");
  const [featureQuery, setFeatureQuery] = useState("");
  const [selectedDemo, setSelectedDemo] = useState<DemoVerse>(() => DEMO_VERSES[0]);
  const [copied, setCopied] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const accentCss = useMemo(() => {
    return ACCENTS.find((a) => a.id === accentId)?.css ?? ACCENTS[0].css;
  }, [accentId]);

  const pageStyle = useMemo(() => {
    // Allow setting CSS variables via `style` without using `any`.
    return ({ "--accent": accentCss } as CSSProperties & Record<string, string>);
  }, [accentCss]);

  const sectionsRef = useRef<HTMLElement[]>([]);

  const features = useMemo(() => {
    const all = [
      {
        title: "Topic-based browsing",
        desc: "Jump into KJV verses by topic/category, then move verse-by-verse with reference consistency.",
      },
      {
        title: "KJV + Korean pairings",
        desc: "Each verse view is designed to pair KJV text with 흠정역 한글 번역 for context.",
      },
      {
        title: "No missing or duplicated verses",
        desc: "Importer + validators are built to prevent redundancy and omissions before rendering.",
      },
      {
        title: "Fast navigation",
        desc: "Section anchors and quick jumps make browsing smooth (no “where am I?” feeling).",
      },
      {
        title: "Theme comparison (planned)",
        desc: "A dedicated comparison page (example: law vs Paul’s gospel) to support study flows.",
      },
      {
        title: "Generate verse (planned)",
        desc: "A topic-aware “generate verse” experience that selects passages aligned to the selected topic.",
      },
    ];

    const q = featureQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter((f) => (f.title + " " + f.desc).toLowerCase().includes(q));
  }, [featureQuery]);

  useEffect(() => {
    const nodes: HTMLElement[] = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    sectionsRef.current = nodes;

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the intersecting entry closest to the top viewport edge.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? Number.POSITIVE_INFINITY) -
              (b.boundingClientRect.top ?? Number.POSITIVE_INFINITY),
          )[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-10% 0px -70% 0px",
      },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  async function onCopyAnchor() {
    const url = `${window.location.origin}${window.location.pathname}#${activeId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard might be blocked; ignore.
    }
  }

  async function onGenerateDemo() {
    setDemoLoading(true);
    await new Promise((r) => window.setTimeout(r, 450));
    const next = DEMO_VERSES[Math.floor(Math.random() * DEMO_VERSES.length)];
    setSelectedDemo(next);
    setDemoLoading(false);
  }

  return (
    <div className={styles.page} style={pageStyle}>
      <div className={styles.shell}>
        <aside className={styles.leftNav} aria-label="Section navigation">
          <div className={styles.brand}>
            <div className={styles.logoMark} aria-hidden="true" />
            <div>
              <div className={styles.brandName}>KJV Words</div>
              <div className={styles.brandSub}>Verses + 흠정역</div>
            </div>
          </div>

          <div className={styles.navBlock}>
            <div className={styles.navTitle}>Navigate</div>
            <nav className={styles.navList}>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    styles.navItem,
                    activeId === item.id ? styles.navItemActive : "",
                  ].join(" ")}
                  onClick={() => scrollToSection(item.id)}
                  aria-current={activeId === item.id ? "page" : undefined}
                >
                  <span className={styles.navDot} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className={styles.smallTools}>
            <button
              type="button"
              className={styles.smallButton}
              onClick={onCopyAnchor}
              title="Copy link to current section"
            >
              {copied ? "Copied" : "Copy link"}
            </button>

            <div className={styles.accentPicker} aria-label="Accent color picker">
              <div className={styles.accentLabel}>Accent</div>
              <div className={styles.accentRow}>
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={[
                      styles.accentSwatch,
                      accentId === a.id ? styles.accentSwatchActive : "",
                    ].join(" ")}
                    onClick={() => setAccentId(a.id)}
                    aria-label={`${a.label} accent`}
                  >
                    <span style={{ background: a.css }} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.content} role="main">
          <section id="overview" className={styles.section}>
            <div className={styles.hero}>
              <div className={styles.heroLeft}>
                <div className={styles.pills}>
                  <span className={styles.pill}>Topic-based</span>
                  <span className={styles.pill}>No redundancy</span>
                  <span className={styles.pill}>KJV + 흠정역</span>
                </div>
                <h1 className={styles.heroTitle}>
                  Browse KJV verses by topic,
                  <span className={styles.heroTitleAccent}> paired with Korean</span>.
                </h1>
                <p className={styles.heroDesc}>
                  A modern study interface designed to help different audiences and situations find
                  “words of truth”, without omissions or duplicated references.
                </p>

                <div className={styles.heroActions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => scrollToSection("features")}
                  >
                    See features
                  </button>
                  <a className={styles.secondaryButton} href="#get-started">
                    Quickstarter
                  </a>
                </div>
              </div>

              <div className={styles.heroRight} aria-label="Demo generator">
                <div className={styles.cardGlow}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderTitle}>Demo verse</div>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={onGenerateDemo}
                      disabled={demoLoading}
                    >
                      {demoLoading ? "Generating…" : "Generate"}
                    </button>
                  </div>

                  <div className={styles.demoRef}>{selectedDemo.ref}</div>
                  <div className={styles.demoKjv}>
                    <div className={styles.demoLabel}>KJV</div>
                    <div className={styles.demoText}>{selectedDemo.kjvPreview}</div>
                  </div>
                  <div className={styles.demoKorean}>
                    <div className={styles.demoLabel}>흠정역</div>
                    <div className={styles.demoTextMuted}>{selectedDemo.koreanNote}</div>
                  </div>

                  <div className={styles.demoActions}>
                    <button type="button" className={styles.smallButton} onClick={() => scrollToSection("integrity")}>
                      How integrity works
                    </button>
                    <button
                      type="button"
                      className={styles.smallButton}
                      onClick={() => {
                        navigator.clipboard
                          ?.writeText(`${selectedDemo.ref} (KJV preview)`)
                          .catch(() => {});
                      }}
                      title="Copy verse reference"
                    >
                      Copy ref
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Features</h2>
                <p className={styles.sectionSubtitle}>
                  Filter the cards to match what you care about right now.
                </p>
              </div>
              <div className={styles.featureTools}>
                <input
                  className={styles.searchInput}
                  value={featureQuery}
                  onChange={(e) => setFeatureQuery(e.target.value)}
                  placeholder="Search features (e.g., 'integrity', 'topic')"
                  aria-label="Search features"
                />
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => setFeatureQuery("")}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className={styles.cardGrid}>
              {features.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <div className={styles.featureCardTitle}>{f.title}</div>
                  <div className={styles.featureCardDesc}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="how-it-works" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>How it works</h2>
                <p className={styles.sectionSubtitle}>
                  Built as an importer + validators + UI. Once your transcripts are connected, the app is ready for
                  browsing.
                </p>
              </div>
            </div>

            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepIndex}>1</div>
                <div className={styles.stepBody}>
                  <div className={styles.stepTitle}>Import transcripts</div>
                  <div className={styles.stepDesc}>
                    Parse categorized transcript sections into structured records of topic + KJV + Korean.
                  </div>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIndex}>2</div>
                <div className={styles.stepBody}>
                  <div className={styles.stepTitle}>Normalize references</div>
                  <div className={styles.stepDesc}>
                    Canonicalize KJV references so duplicates can be detected reliably.
                  </div>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIndex}>3</div>
                <div className={styles.stepBody}>
                  <div className={styles.stepTitle}>Validate integrity</div>
                  <div className={styles.stepDesc}>
                    Detect missing pairs and flag conflicting pairings before the UI ever renders.
                  </div>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIndex}>4</div>
                <div className={styles.stepBody}>
                  <div className={styles.stepTitle}>Browse with confidence</div>
                  <div className={styles.stepDesc}>
                    Topic pages, verse details, and comparison flows designed for fast navigation.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="integrity" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Verse integrity</h2>
                <p className={styles.sectionSubtitle}>
                  The “no redundancy or omissions” promise is enforced by validation logic.
                </p>
              </div>
            </div>

            <div className={styles.integrityGrid}>
              <div className={styles.integrityCard}>
                <div className={styles.integrityTitle}>Unique per KJV reference</div>
                <div className={styles.integrityDesc}>
                  Each canonical KJV reference should appear once globally.
                </div>
              </div>
              <div className={styles.integrityCard}>
                <div className={styles.integrityTitle}>Correct topic mapping</div>
                <div className={styles.integrityDesc}>
                  Topic pages include the exact set of verses derived from the input sections.
                </div>
              </div>
              <div className={styles.integrityCard}>
                <div className={styles.integrityTitle}>Missing pair detection</div>
                <div className={styles.integrityDesc}>
                  If KJV exists without 흠정역 (or vice-versa), the importer/validator flags it.
                </div>
              </div>
            </div>
          </section>

          <section id="docs" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Docs</h2>
                <p className={styles.sectionSubtitle}>
                  Quickstarter, tutorial, and manual are in this repo.
                </p>
              </div>
            </div>

            <div className={styles.cardGrid}>
              {[
                { title: "Quickstarter", desc: "Run the dev server and start exploring." },
                { title: "Tutorial", desc: "How to browse topics, read verse pairs, and navigate." },
                { title: "Manual", desc: "Reference approach for importer + validators + routes." },
              ].map((d) => (
                <div key={d.title} className={styles.featureCard}>
                  <div className={styles.featureCardTitle}>{d.title}</div>
                  <div className={styles.featureCardDesc}>{d.desc}</div>
                  <div className={styles.inlineLinks}>
                    <a
                      className={styles.linkButton}
                      href={`${GITHUB_BLOB_BASE}/docs/${d.title.toLowerCase()}.md`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open file
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="ads" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Ad copy pack</h2>
                <p className={styles.sectionSubtitle}>
                  Platform-specific drafts live in `docs/ads.md`.
                </p>
              </div>
            </div>

            <div className={styles.adBanner}>
              <div className={styles.adBannerTitle}>Ready to post</div>
              <div className={styles.adBannerDesc}>
                Copy the sections for: Facebook, Instagram, Threads, Blogger, Naver Blog, Tistory, WordPress, Newsletter,
                and Email.
              </div>
              <div className={styles.heroActions}>
                <a
                  className={styles.secondaryButton}
                  href={`${GITHUB_BLOB_BASE}/docs/ads.md`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View `docs/ads.md`
                </a>
                <button type="button" className={styles.primaryButton} onClick={() => scrollToSection("get-started")}>
                  Join the project
                </button>
              </div>
            </div>
          </section>

          <section id="faq" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>FAQ</h2>
                <p className={styles.sectionSubtitle}>Short answers while the app is being built.</p>
              </div>
            </div>

            <div className={styles.faq}>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Will the app show every verse without duplicates?
                </summary>
                <div className={styles.faqBody}>
                  The importer/validator pipeline keeps unique canonical KJV references globally and validates KJV+흠정역
                  pairing completeness before rendering.
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>Do I need to provide transcripts?</summary>
                <div className={styles.faqBody}>
                  Yes. Once your transcript text (or structured lists) is provided, the importer can build the topic
                  mapping and verse dataset.
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>What about features like `/compare`?</summary>
                <div className={styles.faqBody}>
                  The landing page describes the planned experience. The UI routes will be implemented as data and
                  validation are ready.
                </div>
              </details>
            </div>
          </section>

          <section id="get-started" className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Get started</h2>
                <p className={styles.sectionSubtitle}>Start locally, then connect your dataset.</p>
              </div>
            </div>

            <div className={styles.getStarted}>
              <div className={styles.getStartedCard}>
                <div className={styles.getStartedTitle}>Run locally</div>
                <div className={styles.getStartedDesc}>
                  Follow `docs/quickstarter.md`, then keep building the pages and importer pipeline.
                </div>
                <div className={styles.inlineLinks}>
                  <a
                    className={styles.linkButton}
                    href={`${GITHUB_BLOB_BASE}/docs/quickstarter.md`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open quickstarter
                  </a>
                  <a
                    className={styles.linkButton}
                    href={`${GITHUB_BLOB_BASE}/tasks/todo.md`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    See the plan
                  </a>
                </div>
              </div>

              <div className={styles.getStartedCardAlt}>
                <div className={styles.getStartedTitle}>Need the next step?</div>
                <div className={styles.getStartedDesc}>
                  Paste or upload your transcript verse/topic lists so the importer can generate a deduplicated dataset.
                </div>
                <div className={styles.inlineLinks}>
                  <button type="button" className={styles.linkButton} onClick={onCopyAnchor}>
                    Copy section link
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <a
        className={styles.floatingGithub}
        href={GITHUB_REPO_URL}
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
