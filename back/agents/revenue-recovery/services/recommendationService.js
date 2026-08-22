// import Batch from "../schema/batches.model.js";
// import Purchase from "../schema/purchase.model.js";


/**
 * Convert text into normalized words.
 *
 * Example:
 *
 * "I want to learn DSA for placements"
 *
 * becomes:
 *
 * ["want", "learn", "dsa", "placements"]
 */
function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length >= 3);
}


/**
 * Calculate how relevant a batch is to the user's query.
 */
function calculateRelevanceScore(batch, query) {

  const queryWords = tokenize(query);

  if (queryWords.length === 0) {
    return {
      score: 0,
      reasons: []
    };
  }


  const title = (batch.title || "").toLowerCase();

  const description =
    (batch.description || "").toLowerCase();

  const folder =
    (batch.folder || "").toLowerCase();

  const learningContent =
    (batch.whatYouLearn || [])
      .join(" ")
      .toLowerCase();


  let score = 0;

  const reasons = [];

  let titleMatches = 0;
  let descriptionMatches = 0;
  let learningMatches = 0;
  let folderMatches = 0;


  // -----------------------------------------
  // Check every word in user's query
  // -----------------------------------------

  for (const word of queryWords) {

    // TITLE
    if (title.includes(word)) {
      titleMatches++;
    }

    // DESCRIPTION
    if (description.includes(word)) {
      descriptionMatches++;
    }

    // WHAT YOU LEARN
    if (learningContent.includes(word)) {
      learningMatches++;
    }

    // FOLDER
    if (folder.includes(word)) {
      folderMatches++;
    }
  }


  // -----------------------------------------
  // TITLE SCORE
  // -----------------------------------------

  if (titleMatches > 0) {

    score += Math.min(
      titleMatches * 20,
      40
    );

    reasons.push(
      "The batch title matches your request."
    );
  }


  // -----------------------------------------
  // DESCRIPTION SCORE
  // -----------------------------------------

  if (descriptionMatches > 0) {

    score += Math.min(
      descriptionMatches * 5,
      20
    );

    reasons.push(
      "The batch description matches your goal."
    );
  }


  // -----------------------------------------
  // LEARNING CONTENT SCORE
  // -----------------------------------------

  if (learningMatches > 0) {

    score += Math.min(
      learningMatches * 5,
      20
    );

    reasons.push(
      "The batch covers topics related to your request."
    );
  }


  // -----------------------------------------
  // FOLDER SCORE
  // -----------------------------------------

  if (folderMatches > 0) {

    score += 15;

    reasons.push(
      "The batch belongs to a relevant learning category."
    );
  }


  return {
    score,
    reasons
  };
}


/**
 * Main recommendation function.
 */
export async function getRecommendations({

  userId = null,

  query = "",

  currentBatchId = null,

  limit = 3

}) {

  // =========================================
  // 1. GET ACTIVE BATCHES
  // =========================================

  const batches = await Batch.find({

    isActive: true

  })
  .select(
    "batchId folder title description price whatYouLearn redirectPath relatedBatchIds upgradeToBatchIds"
  )
    .sort({
      sortOrder: 1
    })
    .lean();


  // =========================================
  // 2. GET USER'S ACTIVE PURCHASES
  // =========================================

  let purchases = [];

  if (userId) {

    purchases = await Purchase.find({

      userId,

      expiryDate: {
        $gt: new Date()
      }

    })
      .select(
        "classId title description price expiryDate"
      )
      .lean();
  }


  // =========================================
  // 3. CREATE SET OF OWNED PRODUCTS
  // =========================================

  const ownedBatchIds = new Set(
    purchases.map(
      purchase => String(purchase.classId)
    )
  );


  // =========================================
  // 4. REMOVE ALREADY OWNED PRODUCTS
  // =========================================

  const candidates = batches.filter(

    batch =>
      !ownedBatchIds.has(
        String(batch.batchId)
      )

  );


  // =========================================
  // 5. SCORE EVERY CANDIDATE
  // =========================================

  const scored = candidates.map(batch => {

    const relevance =
      calculateRelevanceScore(
        batch,
        query
      );


      let score =relevance.score +relationshipScore;

      const reasons = [
        ...relevance.reasons,
        ...relationshipReasons
      ];


    // =======================================
    // CURRENT BATCH CONTEXT
    // =======================================

    if (
      currentBatchId &&
      String(batch.batchId) !==
        String(currentBatchId)
    ) {

      score += 5;

    }

    let recommendationType = "recommended";

let relationshipScore = 0;

const relationshipReasons = [];


for (const purchase of purchases) {

    const purchasedBatch =
      batches.find(
        b =>
          String(b.batchId) ===
          String(purchase.classId)
      );
  
  
    if (!purchasedBatch) {
      continue;
    }
  
  
    // =======================================
    // UPSELL
    // =======================================
  
    if (
      purchasedBatch.upgradeToBatchIds?.includes(
        String(batch.batchId)
      )
    ) {
  
      recommendationType = "upsell";
  
      relationshipScore += 40;
  
      relationshipReasons.push(
        `This is an upgrade from ${purchase.title}.`
      );
    }
  
  
    // =======================================
    // CROSS-SELL
    // =======================================
  
    if (
      purchasedBatch.relatedBatchIds?.includes(
        String(batch.batchId)
      )
    ) {
  
      // Don't overwrite a stronger upsell
      if (
        recommendationType !== "upsell"
      ) {
        recommendationType =
          "cross_sell";
      }
  
      relationshipScore += 25;
  
      relationshipReasons.push(
        `This complements ${purchase.title}.`
      );
    }
  }


  return {

    product: {
  
      id: batch.batchId,
  
      title: batch.title,
  
      description: batch.description,
  
      price: batch.price,
  
      category: batch.folder,
  
      whatYouLearn:
        batch.whatYouLearn || [],
  
      redirectPath:
        batch.redirectPath || null
  
    },
  
    score,
  
    type: recommendationType,
  
    reasons
  
  };

  });


  // =========================================
  // 6. SORT BY RELEVANCE
  // =========================================

  scored.sort(

    (a, b) =>
      b.score - a.score

  );


  // =========================================
  // 7. RETURN TOP PRODUCTS
  // =========================================

  return scored.slice(
    0,
    limit
  );
}