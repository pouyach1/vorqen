import { projectTypes, featureOptions, timelineOptions } from "../data/configurator";

/**
 * Computes an estimated price range and delivery days from the
 * configurator's current selections.
 */
export function calculateEstimate({ projectType, features, timeline }) {
  const type = projectTypes.find((t) => t.id === projectType);
  if (!type) return null;

  const selectedFeatures = featureOptions.filter((f) => features.includes(f.id));
  const featuresPrice = selectedFeatures.reduce((sum, f) => sum + f.price, 0);
  const featuresDays = selectedFeatures.reduce((sum, f) => sum + f.days, 0);

  const timelineConfig = timelineOptions.find((t) => t.id === timeline) ?? timelineOptions[0];

  const basePrice = type.basePrice + featuresPrice;
  const totalPrice = Math.round(basePrice * timelineConfig.multiplier);
  const totalDays = Math.max(3, Math.round((type.baseDays + featuresDays) / timelineConfig.multiplier));

  return {
    priceLow: Math.round(totalPrice * 0.9),
    priceHigh: Math.round(totalPrice * 1.15),
    days: totalDays,
    typeLabel: type.label,
    featureLabels: selectedFeatures.map((f) => f.label),
    timelineLabel: timelineConfig.label,
  };
}

export function buildTelegramProposalUrl({ estimate, telegramHandle = "your_username" }) {
  if (!estimate) return `https://t.me/${telegramHandle}`;
  const text = [
    `Hi! I'd like a proposal for a ${estimate.typeLabel}.`,
    estimate.featureLabels.length ? `Features: ${estimate.featureLabels.join(", ")}.` : null,
    `Timeline: ${estimate.timelineLabel}.`,
    `Estimated budget: $${estimate.priceLow}–$${estimate.priceHigh}.`,
  ]
    .filter(Boolean)
    .join(" ");
  return `https://t.me/${telegramHandle}?text=${encodeURIComponent(text)}`;
}
