import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    cropType: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      default: "kg"
    },
    location: {
      district: String,
      state: String
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model("Product", productSchema);
