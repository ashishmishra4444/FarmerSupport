import mongoose from "mongoose";
import { ORDER_PAYMENT_STATUSES, ORDER_STATUSES } from "../utils/orderWorkflow.js";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "At least one item is required"
      }
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "PendingApproval"
    },
    paymentStatus: {
      type: String,
      enum: ORDER_PAYMENT_STATUSES,
      default: "Unpaid"
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      district: String,
      state: String,
      postalCode: String
    },
    paymentProvider: {
      type: String,
      default: "Razorpay"
    },
    paymentReference: String,
    notes: String
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model("Order", orderSchema);
