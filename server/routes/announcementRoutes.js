import { Router } from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
} from "../controllers/announcementController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

// Everyone logged in can view announcements
router.get("/", protect, getAnnouncements);

// Only admins can create or delete
router.post("/", protect, authorize("Admin"), createAnnouncement);
router.delete("/:id", protect, authorize("Admin"), deleteAnnouncement);

export default router;