import { Router } from "express";
import { getWeatherAlerts } from "../controllers/weatherController.js";

const router = Router();

router.get("/", getWeatherAlerts);

export default router;
