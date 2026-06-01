# waterprint

AI water consumption tracker for [Claude Code](https://claude.ai/code). Turns tokens into liters — and puts that number in perspective.

```
💧 28.5 mL — 🥄 5.70 teaspoons
💧 300.0 mL — 🥛 1.20 glasses of water
💧 480.0 mL — 🍶 0.96 water bottles (500mL)
```

Water rates are model-aware, based on [Li et al. 2023 — "Making AI Less Thirsty"](https://arxiv.org/abs/2304.03271).

---

## Claude Code setup

Add to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx waterprint"
  }
}
```

Or install globally for faster startup:

```bash
npm install -g @syntaxerror-sys/water-print
```

Then use `"command": "waterprint"`.

---

## CLI

```bash
# Preview any token count
waterprint --preview 50000
# 💧 25.0 mL — 🥄 5.00 teaspoons

# With a specific model
waterprint --preview 600000 --model claude-opus-4-8
# 💧 480.0 mL — 🥛 1.92 glasses of water

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

## License

MIT
