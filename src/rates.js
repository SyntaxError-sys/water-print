export const MODEL_RATES = {
  "claude-haiku-4-5":   0.30,
  "claude-sonnet-4-6":  0.50,
  "claude-opus-4-8":    0.80,
  "claude-3-5-haiku":   0.28,
  "claude-3-5-sonnet":  0.48,
  "claude-3-opus":      0.75,
};

export const DEFAULT_RATE = 0.50;

export function getRate(modelId) {
  if (!modelId || typeof modelId !== "string") return DEFAULT_RATE;
  const key = Object.keys(MODEL_RATES).find(k => modelId.startsWith(k));
  return key ? MODEL_RATES[key] : DEFAULT_RATE;
}
