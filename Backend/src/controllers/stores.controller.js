import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/models.js";
import axios from "axios";

// const STORE_ITEMS = {
//   VOUCHER_500: 500,
//   MERCH_TEE: 2000,
//   DONATE_100: 100,
// };

export const redeemItem = asyncHandler(async (req, res) => {
  // 1. Get the product ID
  const { productId } = req.body;

  // 2. Validation
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // 3. Map the cost
  const costInTokens = STORE_ITEMS[productId];

  // 4. Check if the product ID exists
  if (costInTokens === undefined) {
    throw new ApiError(404, "Product not found or invalid");
  }

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

  // 9. Call the external blockchain API to burn the corresponding tokens
  try {
    await axios.post(`${process.env.BLOCKCHAIN_API_URL}/burn`, {
      amount: costInTokens,
    });
  } catch (error) {
    // 10. If blockchain fails, STOP and throw an error.
    console.error("Blockchain burn failed:", error.message);
    throw new ApiError(
      500,
      "Blockchain service failed. Your tokens were not deducted. Please try again."
    );
  }

  // 11. if try successful
  user.greenTokens -= costInTokens;

  // 12. Save the user's new balance
  await user.save({ validateBeforeSave: false });

  // 14. Send a response
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
