import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/models.js";

// Products map based on frontend data
const STORE_ITEMS = {
  1: 1000,   // Bamboo Toothbrush
  2: 4000,   // Reusable Metal Bottle
  3: 2000,   // Organic Cotton Tote Bag
  4: 8000,   // Solar Lantern
  5: 2500,   // Plantable Seed Notebook
  6: 3000,   // Eco Soap Bar
  7: 1500,   // Bamboo Cutlery Set
  8: 800,    // Beeswax Food Wraps
  9: 5000,   // Compost Bin
  10: 1000,  // Reusable Coffee Cup
  11: 10000, // Solar Phone Charger
  12: 5000,  // Recycled Paper Journal
};

export const redeemItem = asyncHandler(async (req, res) => {
  // 1. Get the product ID and quantity
  const { productId, quantity = 1 } = req.body;

  // 2. Validation
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // 3. Map the cost
  const pricePerUnit = STORE_ITEMS[productId];

  // 4. Check if the product ID exists
  if (pricePerUnit === undefined) {
    throw new ApiError(404, "Product not found or invalid");
  }

  const costInTokens = pricePerUnit * quantity;

  // 5. Get the authenticated user's ID
  const clerkId = req.auth.userId;

  // 6. Find the user in the database
  const user = await User.findOne({ clerkId });

  // 7. Check if the user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 8. Check token amount
  if (user.greenTokens < costInTokens) {
    throw new ApiError(
      400,
      `Not enough tokens. You need ${costInTokens} but only have ${user.greenTokens}.`
    );
  }

  // 9. Deduct tokens (No Blockchain)
  user.greenTokens -= costInTokens;

  // 10. Save the user's new balance
  await user.save({ validateBeforeSave: false });

  // 11. Send a response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { newTotalTokens: user.greenTokens },
        "Item redeemed successfully!"
      )
    );
});
