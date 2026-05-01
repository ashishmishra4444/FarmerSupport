import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);