import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({

  batchId: {
    type: String,
    required: true,
    unique: true
  },

  folder: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },

  screenshot: {
    type: String,
    default: ''
  },

  price: {
    type: Number,
    default: 0
  },

  redirectPath: {
    type: String,
    default: ''
  },

  whatYouLearn: {
    type: [String],
    default: []
  },

  isActive: {
    type: Boolean,
    default: true
  },

  sortOrder: {
    type: Number,
    default: 0
  },


  // -----------------------------------------
  // RECOMMENDATION RELATIONSHIPS
  // -----------------------------------------

  // Products that complement this product
  // Example:
  // DSA Basic -> DSA Test Series
  relatedBatchIds: {
    type: [String],
    default: []
  },


  // More advanced products
  // Example:
  // DSA Basic -> DSA Advanced
  upgradeToBatchIds: {
    type: [String],
    default: []
  }

});


// Existing index
batchSchema.index({
  isActive: 1,
  folder: 1,
  sortOrder: 1
});


export default mongoose.model(
  'Batch',
  batchSchema
);