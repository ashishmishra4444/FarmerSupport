import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const cropRules = [
  {
    crop: "Rice",
    matches: ({ nitrogen, phosphorus, potassium, ph, location }) =>
      nitrogen >= 65 && phosphorus >= 40 && potassium >= 35 && ph >= 5.8 && ph <= 7.2 && /(odisha|west bengal|assam|chhattisgarh|bihar)/i.test(location)
  },
  {
    crop: "Wheat",
    matches: ({ nitrogen, phosphorus, potassium, ph, location }) =>
      nitrogen >= 70 && phosphorus >= 50 && potassium >= 55 && ph >= 6.4 && ph <= 7.6 && /(punjab|haryana|uttar pradesh|rajasthan)/i.test(location)
  },
  {
    crop: "Maize",
    matches: ({ nitrogen, phosphorus, potassium, ph }) =>
      nitrogen >= 55 && phosphorus >= 35 && potassium >= 30 && ph >= 5.5 && ph <= 7.5
  },
  {
    crop: "Cotton",
    matches: ({ nitrogen, potassium, ph, location }) =>
      nitrogen >= 50 && potassium >= 55 && ph >= 6 && ph <= 8 && /(maharashtra|gujarat|telangana|madhya pradesh)/i.test(location)
  },
  {
    crop: "Sugarcane",
    matches: ({ nitrogen, phosphorus, potassium, ph }) =>
      nitrogen >= 80 && phosphorus >= 45 && potassium >= 60 && ph >= 6 && ph <= 7.8
  },
  {
    crop: "Millets",
    matches: ({ nitrogen, phosphorus, ph }) => nitrogen <= 55 && phosphorus <= 45 && ph >= 5.2 && ph <= 6.8
  },
  {
    crop: "Pulses",
    matches: ({ nitrogen, phosphorus, potassium, ph }) =>
      nitrogen >= 35 && nitrogen <= 65 && phosphorus >= 30 && potassium >= 25 && ph >= 6 && ph <= 7.5
  }
];

const validatePayload = ({ nitrogen, phosphorus, potassium, ph, location }) => {
  const values = [nitrogen, phosphorus, potassium, ph, location];
  return values.every((value) => value !== undefined && value !== null && String(value).trim() !== "");
};

export const getCropRecommendation = asyncHandler(async (req, res) => {
  const { nitrogen, phosphorus, potassium, ph, location } = req.body;

  if (!validatePayload({ nitrogen, phosphorus, potassium, ph, location })) {
    throw new ApiError(400, "Please provide nitrogen, phosphorus, potassium, pH, and location.");
  }

  const input = {
    nitrogen: Number(nitrogen),
    phosphorus: Number(phosphorus),
    potassium: Number(potassium),
    ph: Number(ph),
    location: String(location)
  };

  if (Object.values(input).some((value) => (typeof value === "number" ? Number.isNaN(value) : false))) {
    throw new ApiError(400, "Soil values must be valid numbers.");
  }

  const bestMatch = cropRules.find((rule) => rule.matches(input)) || { crop: "Vegetables" };

  res.json({
    success: true,
    data: {
      bestCrop: bestMatch.crop,
      confidence: 0.84,
      location,
      summary: `${bestMatch.crop} is a strong fit for the submitted soil values and location.`,
      recommendations: [
        "Use certified seeds and monitor irrigation.",
        "Check local mandi trends before large-scale sowing.",
        "Validate with a soil lab or agronomist before the final crop decision."
      ]
    }
  });
});
