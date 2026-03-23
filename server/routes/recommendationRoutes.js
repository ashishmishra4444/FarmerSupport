import { Router } from "express";
import { getCropRecommendation } from "../controllers/recommendationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, authorize("Farmer"), getCropRecommendation);

export default router;
