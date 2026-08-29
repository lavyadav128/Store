import mongoose from "mongoose";

const paymentAttemptSchema = new mongoose.Schema(
  {
    // Student who attempted the purchase
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Batch/course being purchased
    batchId: {
      type: String,
      required: true,
    },

    batchTitle: {
      type: String,
      required: true,
    },

    // Amount in rupees
    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // Razorpay order
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    // Will be filled after Razorpay responds
    razorpayPaymentId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "created",
        "attempted",
        "paid",
        "failed",
        "cancelled",
      ],
      default: "created",
    },

    failureReason: {
      type: String,
      default: null,
    },

    customerName: {
      type: String,
      default: "",
    },

    customerEmail: {
      type: String,
      default: "",
    },

    customerPhone: {
      type: String,
      default: "",
    },

    // Useful for the agent later
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

paymentAttemptSchema.index({
  userId: 1,
  createdAt: -1,
});

paymentAttemptSchema.index({
  batchId: 1,
  status: 1,
});

paymentAttemptSchema.index({
  razorpayPaymentId: 1,
  sparse: true,
});

export default mongoose.model(
  "PaymentAttempt",
  paymentAttemptSchema
);