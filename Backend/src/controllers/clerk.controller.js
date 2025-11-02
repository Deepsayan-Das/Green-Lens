import { Clerk } from "@clerk/clerk-sdk-node";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await clerk.users.getUser(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { email, fullName, phoneNumber } = req.body;

  const newUser = await clerk.users.createUser({
    email,
    fullName,
    phoneNumber,
  });
  
  return res.status(201).json(new ApiResponse(201, newUser, "User created successfully"));
});

// Update user details
// const updateUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   const updatedUser = await clerk.users.updateUser(id, updates);
  
//   return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
// });

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await clerk.users.deleteUser(id);
  
  return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

export { getUserById, createUser, deleteUser };