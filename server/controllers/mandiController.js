import { MandiPrice } from "../models/MandiPrice.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { syncMandiPrices } from "../services/mandiService.js";

export const getMandiPrices = asyncHandler(async (_req, res) => {
  let latestPrice = await MandiPrice.findOne().sort({ syncedAt: -1, updatedAt: -1 });

  if (!latestPrice || !latestPrice.syncedAt || Date.now() - new Date(latestPrice.syncedAt).getTime() > 6 * 60 * 60 * 1000) {
    await syncMandiPrices();
    latestPrice = await MandiPrice.findOne().sort({ syncedAt: -1, updatedAt: -1 });
  }

  const prices = await MandiPrice.find().sort({ syncedAt: -1, updatedAt: -1 }).limit(50);

  res.json({
    success: true,
    data: prices
  });
});

export const syncPrices = asyncHandler(async (_req, res) => {
  const synced = await syncMandiPrices();

  res.json({
    success: true,
    data: synced
  });
});
