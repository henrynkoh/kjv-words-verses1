# KJV Words - Verses

<table>
  <tr>
    <td width="320" valign="top">
      <h3>On this page</h3>
      <ul>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#what-you-can-do">What you can do</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#verse-integrity">Verse integrity</a></li>
        <li><a href="#docs">Docs</a></li>
        <li><a href="#ads">Ad copy</a></li>
        <li><a href="#get-started">Get started</a></li>
      </ul>
    </td>
    <td valign="top">
      <a name="overview"></a>
      <h2>Overview</h2>
      <p>
        A Next.js rebuild of <code>kjv-words-milk4512</code> that presents KJV Bible verses organized by topic/category,
        paired with Korean translations (<code>흠정역 한글성경전서</code>), with strong deduplication and validation to avoid
        redundancy or omissions.
      </p>

      <a name="what-you-can-do"></a>
      <h2>What you can do</h2>
      <ul>
        <li>Explore topics/categories and browse verse lists</li>
        <li>Open a verse-by-topic page (<code>/topics/[topicId]</code>)</li>
        <li>Search and navigate verses</li>
        <li>“Generate verse” (planned)</li>
        <li>Compare themes (example: law vs Paul’s gospel) via <code>/compare</code> (planned)</li>
      </ul>

      <a name="features"></a>
      <h2>Features</h2>
      <ul>
        <li>Topic-based browsing with fast navigation</li>
        <li>KJV + 흠정역 pairing at verse detail</li>
        <li>Importer + validators to prevent missing pairs and duplicates</li>
        <li>Modern landing experience is implemented on the web route (<code>/</code>)</li>
      </ul>

      <a name="how-it-works"></a>
      <h2>How it works</h2>
      <ol>
        <li>Import categorized transcripts into structured records</li>
        <li>Normalize KJV references for reliable deduplication</li>
        <li>Validate integrity (uniqueness + topic mapping + missing pair detection)</li>
        <li>Render topic pages and verse detail views for browsing</li>
      </ol>

      <a name="verse-integrity"></a>
      <h2>Verse integrity</h2>
      <ul>
        <li><b>Unique per KJV reference:</b> each canonical reference appears once globally</li>
        <li><b>Correct topic mapping:</b> topic pages include the exact set derived from input sections</li>
        <li><b>Missing pair detection:</b> flags if KJV exists without 흠정역 (or vice-versa)</li>
      </ul>

      <a name="docs"></a>
      <h2>Docs</h2>
      <ul>
        <li><code>docs/quickstarter.md</code></li>
        <li><code>docs/tutorial.md</code></li>
        <li><code>docs/manual.md</code></li>
        <li><code>docs/ads.md</code> (platform ad copy pack)</li>
      </ul>

      <a name="ads"></a>
      <h2>Ad copy</h2>
      <p>
        Platform-specific drafts are ready in <code>docs/ads.md</code> for:
        Facebook, Instagram, Threads, Blogger, Naver Blog, Tistory, WordPress, Newsletter, and Email.
      </p>

      <a name="get-started"></a>
      <h2>Get started</h2>
      <p>
        The web landing page with the sticky left navigation + modern visuals is implemented in
        <code>src/app/page.tsx</code>. To run the project locally:
      </p>

      <pre><code>npm install</code></pre>
      <pre><code>npm run dev</code></pre>
      <p>Then open <code>http://localhost:3000</code>.</p>
    </td>
  </tr>
</table>

## Project status

This repository currently contains the Next.js scaffold plus the new landing page UI. Next, the UI pages and the verse/topic importer pipeline will be added incrementally following the plan in <code>tasks/todo.md</code>.

