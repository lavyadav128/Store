import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  classId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true,
    default: "" 
  },
  price: { 
    type: Number, 
    required: true,
    default: 0 
  },
  imageUrl: { 
    type: String, 
    required: true,
    default: "" 
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
  isPremium: { 
    type: Boolean, // ✅ updated to Boolean
    required: true 
  }
}, { 
  timestamps: true,
  strict: true,
  validateBeforeSave: true
});
// POST /save-purchase does findOneAndUpdate({ userId, classId }, ..., { upsert: true })
// — this compound UNIQUE index makes that fast AND stops duplicate purchase
// records for the same user+class from ever being created
purchaseSchema.index({ userId: 1, classId: 1 }, { unique: true });

// GET /user-purchases filters { userId, expiryDate: { $gt: now } }
purchaseSchema.index({ userId: 1, expiryDate: 1 });
export default mongoose.model('Purchase', purchaseSchema);
