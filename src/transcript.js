export async function getTokensFromTranscript(transcriptPath) {
  try {
    const { readFile } = await import("fs/promises");
    const content = await readFile(transcriptPath, "utf8");
    const lines = content.split("\n").filter((l) => l.trim());

    const finalized = new Map();
    let latestUnfinished = null;

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        const usage = entry?.message?.usage;
        if (!usage) continue;
        const stopReason = entry?.message?.stop_reason;
        const key = `${usage.input_tokens}:${usage.output_tokens}`;
        if (stopReason !== null && stopReason !== undefined) {
          finalized.set(key, usage);
        } else {
          latestUnfinished = usage;
        }
      } catch {}
    }

    const allUsages = [...finalized.values()];
    if (latestUnfinished) allUsages.push(latestUnfinished);

    let total = 0;
    for (const usage of allUsages) {
      total += (usage.input_tokens || 0)
             + (usage.output_tokens || 0)
             + (usage.cache_read_input_tokens || 0)
             + (usage.cache_creation_input_tokens || 0);
    }
    return total;
  } catch {
    return 0;
  }
}
