// growthOptimizer.js
// ─────────────────────────────────────────────────────────────
// Autonomous Audience Feedback & Growth Optimization Engine
// Learns what content the audience likes most (views, likes, saves)
// across the 12 Nature & Earth Series, providing actionable analytics.
// ─────────────────────────────────────────────────────────────

import InstagramContent from "../schema/InstagramContent.model.js";
import InstagramAgentConfig from "../schema/InstagramAgentConfig.model.js";

export const NATURE_SERIES_CATEGORIES = [
  "🌅 Nature's Morning",
  "🌄 Sunset of the Day",
  "🦌 Wildlife Moments",
  "🌲 Hidden Forests",
  "🌊 Ocean Diaries",
  "🌧️ Rainy Nature",
  "🌌 Nature at Night",
  "🦋 Tiny Wonders",
  "🏔️ Mountain Stories",
  "🍂 Earth Through the Seasons",
  "🐘 Wildlife Around the World",
  "🌍 One Planet, Many Worlds",
];

/**
 * Calculates the audience performance score for a piece of content.
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
 * Analyzes all published posts across 12 Nature Series to identify top-performing themes.
 */
export async function analyzeAudiencePreferences() {
  const publishedPosts = await InstagramContent.find({
    status: "published",
  }).sort({ publishedAt: -1 }).limit(100);

  if (!publishedPosts.length) {
    return {
      topCategory: "🌅 Nature's Morning",
      categoryBreakdown: NATURE_SERIES_CATEGORIES.reduce((acc, cat) => {
        acc[cat] = { count: 0, avgScore: 0, totalLikes: 0, totalComments: 0 };
        return acc;
      }, {}),
      recommendation: "Maintain consistent 12:00 PM (12 Noon IST) daily reel posting across 12 Nature realms to build algorithmic authority.",
    };
  }

  const categoryStats = {};
  for (const cat of NATURE_SERIES_CATEGORIES) {
    categoryStats[cat] = { count: 0, totalScore: 0, totalLikes: 0, totalComments: 0 };
  }

  for (const post of publishedPosts) {
    const category = post.themeCategory || "🌅 Nature's Morning";
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
  let topCategory = "🌅 Nature's Morning";
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

  return {
    topCategory,
    categoryBreakdown: categoryStats,
    recommendation: `Audience engagement is highest on [${topCategory}]. Continue queuing daily vertical reels in this realm.`,
  };
}

/**
 * Comprehensive Channel Growth & Health Analyzer for the Admin Page
 */
export async function getChannelGrowthAnalysis(accountSnapshot = null) {
  const publishedCount = await InstagramContent.countDocuments({ status: "published" });
  const queuedCount = await InstagramContent.countDocuments({
    status: { $in: ["ready", "scheduled"] },
    assetUrl: { $ne: "" },
  });

  const recentPosts = await InstagramContent.find({
    status: "published",
  }).sort({ publishedAt: -1 }).limit(30);

  let totalLikes = 0;
  let totalComments = 0;
  for (const p of recentPosts) {
    totalLikes += Number(p.likesCount || 0);
    totalComments += Number(p.commentsCount || 0);
  }

  const followers = accountSnapshot?.followers ?? 0;
  const reach = accountSnapshot?.reach ?? 0;
  const engagement = accountSnapshot?.engagement ?? (totalLikes + totalComments * 2);

  let growthStatus = "🌱 Growth Incubating";
  let growthBadgeColor = "#71717a";
  let growthSummary = "Your channel queue is active. Upload more reels into the daily queue to gain consistent algorithmic momentum.";

  if (publishedCount >= 14 || followers > 500) {
    growthStatus = "🚀 High Growth Momentum";
    growthBadgeColor = "#22c55e";
    growthSummary = `Strong performance! You have published ${publishedCount} daily reels. Instagram algorithm is rewarding your consistent daily 12:00 PM Noon IST schedule.`;
  } else if (publishedCount >= 3 || followers > 50) {
    growthStatus = "📈 Steady Growth Velocity";
    growthBadgeColor = "#3b82f6";
    growthSummary = `Consistent growth detected. You have ${queuedCount} upcoming daily reels lined up. Keep the queue populated for uninterrupted daily posting.`;
  }

  const audienceIntel = await analyzeAudiencePreferences();

  return {
    growthStatus,
    growthBadgeColor,
    growthSummary,
    followers,
    reach,
    engagement,
    publishedCount,
    queuedCount,
    topCategory: audienceIntel.topCategory,
    recommendation: audienceIntel.recommendation,
    analyzedAt: new Date().toISOString(),
  };
}
