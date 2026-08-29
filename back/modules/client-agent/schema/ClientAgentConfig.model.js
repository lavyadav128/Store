import mongoose from "mongoose";

const schema = new mongoose.Schema({
  key: { type: String, unique: true, default: "default" },
  running: { type: Boolean, default: false },
  clientTypes: { type: [String], default: ["website", "web app", "automation"] },
  minimumBudget: { type: Number, min: 0, default: 10000 },
  services: { type: [String], default: ["Websites", "Web apps", "AI automation"] },
  businessName: { type: String, trim: true, default: "" },
  contactEmail: { type: String, trim: true, lowercase: true, default: "" },
  enquirySlug: { type: String, trim: true, lowercase: true, default: "project-enquiry" },
  lastStartedAt: { type: Date, default: null },
  lastStoppedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("ClientAgentConfig", schema);
