import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true, index: true },
    companyLogo: { type: String, default: "" },
    location: { type: String, default: "Remote" },
    category: {
      type: String,
      enum: [
        "Software Development",
        "Data Science",
        "Product",
        "Design",
        "Marketing",
        "Sales",
        "Finance",
        "HR",
        "Operations",
        "Other",
      ],
      default: "Other",
      index: true,
    },
    employmentType: { type: String, default: "Full-time" },
    skills: { type: [String], default: [], index: true },
    description: { type: String, default: "" },
    applyLink: { type: String, required: true },
    source: { type: String, default: "" }, // e.g. "Adzuna", "Remotive", "Manual"
    sourceId: { type: String, default: "", index: true }, // dedup key from external API
    postedDate: { type: Date, default: Date.now },
    isOffCampus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// avoid duplicate inserts from the same source
JobSchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Job", JobSchema);