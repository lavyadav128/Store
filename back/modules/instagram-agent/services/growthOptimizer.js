// growthOptimizer.js
// ─────────────────────────────────────────────────────────────
// Autonomous Audience Feedback & Growth Optimization Engine
// Learns what content the audience likes most (views, likes, saves)
// across Life, Career, Strength, Health & Discipline pillars,
// and dynamically biases future content generation toward top performers.
// ─────────────────────────────────────────────────────────────

import InstagramContent from "../schema/InstagramContent.model.js";
import InstagramAgentConfig from "../schema/InstagramAgentConfig.model.js";

/**
 * Calculates the audience performance score for a piece of content.
 * Formula: Likes (1x) + Comments (2.5x) + Saves (3x) / Reach (or Views)
 */
export function computeEngagementScore(metrics = {}) {
  const likes = Number(metrics.likes || metrics.like_count || 0);
  const comments = Number(metrics.comments || metrics.comments_count || 0);
  const saves = Number(metrics.saved || metrics.saves || 0);
  const reach = Math.max(1, Number(metrics.reach || metrics.impressions || 100));

  const rawScore = (likes * 1) + (comments * 2.5) + (saves * 3);
  return {
    rawScore,
    engagementRate: Number(((rawScore / reach) * 100).toFixed(2)),
  };
}

/**
 * Analyzes all published posts across categories to identify top-performing themes.
 */
export async function analyzeAudiencePreferences() {
  const publishedPosts = await InstagramContent.find({
    status: "published",
    publishedAt: { $ne: null },
  }).sort({ publishedAt: -1 }).limit(100);

  const defaultCategories = [
    "Career & Success",
    "Strength & Resilience",
    "Health & Vitality",
    "Life & How to Live",
    "Discipline & Habits",
  ];

  if (!publishedPosts.length) {
    return {
      topCategory: "Career & Success",
      categoryBreakdown: defaultCategories.reduce((acc, cat) => {
        acc[cat] = { count: 0, avgScore: 0, totalLikes: 0, totalComments: 0 };
        return acc;
      }, {}),
      recommendation: "Focus on Career Ambition, Mental Strength & Daily Habits to jumpstart audience growth and viral reach.",
    };
  }

  const categoryStats = {};
  for (const cat of defaultCategories) {
    categoryStats[cat] = { count: 0, totalScore: 0, totalLikes: 0, totalComments: 0 };
  }

  for (const post of publishedPosts) {
    const category = post.themeCategory || "Career & Success";
    if (!categoryStats[category]) {
      categoryStats[category] = { count: 0, totalScore: 0, totalLikes: 0, totalComments: 0 };
    }

    const likes = Number(post.likesCount || 0);
    const comments = Number(post.commentsCount || 0);
    const saves = Number(post.savesCount || 0);
    const score = (likes * 1) + (comments * 2.5) + (saves * 3);

    categoryStats[category].count += 1;
    categoryStats[category].totalScore += score;
    categoryStats[category].totalLikes += likes;
    categoryStats[category].totalComments += comments;
  }

  // Calculate average score per category
  let topCategory = "Career & Success";
  let maxAvgScore = -1;

  for (const [cat, data] of Object.entries(categoryStats)) {
    data.avgScore = Number((data.totalScore / (data.count || 1)).toFixed(2));
    if (data.count > 0 && data.avgScore > maxAvgScore) {
      maxAvgScore = data.avgScore;
      topCategory = cat;
    }
  }

  // Update configuration with learned intelligence
  await InstagramAgentConfig.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        topAudienceCategory: topCategory,
        categoryPerformance: categoryStats,
        lastOptimizedAt: new Date(),
      },
    },
    { upsert: true }
  );

  let aiRecommendation = `Your audience is engaging most with "${topCategory}". The agent will bias daily generation toward this category for maximum growth.`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && publishedPosts.length >= 3) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Based on these Instagram analytics for a high-performance motivation, career & life wisdom page:
${JSON.stringify(categoryStats, null, 2)}
Top Performing Theme: "${topCategory}".
Write 1-2 concise, high-impact growth optimization tips to increase saves, shares, and follower conversion.`;
      const res = await model.generateContent(prompt);
      aiRecommendation = res.response.text().trim();
    } catch (_) {}
  }

  return {
    topCategory,
    categoryBreakdown: categoryStats,
    recommendation: aiRecommendation,
  };
}
