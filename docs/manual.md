# Manual (reference)

## App overview

`kjv-words-verses` presents:

- KJV Bible verses
- Paired Korean translations from `흠정역 한글성경전서`
- Organization into topics/categories (for audience/situation/level)

## Core concepts and data model (planned)

- `Verse`
  - `kjvText`: the KJV verse text
  - `kjvRef`: a canonical KJV reference key (e.g., `Romans 1:16`)
  - `koreanText`: the paired Korean verse text
  - `source`: where it came from (transcript section identifier, optional)
- `Topic`
  - `id`: stable topic id used in routes (`/topics/[topicId]`)
  - `title`: human readable topic/category name
  - `description`: optional supporting text
  - `audienceTags`: optional tags for “audiences/situations/level”
- `topic -> verses`
  - a mapping that lists which verses belong to each topic

## Importing transcripts (planned)

1. Collect transcript text files (or structured inputs) that contain categorized KJV verses plus Korean translations.
2. Parse each categorized section into `(topic, kjvRef, kjvText, koreanText)`.
3. Normalize references (canonical formatting for deduplication).
4. Build the dataset used by the UI.

## Deduplication + validators (planned)

### 1) Unique verse per KJV reference

- If multiple transcripts contain the same KJV reference, only one entry should be kept.
- If two Korean pairings conflict for the same reference, the validator will flag it.

### 2) Each topic contains the correct verses

- Topic membership is derived from the categorized sections in the input transcripts.
- The validator cross-checks that the final mapping includes all intended verse keys per topic.

### 3) Detect missing KJV/Korean pairs

- If `kjvRef` exists with KJV text but Korean text is missing (or vice-versa), the importer/validator flags the record.

## Routes (planned)

- `/` : topic explorer
- `/topics/[topicId]` : verses for a topic
- `/verses` : all verses grouped by topic
- `/compare` : theme comparison UI (e.g., law vs Paul’s gospel)

