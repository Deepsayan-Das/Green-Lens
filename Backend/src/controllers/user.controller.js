import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  User,
  Vehicle,
  Forestation,
  VehicleRun,
  ElectricityUsage,
  Address,
} from "../models/models.js";

export const getUserDashboard = asyncHandler(async (req, res) => {
  // 1. Get the user ID
  const clerkId = req.auth.userId;
  
  // 2. Validate the user
  if (!clerkId) {
    throw new ApiError(401, "Unauthorized request");
  }

  // 3. Find the user in the local database using their clerkId
  const user = await User.findOne({ clerkId: clerkId }).populate("addressId");
  
  // 4. Check if the user exists in our DB
  if (!user) {
    throw new ApiError(404, "User profile not found in our database");
  }
  
  // 5. Get the user's _internal_ user ID
  const userId = user._id;

  // 6. Define date boundaries to filter for "this month's" data
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // 7. Fetch all
  const [vehicles, forestationData, vehicleRuns, monthlyElec] =
    await Promise.all([
      // - Fetch all vehicles owned by this user
      Vehicle.find({ userID: userId }),
      // - Fetch the user's single forestation/planting record
      Forestation.findOne({ userID: userId }),
      // - Fetch all vehicle run records associated with the user
      VehicleRun.find({ userID: userId }),
      // - Fetch only this month's electricity bills
      ElectricityUsage.find({
        userID: userId,
        createdAt: { $gte: firstDayOfMonth },
      }),
    ]);

  // 8. Calculate total (lifetime) stats by reducing the arrays from the queries
  const totalKMDriven = vehicleRuns.reduce(
    (sum, run) => sum + run.totalKMCovered,
    0
  );

  const totalPlants = forestationData?.totalPlants || 0;

  // 9. Calculate current monthly stats from the queried data
  const monthlyKMDriven = vehicleRuns.reduce(
    (sum, run) => sum + run.currentMonthKMCover,
    0
  );
  const monthlyElecUnits = monthlyElec.reduce(
    (sum, bill) => sum + bill.unitsUsed,
    0
  );

  // 10. Response
  
  const dashboardData = {
    // --- User Profile ---
    profile: {
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      trustLevel: user.trustLvl,
      badges: user.badges,
      address: user.addressId, // This will be the populated Address object
    },

    // --- Key Metrics ---
    totalGreenTokens: user.greenTokens,
    currentCarbonFootprint: user.carbonFootprint,

    // --- Monthly Summary ---
    monthlyStats: {
      kmDriven: monthlyKMDriven,
      elecUnitsLogged: monthlyElecUnits,
    },

    // --- Token Sources (Lifetime Summary) ---
    tokenSources: {
      fromPlanting: totalPlants,
      fromDriving: totalKMDriven,
    },

    // --- User's Assets ---
    vehicles: vehicles,
  };

  // 11. Return a response
  return res
    .status(200)
    .json(
      new ApiResponse(200, dashboardData, "Dashboard data fetched successfully")
    );
});