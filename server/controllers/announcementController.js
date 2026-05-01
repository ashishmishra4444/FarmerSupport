import { Announcement } from "../models/Announcement.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnnouncements = asyncHandler(async (_req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: announcements,
  });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create({
    message: req.body.message,
  });
  res.status(201).json({
    success: true,
    data: announcement,
  });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({
    success: true,
    message: "Announcement deleted successfully",
  });
});