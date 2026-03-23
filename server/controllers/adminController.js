import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { MandiPrice } from "../models/MandiPrice.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { syncMandiPrices } from "../services/mandiService.js";

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const [userStats, salesStats, latestPrices] = await Promise.all([
    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]),
    Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          sales: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    MandiPrice.find().sort({ updatedAt: -1 }).limit(10)
  ]);

  res.json({
    success: true,
    data: {
      userStats,
      salesStats,
      latestPrices
    }
  });
});

export const overrideMandiPrice = asyncHandler(async (req, res) => {
  const mandiPrice = await MandiPrice.findByIdAndUpdate(
    req.params.priceId,
    { ...req.body, source: "manual", syncedAt: new Date() },
    { new: true }
  );

  res.json({
    success: true,
    message: "Mandi price updated successfully",
    data: mandiPrice
  });
});

export const triggerMandiSync = asyncHandler(async (_req, res) => {
  const prices = await syncMandiPrices();

  res.json({
    success: true,
    message: "Mandi prices synced successfully",
    data: prices
  });
});

export const getPlatformSnapshot = asyncHandler(async (_req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments()
  ]);

  res.json({
    success: true,
    data: { users, products, orders }
  });
});
