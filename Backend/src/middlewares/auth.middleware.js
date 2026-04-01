import { Clerk, createClerkClient } from "@clerk/clerk-sdk-node";
import { ApiError } from "../utils/apiError.js";

let clerkClient = null;

//Clerk authentication middleware
export const authMiddleware = async (req, res, next) => {
  if (!clerkClient) {
    clerkClient = createClerkClient({ 
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY 
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized: No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const verifiedToken = await clerkClient.verifyToken(token);

    if (!verifiedToken) {
        return next(new ApiError(401, "Unauthorized: Invalid token"));
    }

    req.auth = { userId: verifiedToken.sub };

    next();
  } catch (error) {
    return next(new ApiError(401, "Unauthorized: Invalid token", [error.message]));
  }
};

