import { Router } from "express";
import { getMandiPrices, syncPrices } from "../controllers/mandiController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getMandiPrices);
router.post("/sync", protect, authorize("Admin"), syncPrices);

export default router;
