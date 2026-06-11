import mongoose from "mongoose";

const CompanyInsightSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    inferredProblems: { type: [String], default: [] },
    suggestedSolutions: { type: [String], default: [] },
    generatedEmail: { type: String, default: "" },
    sources: { type: [String], default: [] }, // URLs used as evidence
    confidence: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    isAiGenerated: { type: Boolean, default: true },
    generatedAt: { type: Date, default: Date.now },
    // re-analysis scheduling
    nextRefreshAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);

export default mongoose.model("CompanyInsight", CompanyInsightSchema);