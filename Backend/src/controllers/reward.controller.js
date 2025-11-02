// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { User } from "../models/user.model.js";
// import axios from "axios";

// export const sendReward = asyncHandler(async (req, res) => {
//   // 1. Get wallet address and amount from request body
//   const { address, amount } = req.body;
//   const numAmount = Number(amount);

//   // 2. Validate input
//   if (!address || !numAmount || numAmount <= 0) {
//     throw new ApiError(400, "Wallet address and a valid amount are required");
//   }

//   // 3. Get the authenticated user's ID
//   const clerkId = req.auth.userId;

//   // 4. Find the user in DB
//   const user = await User.findOne({ clerkId });

//   // 5. Check if the user exists
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   // 6. Check if the user has enough tokens for the transaction
//   if (user.greenTokens < numAmount) {
//     throw new ApiError(
//       400,
//       `Not enough tokens. You need ${numAmount} but only have ${user.greenTokens}.`
//     );
//   }

//   // 7. External API Call
//   let txHash;
//   try {
//     // 8. Call the external blockchain service to process the reward
//     const blockchainResponse = await axios.post(
//       `${process.env.BLOCKCHAIN_API_URL}/reward`,
//       {
//         address: address,
//         amount: numAmount,
//       }
//     );
//     // 9. On success, store the transaction hash
//     txHash = blockchainResponse.data.txHash;
//   } catch (error) {
//     // 10. External API Fail. No tokens are deducted.
//     console.error("Blockchain service error:", error.message);
//     throw new ApiError(
//       500,
//       "Blockchain transaction failed. No tokens were deducted."
//     );
//   }

//   // 11. Successful transaction, deduct tokens
//   user.greenTokens -= numAmount;

//   // 12. Save the updated user to DB
//   await user.save({ validateBeforeSave: false });

//   // 13. Send a response
//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         transferredAmount: numAmount,
//         toAddress: address,
//         newTotalTokens: user.greenTokens,
//         txHash: txHash,
//       },
//       "Reward minted and tokens updated successfully"
//     )
//   );
// });
