import { readFile, writeFile, mkdir } from "fs/promises";
import { homedir } from "os";
import { join } from "path";

const STATS_DIR = join(homedir(), ".waterprint");
const STATS_FILE = join(STATS_DIR, "stats.json");

const EMPTY = {
  completedWaterMl: 0,
  lastTranscriptPath: null,
  lastSessionTokens: 0,
  lastSessionModel: null,
};

async function load() {
  try {
    return { ...EMPTY, ...JSON.parse(await readFile(STATS_FILE, "utf8")) };
  } catch {
    return { ...EMPTY };
  }
}

async function save(stats) {
  try {
    await mkdir(STATS_DIR, { recursive: true });
    await writeFile(STATS_FILE, JSON.stringify(stats));
  } catch {}
}

export async function updateAndGetStats(transcriptPath, sessionTokens, modelId, getRate) {
  const stats = await load();

  const sessionChanged =
    transcriptPath &&
    stats.lastTranscriptPath &&
    transcriptPath !== stats.lastTranscriptPath;

  if (sessionChanged) {
    const prevRate = getRate(stats.lastSessionModel);
    stats.completedWaterMl += (stats.lastSessionTokens / 1000) * prevRate;
  }

  stats.lastTranscriptPath = transcriptPath ?? stats.lastTranscriptPath;
  stats.lastSessionTokens = sessionTokens;
  stats.lastSessionModel = modelId ?? null;

  await save(stats);

  return stats.completedWaterMl;
}
