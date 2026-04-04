import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    },
    provider: {
      type: String,
      default: "Razorpay"
    },
    receipt: {
      type: String,
      required: true
    },
    providerOrderId: {
      type: String,
      index: true
    },
    providerPaymentId: String,
    providerSignature: String,
    invoiceNumber: {
      type: String,
      index: true
    },
    invoiceIssuedAt: Date,
    paidAt: Date
  },
  {
    timestamps: true
  }
);

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
