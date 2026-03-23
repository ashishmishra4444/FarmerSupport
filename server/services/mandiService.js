import { MandiPrice } from "../models/MandiPrice.js";
import { sampleMandiPrices } from "../utils/mockData.js";

const normalizePriceRow = (row) => ({
  crop: row.crop || row.commodity || row.commodity,
  market: row.market || row.marketName || row.district || "Unknown Market",
  state: row.state || row.stateName || "Unknown State",
  modalPrice: Number(row.modalPrice || row.modal_price || row.modalPriceRs || 0),
  minPrice: Number(row.minPrice || row.min_price || 0),
  maxPrice: Number(row.maxPrice || row.max_price || 0),
  unit: row.unit || "quintal"
});

export const syncMandiPrices = async () => {
  let rows = sampleMandiPrices;

  try {
    if (process.env.OGD_MANDI_API_URL) {
      const response = await fetch(process.env.OGD_MANDI_API_URL, {
        headers: process.env.OGD_API_KEY
          ? {
              "X-API-KEY": process.env.OGD_API_KEY
            }
          : {}
      });

      if (response.ok) {
        const payload = await response.json();
        const records = payload.records || payload.data || payload.results || [];
        const mappedRows = records.map(normalizePriceRow).filter((row) => row.crop && row.modalPrice > 0);
        if (mappedRows.length) {
          rows = mappedRows.slice(0, 40);
        }
      }
    }
  } catch (_error) {
    rows = sampleMandiPrices;
  }

  const operations = rows.map((row) => ({
    updateOne: {
      filter: { crop: row.crop, market: row.market, state: row.state },
      update: {
        $set: {
          ...row,
          source: process.env.OGD_MANDI_API_URL ? "live-sync" : "sample-sync",
          syncedAt: new Date()
        }
      },
      upsert: true
    }
  }));

  if (operations.length) {
    await MandiPrice.bulkWrite(operations);
  }

  return MandiPrice.find().sort({ syncedAt: -1, updatedAt: -1 }).limit(20);
};
