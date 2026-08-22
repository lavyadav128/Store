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

function getRequestedClass(query = "") {
  const normalized = query.toLowerCase();

  const match = normalized.match(
    /\bclass\s*(9|10|11|12)\b|\b(9th|10th|11th|12th|ninth|tenth|eleventh|twelfth)\b/i
  );

  if (!match) return null;

  const value = (match[1] || match[2] || "").toLowerCase();

  const classMap = {
    "9": "9",
    "9th": "9",
    ninth: "9",

    "10": "10",
    "10th": "10",
    tenth: "10",

    "11": "11",
    "11th": "11",
    eleventh: "11",

    "12": "12",
    "12th": "12",
    twelfth: "12",
  };

  return classMap[value] || null;
}

function belongsToRequestedClass(product, requestedClass) {
  if (!requestedClass) return true;

  const searchableText = [
    product.title,
    product.description,
    product.category,
    product.targetAudience,
    ...(product.whatYouLearn || []),
    ...(product.includedFeatures || []),
  ]
    .join(" ")
    .toLowerCase();

  return new RegExp(`\\bclass\\s*${requestedClass}\\b`).test(searchableText);
}

function scoreProduct(product, query) {
  const queryWords = words(query);

  const haystack = {
    title: words(product.title),
    category: words(product.category),
    description: words(`
      ${product.description}
      ${(product.whatYouLearn || []).join(" ")}
      ${(product.includedFeatures || []).join(" ")}
      ${(product.examFocus || []).join(" ")}
      ${product.targetAudience || ""}
    `),
  };

  let score = 0;
  const reasons = [];
  const normalizedQuery = query.toLowerCase();

const isJeeGoal =
  /\bjee\b|\biit\b|jee main|jee mains|jee advanced/.test(normalizedQuery);

const isHandwrittenNotesProduct =
  product.type === "note-batch" &&
  /handwritten|notes/.test(
    `${product.title} ${product.description}`.toLowerCase()
  );

  const expandedTerms = new Set(
    queryWords.flatMap((word) => [word, ...(ALIASES[word] || [])])
  );

  for (const term of expandedTerms) {
    if (haystack.title.includes(term)) score += 35;
    if (haystack.category.includes(term)) score += 20;
    if (haystack.description.includes(term)) score += 8;
  }

  if (score > 0) {
    reasons.push("Its title, category, curriculum, or listed features match your goal.");
  }

  // Cross-sell handwritten notes only for students interested in IIT JEE/JEE Main.
  if (isJeeGoal && isHandwrittenNotesProduct) {
    score += 45;

    reasons.push(
      "These handwritten notes support JEE preparation for Class 11 and Class 12, so they are useful alongside a JEE batch."
    );
  }

  if (product.price === 0) {
    score += 2;
    reasons.push("It is currently free to enrol in.");
  }

  return { score, reasons };
}

export async function getRecommendations({
  userId = null,
  query = "",
  limit = 3,
}) {
  const catalog = await getCommerceContext(userId);

  const safeLimit = Math.min(Math.max(Number(limit) || 3, 1), 3);
  const requestedClass = getRequestedClass(query);

  // If user specifically asks for Class 9/10/11/12,
  // do not recommend batches from another class.
  const classMatchedProducts = catalog.availableProducts.filter((product) =>
    belongsToRequestedClass(product, requestedClass)
  );

  // Example: "Do you have Class 9?" and no Class 9 batch exists.
  if (requestedClass && classMatchedProducts.length === 0) {
    return {
      recommendations: [],
      requestedClass,
      noMatchMessage: `There are currently no active batches available for Class ${requestedClass}. I will not recommend a batch from another class.`,
    };
  }

  return {
    recommendations: classMatchedProducts
      .map((product) => {
        const { score, reasons } = scoreProduct(product, query);

        return {
          product,
          score,
          type: score > 0 ? "goal_match" : "catalog_pick",
          reasons:
            reasons.length > 0
              ? reasons
              : ["This is an active batch available for your requested class."],
        };
      })
      .sort(
        (left, right) =>
          right.score - left.score ||
          left.product.price - right.product.price
      )
      .slice(0, safeLimit),

    requestedClass,
    noMatchMessage: "",
  };
}