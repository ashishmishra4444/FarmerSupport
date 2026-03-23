import mongoose from "mongoose";

const mandiPriceSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, trim: true },
    market: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    modalPrice: { type: Number, required: true, min: 0 },
    minPrice: { type: Number, default: 0 },
    maxPrice: { type: Number, default: 0 },
    source: { type: String, default: "manual" },
    syncedAt: Date
  },
  {
    timestamps: true
  }
);

export const MandiPrice = mongoose.model("MandiPrice", mandiPriceSchema);
