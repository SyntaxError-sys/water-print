const COMPARISONS = [
  { ml: 0.05,                emoji: "💧", label: "water drops" },
  { ml: 5,                   emoji: "🥄", label: "teaspoons" },
  { ml: 44,                  emoji: "🥃", label: "shot glasses" },
  { ml: 250,                 emoji: "🥛", label: "glasses of water" },
  { ml: 500,                 emoji: "🍶", label: "water bottles (500mL)" },
  { ml: 750,                 emoji: "🍷", label: "wine bottles" },
  { ml: 3_785,               emoji: "🪣", label: "gallons" },
  { ml: 300_000,             emoji: "🛁", label: "bathtubs" },
  { ml: 1_500_000,           emoji: "♨️",  label: "jacuzzis" },
  { ml: 2_500_000_000,       emoji: "🏊", label: "Olympic pools" },
  { ml: 1_000_000_000_000,   emoji: "🏞️", label: "small lakes" },
  { ml: 1.335e21,            emoji: "🌊", label: "oceans" },
];

export function formatWater(ml) {
  if (ml < 1)      return `${ml.toFixed(3)} mL`;
  if (ml < 10)     return `${ml.toFixed(2)} mL`;
  if (ml < 1000)   return `${ml.toFixed(1)} mL`;
  const liters = ml / 1000;
  if (liters < 10)   return `${liters.toFixed(3)} L`;
  if (liters < 1000) return `${liters.toFixed(2)} L`;
  const kl = liters / 1000;
  if (kl < 1000) return `${kl.toFixed(2)} kL`;
  return `${(kl / 1000).toFixed(2)} ML`;
}

function formatCount(n) {
  if (n < 10)  return n.toFixed(2);
  if (n < 100) return n.toFixed(1);
  return Math.round(n).toLocaleString("en-US");
}

export function getComparison(ml) {
  for (let i = COMPARISONS.length - 1; i >= 0; i--) {
    const ratio = ml / COMPARISONS[i].ml;
    if (ratio >= 1) return `${COMPARISONS[i].emoji} ${formatCount(ratio)} ${COMPARISONS[i].label}`;
  }
  for (let i = COMPARISONS.length - 1; i >= 0; i--) {
    const ratio = ml / COMPARISONS[i].ml;
    if (ratio >= 0.01) return `${COMPARISONS[i].emoji} ${ratio.toFixed(3)} ${COMPARISONS[i].label}`;
  }
  return `${COMPARISONS[0].emoji} ${(ml / COMPARISONS[0].ml).toFixed(3)} ${COMPARISONS[0].label}`;
}
