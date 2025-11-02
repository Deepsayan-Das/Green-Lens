import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/models.js";
import { Address } from "../models/models.js";

export const updateUserProfile = asyncHandler(async (req, res) => {
  // 1. Get the authenticated user
  const clerkId = req.auth.userId;
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 2. Separate the data from the request body
  // We expect the frontend to send *all* data in one form
  const {
    // User fields
    fullName, // Allow them to update their name
    ph1,
    ph2,
    dob,
    gender,
    adhaar,

    // Address fields
    address,
    city,
    state,
    pinCode,
    nationality,
    carpetArea,
    homeType,
    tenure,
    storey,
    floorNo,
  } = req.body;

  // 3. Create or Update the Address
  // We use `findOneAndUpdate` with `upsert: true`.
  // This will *update* their address if it exists, or *create* a new one.
  // We use `user.addressId` to find the existing one.
  const addressUpdate = {
    address,
    city,
    state,
    pinCode,
    nationality,
    carpetArea,
    homeType,
    tenure,
    storey,
    floorNo,
  };

  const updatedAddress = await Address.findOneAndUpdate(
    { _id: user.addressId }, // Try to find the existing one
    { $set: addressUpdate }, // Set the new data
    { new: true, upsert: true } // Create it if it't doesn't exist
  );

  // 4. Update the User document
  user.fullName = fullName || user.fullName; // Keep old value if not provided
  user.ph1 = ph1 || user.ph1;
  user.ph2 = ph2 || user.ph2;
  user.dob = dob || user.dob;
  user.gender = gender || user.gender;
  user.adhaar = adhaar || user.adhaar;
  user.addressId = updatedAddress._id; // Link the new/updated address

  await user.save({ validateBeforeSave: false });

  // 5. Return the updated user
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});