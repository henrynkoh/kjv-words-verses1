import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const workspaceRoot = process.cwd();

const transcriptsRoot =
  "/Users/henryoh/.cursor/projects/Users-henryoh-Documents-kjv-words-verses/agent-transcripts";

// Find the newest transcript .txt in that folder.
function findNewestTranscriptTxt(dir) {
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir);
  const txts = entries
    .filter((n) => n.endsWith(".txt"))
    .map((n) => {
      const full = path.join(dir, n);
      const stat = fs.statSync(full);
      return { name: n, full, mtimeMs: stat.mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
  return txts[0]?.full ?? null;
}

const transcriptTxtPath = findNewestTranscriptTxt(transcriptsRoot);
if (!transcriptTxtPath) {
  console.error(
    `[build-from-cursor] Could not find any transcript .txt in ${transcriptsRoot}. ` +
      `Please ensure your Cursor transcript exists there.`
  );
  process.exit(1);
}

const inputPath = path.join(workspaceRoot, "data", "transcripts", "kjv-korean-sections.txt");
const transcriptText = fs.readFileSync(transcriptTxtPath, "utf8");

// Extract only from the first "Section N:" line onward.
const firstSectionMatch = transcriptText.search(/^Section\s+\d+\s*:/m);
const extracted = firstSectionMatch === -1 ? "" : transcriptText.slice(firstSectionMatch);

fs.mkdirSync(path.dirname(inputPath), { recursive: true });
fs.writeFileSync(inputPath, extracted, "utf8");

console.log(`[build-from-cursor] Extracted Section blocks -> ${inputPath}`);
console.log(`[build-from-cursor] Source transcript: ${transcriptTxtPath}`);

// Run the existing generator.
const result = spawnSync("node", ["scripts/build-verse-data.mjs"], {
  cwd: workspaceRoot,
  stdio: "inherit",
});

if (result.error) {
  console.error(`[build-from-cursor] Failed:`, result.error);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`[build-from-cursor] Generator exited with status ${result.status}`);
  process.exit(result.status ?? 1);
}

