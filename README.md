# waterprint

AI water consumption tracker for [Claude Code](https://claude.ai/code). Turns tokens into liters — and puts that number in perspective.

```
💧 25.0 mL 🥄 5.00 teaspoons  •  Total: 25.0 mL 🥄 5.00 teaspoons
💧 300.0 mL 🥛 1.20 glasses of water  •  Total: 1.2 L 🍷 1.60 wine bottles
```

Shows **session** water (current conversation) and **lifetime total** (accumulated across all sessions).

Water rates are model-aware, based on [Li et al. 2023 — "Making AI Less Thirsty"](https://arxiv.org/abs/2304.03271).

---

## Install

```bash
npm install -g @syntaxerror-sys/water-print
```

---

## Claude Code setup

### Option 1 — Use waterprint as your status line

```json
{
  "statusLine": {
    "type": "command",
    "command": "waterprint"
  }
}
```

### Option 2 — Combine with your existing status line

If you already use a status line tool (e.g. ccstatusline), create a personal wrapper:

```bash
#!/bin/bash
INPUT=$(cat)
echo "$INPUT" | your-existing-statusline
echo "$INPUT" | waterprint
```

Save it anywhere (e.g. `~/.claude/statusline.sh`), make it executable, and point `settings.json` to it.

### Option 3 — Just try it without touching your config

```bash
waterprint --preview 50000
```

---

## CLI

```bash
# Preview any token count
waterprint --preview 50000
# 💧 25.0 mL 🥄 5.00 teaspoons  •  Total: 25.0 mL 🥄 5.00 teaspoons

# With a specific model
waterprint --preview 600000 --model claude-opus-4-8
# 💧 480.0 mL 🥛 1.92 glasses of water  •  Total: 480.0 mL 🥛 1.92 glasses of water

waterprint --version
waterprint --help
```

---

## Supported models

| Model | mL / 1k tokens |
|---|---|
| claude-haiku-4-5 | 0.30 |
| claude-sonnet-4-6 | 0.50 |
| claude-opus-4-8 | 0.80 |
| claude-3-5-haiku | 0.28 |
| claude-3-5-sonnet | 0.48 |
| claude-3-opus | 0.75 |

Unknown models fall back to `0.50 mL / 1k tokens`.

---

## Comparisons

drops · teaspoons · shot glasses · glasses · water bottles · wine bottles · gallons · bathtubs · jacuzzis · Olympic pools · small lakes · oceans

---

## Data

Session and lifetime stats are stored locally in `~/.waterprint/stats.json`. Nothing is sent anywhere.

---

## License

MIT
