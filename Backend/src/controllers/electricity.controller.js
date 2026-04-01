import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/models.js";
import { Address } from "../models/models.js";
import { ElectricityUsage } from "../models/models.js";
import axios from "axios";

import { getOrCreateUser } from "../utils/userUtils.js";

export const logElectricityBill = asyncHandler(async (req, res) => {
  // 1. Get data from request body
  const { bill, month, unitsUsed, solarUsed, homeType, carpetArea } = req.body;
  const clerkId = req.auth.userId;

  if (!month || unitsUsed === undefined) {
    throw new ApiError(400, "Month and Units Used are required");
  }

  // 2. Find User and their Address 
  const user = await getOrCreateUser(clerkId);

  const address = user.addressId ? await Address.findById(user.addressId) : null;
  
  const finalHomeType = homeType || address?.homeType;
  const finalCarpetArea = carpetArea || address?.carpetArea;

  if (!finalHomeType || !finalCarpetArea) {
    throw new ApiError(
      400,
      "Home Type and Carpet Area are required. Please provide them in the form or update your profile."
    );
  }

  // 3. Call the FastAPI ML Service
  let mlResponse;
  try {
    const payload = {
      homeType: finalHomeType,
      carpetArea_sqft: parseFloat(finalCarpetArea),
      monthly_unitsUsed_kwh: parseFloat(unitsUsed),
      monthly_solarUsed_kwh: parseFloat(solarUsed) || 0,
    };
    mlResponse = await axios.post(
      `${process.env.ML_API_URL}/calculate-electricity`,
      payload
    );
  } catch (error) {
    throw new ApiError(500, "ML service is unavailable", [error.message]);
  }

  // 4. Process ML Response
  const { user_co2_footprint_kg, tokens_awarded } = mlResponse.data;

  // 5. Save the data
  await ElectricityUsage.create({
    userID: user._id,
    bill,
    month,
    unitsUsed,
    solarUsed: solarUsed || 0,
  });

  // Update user's profile
  user.greenTokens += tokens_awarded;
  user.carbonFootprint = user_co2_footprint_kg;
  await user.save({ validateBeforeSave: false });

  // 6. Return success
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        tokensEarned: tokens_awarded,
        newCarbonFootprint: user_co2_footprint_kg,
        newTotalTokens: user.greenTokens,
      },
      "Electricity bill logged successfully"
    )
  );
});
