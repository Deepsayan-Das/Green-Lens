import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/models.js";
// import { TripLog } from "../models/tripLog.model.js";
import axios from "axios";

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

  const user = await User.findOne({ clerkId: clerkId });
  if (!user) throw new ApiError(404, "User not found");

  let mlVehicleType;

  if (mode === "bicycle" || mode === "walk") {
    mlVehicleType = "Bicycle";
  } else if (isEV) {
    mlVehicleType = "E-Bike";
  } else {
    mlVehicleType = vehicleTypeMap[mode] || vehicleTypeMap["default"];
  }

  let mlResponse;
  try {
    const payload = {
      vehicle_type: mlVehicleType,
      kmCovered: parseFloat(distance),
    };
    mlResponse = await axios.post(
      `${process.env.ML_API_URL}/calculate-travel`,
      payload
    );
  } catch (error) {
    console.error("ML API Error:", error.message);
    throw new ApiError(500, "ML service is unavailable");
  }

  const { user_co2_footprint_kg, tokens_awarded } = mlResponse.data;

  const newTrip = await TripLog.create({
    userID: user._id,
    mode: mode,
    distance: distance,
    isEV: isEV,
  });

  user.greenTokens += tokens_awarded;
  await user.save({ validateBeforeSave: false });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        trip: newTrip,
        tokensEarned: tokens_awarded,
        co2Footprint: user_co2_footprint_kg,
        newTotalTokens: user.greenTokens,
      },
      "Trip logged successfully!"
    )
  );
});
