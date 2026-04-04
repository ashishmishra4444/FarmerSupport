import { Router } from "express";
import {
  createRazorpayOrder,
  getPaymentInvoice,
  handleRazorpayWebhook,
  verifyRazorpayPayment
} from "../controllers/paymentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/webhook", handleRazorpayWebhook);
router.post("/:orderId/create-order", protect, authorize("Buyer", "Admin"), createRazorpayOrder);
router.post("/:orderId/verify", protect, authorize("Buyer", "Admin"), verifyRazorpayPayment);
router.get("/:orderId/invoice", protect, authorize("Buyer", "Admin"), getPaymentInvoice);

export default router;
