import cron from "node-cron";
import { syncMandiPrices } from "./mandiService.js";

export const startCronJobs = () => {
  cron.schedule("0 6 * * *", async () => {
    try {
      await syncMandiPrices();
      console.log("Daily mandi sync completed");
    } catch (error) {
      console.error("Mandi sync failed:", error.message);
    }
  });
};
