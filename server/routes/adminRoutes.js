import { Router } from "express";
import {
  getAdminDashboard,
  getPlatformSnapshot,
  overrideMandiPrice,
  triggerMandiSync
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorize("Admin"));
router.get("/dashboard", getAdminDashboard);
router.get("/snapshot", getPlatformSnapshot);
router.post("/mandi/sync", triggerMandiSync);
router.patch("/mandi/:priceId", overrideMandiPrice);

export default router;
