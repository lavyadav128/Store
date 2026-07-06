import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    // Unique ID used in URLs and purchase records
    // e.g. "10", "11", "dsa", "web", "data-analysis"
    batchId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Path to card thumbnail image e.g. /images/11.png
    imageUrl: {
      type: String,
      required: true,
    },

    // Used in Courses.js cards only — screenshot preview
    screenshot: {
      type: String,
      default: '',
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    // Which page/component this batch belongs to
    // 'classes'  = ClassCardPage.jsx (JEE/NEET/Boards)
    // 'courses'  = Courses.js (DSA/Web/Data/Aptitude)
    pageType: {
      type: String,
      required: true,
      enum: ['classes', 'courses'],
    },

    category: {
      type: String,
      required: true,
      enum: ['JEE', 'NEET', 'Boards', 'DSA', 'Web', 'DataAnalysis', 'Aptitude', 'Other'],
    },

    // Used in Courses.js only — the route to navigate after purchase
    // e.g. "/dsa", "/web", "/data-analysis"
    redirectPath: {
      type: String,
      default: '',
    },

    // Used in Courses.js only — "What You'll Learn" bullet points
    whatYouLearn: {
      type: [String],
      default: [],
    },

    // Show/hide without deleting
    isActive: {
      type: Boolean,
      default: true,
    },

    // Controls display order on frontend
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Batch', batchSchema);
