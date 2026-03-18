# Tutorial (how to use the app)

This tutorial describes the intended user flow for the `kjv-words-verses` experience (matching the `kjv-words-milk4512` style and feature set).

## 0. What the app is for

You browse KJV Bible verses organized under topics/categories, where each verse is paired with its Korean translation (흠정역 한글성경전서). The app is designed to help different audiences (and different levels) find “words of truth” relevant to their situation.

## 1. Explore topics on the home page

- Open the homepage to see topic/category cards (with topic “pills”)
- Select a topic to browse its verse list

Planned behavior:

- The homepage may include a “Generate verse” experience based on the selected topic (or a random/topic-based selection).

## 2. Browse verses within a topic

- On `/topics/[topicId]`, view the topic’s verse list
- Open a verse detail view to read:
  - the KJV verse text
  - the Korean translation
  - a consistent reference format for reliable navigation

## 3. Search and navigation

- Use search to quickly find verses by reference keywords
- Navigate between topic pages and verse details without losing context

## 4. Compare themes (law vs Paul’s gospel)

- Use `/compare` (planned) to view a side-by-side theme comparison
- Click through to the relevant verses by section/theme

## 5. Data integrity checks (planned)

- The system will deduplicate verses globally so that the UI shows each KJV reference once
- The validator will detect missing KJV/Korean pairs to prevent incomplete verse displays

