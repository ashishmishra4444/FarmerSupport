import { Router } from "express";
import {
  createOrder,
  getFarmerOrderAnalytics,
  getFarmerOrders,
  getMyBuyerOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, authorize("Buyer"), createOrder);
router.get("/buyer/my-orders", protect, authorize("Buyer"), getMyBuyerOrders);
router.get("/farmer/my-orders", protect, authorize("Farmer"), getFarmerOrders);
router.get("/farmer/analytics", protect, authorize("Farmer"), getFarmerOrderAnalytics);
router.get("/:orderId", protect, getOrderById);
router.patch("/:orderId/status", protect, authorize("Farmer", "Admin"), updateOrderStatus);

export default router;
