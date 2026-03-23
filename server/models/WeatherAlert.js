import mongoose from "mongoose";

const weatherAlertSchema = new mongoose.Schema(
  {
    locationKey: { type: String, required: true, index: true },
    title: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    message: { type: String, required: true },
    alertTime: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

export const WeatherAlert = mongoose.model("WeatherAlert", weatherAlertSchema);
