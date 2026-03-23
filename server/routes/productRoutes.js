import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getFarmerDashboardSummary,
  getFarmerProducts,
  getMarketplaceProducts,
  updateProduct
} from "../controllers/productController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getMarketplaceProducts);
router.post("/", protect, authorize("Farmer"), createProduct);
router.get("/farmer/my-products", protect, authorize("Farmer"), getFarmerProducts);
router.get("/farmer/summary", protect, authorize("Farmer"), getFarmerDashboardSummary);
router.patch("/:productId", protect, authorize("Farmer", "Admin"), updateProduct);
router.delete("/:productId", protect, authorize("Farmer", "Admin"), deleteProduct);

export default router;
