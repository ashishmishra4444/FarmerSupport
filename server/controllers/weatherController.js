import { WeatherAlert } from "../models/WeatherAlert.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sampleWeatherAlerts } from "../utils/mockData.js";

const buildAlertsFromForecast = (forecast) => {
  const alerts = [];
  const maxTemp = forecast?.daily?.temperature_2m_max?.[0];
  const rain = forecast?.daily?.precipitation_sum?.[0];
  const wind = forecast?.daily?.wind_speed_10m_max?.[0];

  if (typeof maxTemp === "number" && maxTemp >= 36) {
    alerts.push({
      title: "Heat advisory",
      severity: "high",
      message: `High temperature near ${Math.round(maxTemp)} C expected. Plan irrigation and transport carefully.`
    });
  }

  if (typeof rain === "number" && rain >= 5) {
    alerts.push({
      title: "Rain expected",
      severity: rain >= 20 ? "high" : "medium",
      message: `Rainfall around ${rain.toFixed(1)} mm expected. Protect stored produce and schedule harvesting carefully.`
    });
  }

  if (typeof wind === "number" && wind >= 25) {
    alerts.push({
      title: "Strong wind alert",
      severity: "medium",
      message: `Wind speed may reach ${Math.round(wind)} km/h. Secure lightweight crop covers and transport loads.`
    });
  }

  return alerts;
};

export const getWeatherAlerts = asyncHandler(async (req, res) => {
  const { lat = "20.2961", lng = "85.8245" } = req.query;
  const locationKey = `${lat},${lng}`;

  let alerts = [];

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=1`
    );

    if (response.ok) {
      const forecast = await response.json();
      alerts = buildAlertsFromForecast(forecast);

      if (alerts.length) {
        await WeatherAlert.deleteMany({ locationKey });
        await WeatherAlert.insertMany(
          alerts.map((alert) => ({
            ...alert,
            locationKey,
            alertTime: new Date()
          }))
        );
      }
    }
  } catch (_error) {
    alerts = [];
  }

  if (!alerts.length) {
    alerts = await WeatherAlert.find({ locationKey }).sort({ createdAt: -1 }).limit(5);
  }

  if (!alerts.length) {
    alerts = sampleWeatherAlerts.map((alert) => ({
      ...alert,
      locationKey
    }));
  }

  res.json({
    success: true,
    data: alerts
  });
});
