import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User, VehicleRun } from "../models/models.js";
// import { TripLog } from "../models/tripLog.model.js";
import axios from "axios";

import { getOrCreateUser } from "../utils/userUtils.js";

const vehicleTypeMap = {
  bicycle: "Bicycle",
  walk: "Bicycle",
  "e-bike": "E-Bike",
  "two wheeler": "Scooter",
  "four wheeler": "Car",
  "public transport": "Three-Wheeler",
  default: "Other",
};

export const logTrip = asyncHandler(async (req, res) => {
  const { mode, distance, isEV } = req.body;
  const clerkId = req.auth.userId;

  if (!mode || !distance || distance <= 0) {
    throw new ApiError(400, "Mode and a valid distance are required.");
  }

  const user = await getOrCreateUser(clerkId);

  // logic for deducting points if non-EV
  let tokens_awarded = 0;
  let user_co2_footprint_kg = 0;
  let message = "Trip logged successfully!";

  if (!isEV && mode !== "bicycle" && mode !== "walk") {
    // Deduct points for non-EV (e.g., Car, Motorcycle)
    // Deduction: 2 points per km
    const deduction = Math.ceil(distance * 2);
    tokens_awarded = -deduction;
    message = `Non-EV trip logged. ${deduction} Green Points deducted. Go Green next time!`;

    // Rough CO2 calc for non-EV (fallback if ML not called for deduction)
    user_co2_footprint_kg = distance * 0.2; // approx factor
  } else {
    // EV or Eco-friendly (Walk/Cycle) - Use ML or give points
    let mlVehicleType;
    if (mode === "bicycle" || mode === "walk") {
      mlVehicleType = "Bicycle";
    } else if (isEV) {
      mlVehicleType = "E-Bike"; // Simplify EV mapping for now
    } else {
      mlVehicleType = vehicleTypeMap[mode] || vehicleTypeMap["default"];
    }

    try {
      const payload = {
        vehicle_type: mlVehicleType,
        kmCovered: parseFloat(distance),
      };
      const mlResponse = await axios.post(
        `${process.env.ML_API_URL}/calculate-travel`,
        payload
      );
      user_co2_footprint_kg = mlResponse.data.user_co2_footprint_kg;
      tokens_awarded = mlResponse.data.tokens_awarded;
      
      // Bonus for walking/cycling
      if (mode === "bicycle" || mode === "walk") {
         tokens_awarded += 5; 
      }
      
    } catch (error) {
      // Fallback if ML fails
      tokens_awarded = 5;
    }
  }

  // Update User
  user.greenTokens += tokens_awarded;
  user.carbonFootprint += user_co2_footprint_kg; // Accumulate footprint
  await user.save({ validateBeforeSave: false });

  // Log Verification (Optional: Update VehicleRun if needed)
  // ...

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        tokensChange: tokens_awarded,
        totalTokens: user.greenTokens,
        co2Footprint: user_co2_footprint_kg,
      },
      message
    )
  );
});
