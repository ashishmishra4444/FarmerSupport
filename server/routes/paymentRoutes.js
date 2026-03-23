import { Router } from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/:orderId/create-order", protect, authorize("Buyer", "Admin"), createRazorpayOrder);
router.post("/:orderId/verify", protect, authorize("Buyer", "Admin"), verifyRazorpayPayment);

export default router;
