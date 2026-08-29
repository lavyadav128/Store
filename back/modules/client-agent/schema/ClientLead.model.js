import mongoose from "mongoose";

const schema = new mongoose.Schema({
  source: { type: String, enum: ["enquiry_form", "authorised_source", "admin"], required: true },
  businessName: { type: String, trim: true, required: true, maxlength: 180 },
  contactName: { type: String, trim: true, maxlength: 140, default: "" },
  email: { type: String, trim: true, lowercase: true, maxlength: 254, default: "" },
  phone: { type: String, trim: true, maxlength: 30, default: "" },
  website: { type: String, trim: true, maxlength: 500, default: "" },
  clientType: { type: String, trim: true, maxlength: 100, default: "" },
  requirement: { type: String, trim: true, required: true, maxlength: 12000 },
  budget: { type: Number, min: 0, default: null },
  deadline: { type: Date, default: null },
  sourceUrl: { type: String, trim: true, maxlength: 1000, default: "" },
  fitScore: { type: Number, min: 0, max: 100, default: 0 },
  analysis: { type: String, default: "" },
  status: { type: String, enum: ["new", "reviewing", "approved", "declined", "converted"], default: "new" },
  adminNote: { type: String, trim: true, maxlength: 3000, default: "" },
}, { timestamps: true });

schema.index({ status: 1, createdAt: -1 });
schema.index({ email: 1, createdAt: -1 });
export default mongoose.model("ClientLead", schema);
