import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/models.js";
import { Forestation } from "../models/models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";

const TOKENS_PER_PLANT = 10; // You can make this logic more complex later

export const logPlanting = asyncHandler(async (req, res) => {
  // 1. Get data from form and user
  const { plantCount, plantationLocation, treeSpecies } = req.body;
  const clerkId = req.auth.userId;

  // 2. Validate form data
  const numPlantCount = Number(plantCount);
  if (!numPlantCount || numPlantCount <= 0) {
    throw new ApiError(400, "A valid plant count is required.");
  }
  // [NEW] Validate new fields
  if (!plantationLocation || plantationLocation.trim() === "") {
    throw new ApiError(400, "Plantation location is required.");
  }
  // Check if species are provided (can be a string or array)
  if (!treeSpecies || treeSpecies.length === 0) {
    throw new ApiError(400, "Tree species are required.");
  }

  // 3. Find the user
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 4. Handle the image upload
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "An image file is required for verification");
  }

  const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);
  if (!cloudinaryResponse || !cloudinaryResponse.url) {
    throw new ApiError(500, "Failed to upload image");
  }
  const imageUrl = cloudinaryResponse.url;

  // 5. Calculate tokens
  const tokensEarned = numPlantCount * TOKENS_PER_PLANT;

  // 6. Update the Forestation document
  const forestation = await Forestation.findOneAndUpdate(
    { userID: user._id }, // Find the user's summary doc
    {
      $inc: { totalPlants: numPlantCount }, // Increment total plant count
      $set: {
        lastPic: imageUrl, // Set the last picture
        lastLocation: plantationLocation, // Set the last location
        lastSpecies: treeSpecies, // Set the last species
      },
    },
    { new: true, upsert: true } // `upsert: true` creates a new doc if none exists
  );

  // 7. Update the User's tokens
  user.greenTokens += tokensEarned;
  await user.save({ validateBeforeSave: false });

  // 8. Send response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        plantsAdded: numPlantCount,
        tokensEarned: tokensEarned,
        totalPlants: forestation.totalPlants,
        newTotalTokens: user.greenTokens,
        lastPlanting: {
          location: forestation.lastLocation,
          species: forestation.lastSpecies,
          pic: forestation.lastPic,
        },
      },
      "Planting logged successfully!"
    )
  );
});