#!/usr/bin/env node
import { getRate } from "./src/rates.js";
import { formatWater, getComparison } from "./src/format.js";
import { getTokensFromTranscript } from "./src/transcript.js";
import { updateAndGetStats } from "./src/stats.js";

const VERSION = "1.0.0";

const HELP = `waterprint — AI water consumption tracker for Claude Code

Usage:
  echo '<status-json>' | waterprint
  waterprint --preview <tokens> [--model <model-id>]

Options:
  --preview <n>   Show water for N tokens (no stdin needed)
  --model <id>    Model ID for accurate rate (default: claude-sonnet-4-6)
  --version       Print version
  --help          Show this help

Examples:
  waterprint --preview 50000
  waterprint --preview 600000 --model claude-opus-4-8

Claude Code setup (~/.claude/settings.json):
  "statusLine": {
    "type": "command",
    "command": "waterprint"
  }

Install: npm install -g water-print`;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").trim();
}

function renderSession(sessionMl) {
  return `💧 ${formatWater(sessionMl)} ${getComparison(sessionMl)}`;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--version")) {
    process.stdout.write(VERSION + "\n");
    return;
  }

  if (args.includes("--help")) {
    process.stdout.write(HELP + "\n");
    return;
  }

  const previewIdx = args.indexOf("--preview");
  if (previewIdx !== -1) {
    const tokens = parseInt(args[previewIdx + 1], 10);
    if (isNaN(tokens)) {
      process.stderr.write("waterprint: --preview requires a number\n");
      process.exit(1);
    }
    const modelIdx = args.indexOf("--model");
    const modelId = modelIdx !== -1 ? args[modelIdx + 1] : undefined;
    const ml = (tokens / 1000) * getRate(modelId);
    process.stdout.write(renderSession(ml) + "\n");
    return;
  }

  const raw = await readStdin();
  if (!raw) { process.stdout.write("💧 0.000 mL"); return; }

  let data;
  try { data = JSON.parse(raw); }
  catch { process.stdout.write("💧 ?"); return; }

  let sessionTokens = 0;
  const modelId = data?.model;
  const transcriptPath = data?.transcript_path ?? null;

  const cw = data?.context_window;
  if (cw) {
    const inp    = cw.total_input_tokens  ?? cw.current_usage?.input_tokens  ?? 0;
    const out    = cw.total_output_tokens ?? cw.current_usage?.output_tokens ?? 0;
    const cached = (cw.current_usage?.cache_read_input_tokens    ?? 0)
                 + (cw.current_usage?.cache_creation_input_tokens ?? 0);
    sessionTokens = inp + out + cached;
  }

  if (sessionTokens === 0 && transcriptPath) {
    sessionTokens = await getTokensFromTranscript(transcriptPath);
  }

  const rate = getRate(modelId);
  const sessionMl = (sessionTokens / 1000) * rate;

  const completedMl = await updateAndGetStats(transcriptPath, sessionTokens, modelId, getRate);
  const totalMl = completedMl + sessionMl;

  process.stdout.write(`${renderSession(sessionMl)}  •  Total: ${formatWater(totalMl)} ${getComparison(totalMl)}`);
}

main().catch(() => process.stdout.write("💧 error"));
