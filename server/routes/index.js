import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import chatRoutes from "./chatRoutes.js";
import mandiRoutes from "./mandiRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import productRoutes from "./productRoutes.js";
import recommendationRoutes from "./recommendationRoutes.js";
import weatherRoutes from "./weatherRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is healthy"
  });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);
router.use("/mandi", mandiRoutes);
router.use("/weather", weatherRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/payments", paymentRoutes);
router.use("/chats", chatRoutes);

export default router;
