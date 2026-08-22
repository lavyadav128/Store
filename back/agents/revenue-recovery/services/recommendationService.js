import { getCommerceContext } from "./commerceContext.js";

const ALIASES = {
  placement: ["dsa", "web", "data", "aptitude", "interview"],
  coding: ["dsa", "web", "data"],
  developer: ["dsa", "web", "data"],
  engineering: ["computer", "civil", "electrical", "electronics"],
  jee: ["iit", "jee", "class 11", "class 12"],
  neet: ["neet", "biology", "class 11", "class 12"],
};

function words(value = "") {
  return value.toLowerCase().match(/[a-z0-9]+/g) || [];
}

function scoreProduct(product, query) {
  const queryWords = words(query);
  const haystack = {
    title: words(product.title),
    category: words(product.category),
    description: words(`${product.description} ${(product.whatYouLearn || []).join(" ")} ${(product.includedFeatures || []).join(" ")} ${(product.examFocus || []).join(" ")} ${product.targetAudience || ""}`),
  };
  let score = 0;
  const reasons = [];
  const expandedTerms = new Set(queryWords.flatMap((word) => [word, ...(ALIASES[word] || [])]));

  for (const term of expandedTerms) {
    if (haystack.title.includes(term)) score += 35;
    if (haystack.category.includes(term)) score += 20;
    if (haystack.description.includes(term)) score += 8;
  }
  if (score > 0) reasons.push("Its title, category, or curriculum matches your stated goal.");
  if (product.price === 0) {
    score += 2;
    reasons.push("It is currently free to enrol in.");
  }
  return { score, reasons };
}

// This deterministic path avoids consuming Study Copilot LLM quota and returns
// only live catalog products with an explanation for each recommendation.
export async function getRecommendations({ userId = null, query = "", limit = 3 }) {
  const catalog = await getCommerceContext(userId);
  const safeLimit = Math.min(Math.max(Number(limit) || 3, 1), 3);

  return catalog.availableProducts
    .map((product) => {
      const { score, reasons } = scoreProduct(product, query);
      return {
        product,
        score,
        type: score > 0 ? "goal_match" : "catalog_pick",
        reasons: reasons.length ? reasons : ["This is an active course currently available in the catalog."],
      };
    })
    .sort((left, right) => right.score - left.score || left.product.price - right.product.price)
    .slice(0, safeLimit);
}
