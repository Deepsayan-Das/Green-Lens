import { User } from "../models/models.js";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { ApiError } from "./apiError.js";

let clerkClient = null;

/**
 * Gets a user from the DB by Clerk ID. If the user doesn't exist, fetches 
 * data from Clerk and creates a new User record in the DB.
 */
export const getOrCreateUser = async (clerkId) => {
  if (!clerkClient) {
    clerkClient = createClerkClient({ 
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY 
    });
  }

  if (!clerkId) throw new ApiError(401, "Unauthorized request");

  let user = await User.findOne({ clerkId });

  if (!user) {
    try {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || "";
        const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

        user = await User.create({
          clerkId,
          email,
          fullName,
          avatarUrl: clerkUser.imageUrl,
          adhaar: clerkId, // Temporary placeholder for required unique field
          ph1: "Not provided", // Temporary placeholder for required field
          greenTokens: 0,
          carbonFootprint: 0,
          trustLvl: 0, // Changed from "New" to 0 (Number)
          badges: []
        });
        console.log(`New user created: ${fullName} (${clerkId})`);
      } else {
        throw new ApiError(404, "User not found in Clerk");
      }
    } catch (error) {
      console.error("\n=== CLERK GET USER ERROR ===");
      console.error(error);
      console.error("==============================\n");
      throw new ApiError(500, "Failed to create user profile", [error.message]);
    }
  }

  return user;
};
