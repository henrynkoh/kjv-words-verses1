# KJV Words - Next.js rebuild

## Goals
1. Recreate the `kjv-words-milk4512` UI/UX structure (dark theme cards, topic pills, verse browsing).
2. Load a categorized KJV + Korean verse dataset (from your new transcripts).
3. Deduplicate verses globally and prevent redundancy/omissions in the UI.

## Todo
- [ ] Scaffold base UI: header, topic grid, verse list/detail, search.
- [ ] Implement data model: `Verse`, `Topic`, and mapping `topic -> verses`.
- [ ] Implement importer: parse transcript text into the dataset format.
- [ ] Implement deduper + validators:
  - [ ] unique verse per KJV reference
  - [ ] each topic contains the correct verses
  - [ ] detect missing KJV/Korean pairs
- [ ] Implement pages:
  - [ ] `/` topic explorer + “Generate verse”
  - [ ] `/topics/[topicId]` verse by topic
  - [ ] `/compare` law vs Paul's gospel (table + navigation)
  - [ ] `/verses` all verses grouped by topic
- [ ] Styling: match layout/colors from the reference site screenshots.
- [ ] QA: cross-check verse counts vs importer output; ensure no duplicates in rendered UI.
- [x] Documentation: update `README.md`, add `docs/manual.md`, `docs/tutorial.md`, `docs/quickstarter.md`
- [x] Ads pack: add `docs/ads.md` with copy for Facebook, Instagram, Threads, Blogger, Naver Blog, Tistory, WordPress, Newsletter, and Email
- [x] Landing page: interactive `/` with sticky left navigation + section scrolling + floating GitHub link
- [x] App UI routes: `/verse`, `/compare`, `/verses` with interactive cards + chip grid (placeholder data)

## Review
Docs added:
- `README.md` replaced with project-specific content
- `docs/manual.md`, `docs/tutorial.md`, `docs/quickstarter.md` created
- `docs/ads.md` created (platform-specific ad copy with `{{APP_URL}}` placeholder)

Pending: need you to provide the transcript text as files (or confirm that we should ingest only the Verse/Topic lists you pasted).

Review update:
- Landing page implemented on `/` (sticky section nav + smooth scrolling + floating GitHub button)

Push status:
- [x] Pushed `main` to `kjv-words-verses1` via SSH

Local update (not pushed yet):
- Home now redirects to `/verse` (app-first UI instead of landing page)

