import mongoose from "mongoose";

const codeFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, default: "javascript" },
  path: { type: String, default: "" },
}, { _id: false });

const schema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "ClientLead", required: true, unique: true },
  projectCode: { type: String, unique: true, required: true },
  title: { type: String, trim: true, required: true, maxlength: 200 },
  scope: { type: String, trim: true, required: true, maxlength: 16000 },
  proposedAmount: { type: Number, min: 1, required: true },
  deadline: { type: Date, default: null },
  developmentBrief: { type: String, default: "" },
  codexTask: { type: String, default: "" },
  repositoryUrl: { type: String, trim: true, maxlength: 1000, default: "" },
  deliveryUrl: { type: String, trim: true, maxlength: 1000, default: "" },
  testSummary: { type: String, trim: true, maxlength: 10000, default: "" },
  generatedCodeFiles: { type: [codeFileSchema], default: [] },
  livePreviewUrl: { type: String, trim: true, maxlength: 1000, default: "" },
  zipDownloadUrl: { type: String, trim: true, maxlength: 1000, default: "" },
  buildStatus: { type: String, enum: ["idle", "building", "completed", "failed"], default: "idle" },
  buildError: { type: String, default: "" },
  status: {
    type: String,
    enum: [
      "pending_admin_approval",
      "approved",
      "in_progress",
      "awaiting_delivery_review",
      "delivery_approved",
      "payment_requested",
      "paid",
      "delivered",
      "declined",
    ],
    default: "pending_admin_approval",
  },
  paymentOrderId: { type: String, default: "" },
  paymentId: { type: String, default: "" },
  paymentLink: { type: String, default: "" },
  adminNote: { type: String, trim: true, maxlength: 3000, default: "" },
}, { timestamps: true });

schema.index({ status: 1, createdAt: -1 });
export default mongoose.model("ClientProject", schema);
