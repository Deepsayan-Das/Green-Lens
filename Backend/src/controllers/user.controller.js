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
  Solar
} from "../models/models.js";

import { getOrCreateUser } from "../utils/userUtils.js";

// [NEW] Get Leaderboard (Top 10 Users)
export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await User.find({})
    .sort({ greenTokens: -1 }) // Sort by greenTokens descending
    .limit(10)
    .select("fullName avatarUrl greenTokens badges"); // Select only necessary fields

  return res
    .status(200)
    .json(new ApiResponse(200, leaderboard, "Leaderboard fetched successfully"));
});

export const getUserDashboard = asyncHandler(async (req, res) => {
  // 1. Get the user ID
  const clerkId = req.auth.userId;
  
  // 2. Validate the user
  if (!clerkId) {
    throw new ApiError(401, "Unauthorized request");
  }

  // 3 & 4. Find the user in the local database or create them lazily
  let user = await getOrCreateUser(clerkId);
  user = await user.populate("addressId");
  
  // 5. Get the user's _internal_ user ID
  const userId = user._id;

  // 6. Define date boundaries to filter for "this month's" data
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // 7. Fetch all relevant data
  const [vehicles, forestationData, vehicleRuns, electricBills, solarData] =
    await Promise.all([
      Vehicle.find({ userID: userId }),
      Forestation.find({ userID: userId }), 
      VehicleRun.find({ userID: userId }),
      ElectricityUsage.find({ userID: userId }),
      Solar.find({ userID: userId }), 
    ]);

  // --- Helper to get month name ---
  const getMonthName = (date) => {
      if(!date) return 'Unknown';
      const d = new Date(date);
      return d.toLocaleString('default', { month: 'short' });
  };

  // --- Aggregate Monthly Tokens (Last 6 Months) ---
  const monthlyMap = {};
  
  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = d.toLocaleString('default', { month: 'short' });
    monthlyMap[monthKey] = 0;
  }

  // Helper to add points to the map
  const addPoints = (date, points) => {
      const m = getMonthName(date);
      if (monthlyMap[m] !== undefined) {
          monthlyMap[m] += points;
      }
  };

  // --- Calculate Points Source Breakdown ---
  let transportPoints = 0;
  let electricPoints = 0;
  let solarPoints = 0;
  let plantationPoints = 0;

  // 1. Transport Points
  vehicleRuns.forEach(run => {
      // Logic: 5 points per KM if green, else 0 (simplified for graph representation)
      // Since we don't store "points earned" per run explicitly in the schema yet, we infer.
      // Or we can just use totalKMCovered * 2 as an estimate for display.
      const p = Math.floor((run.currentMonthKMCover || 0) * 2); 
      addPoints(run.updatedAt || run.createdAt, p);
      transportPoints += p;
  });

  // 2. Electricity Points
  electricBills.forEach(bill => {
      const p = 50; // Flat points per submission
      addPoints(bill.createdAt, p);
      electricPoints += p;
  });

  // 3. Solar Points
  solarData.forEach(s => {
      // (Gen - Charged) / 5
      const net = Math.max(0, (s.unitsGenerated || 0) - (s.unitsCharged || 0));
      const p = Math.floor(net / 5);
      addPoints(s.createdAt, p);
      solarPoints += p;
  });

  // 4. Plantation Points
  forestationData.forEach(f => {
      const p = 50 * (f.totalPlants || 1);
      addPoints(f.updatedAt || f.createdAt, p);
      plantationPoints += p;
  });


  // Format for Frontend Graph
  const monthlyTokens = Object.keys(monthlyMap).map(key => ({
      month: key,
      tokens: monthlyMap[key]
  }));

  const activityBreakdown = [
      { name: 'Transport', value: transportPoints },
      { name: 'Electricity', value: electricPoints },
      { name: 'Solar', value: solarPoints },
      { name: 'Plantation', value: plantationPoints },
  ].filter(i => i.value > 0);

  if(activityBreakdown.length === 0) {
      activityBreakdown.push({ name: 'No Activity', value: 1 });
  }

  // 8. Calculate total (lifetime) stats
  const totalKMDriven = vehicleRuns.reduce(
    (sum, run) => sum + run.totalKMCovered,
    0
  );
  
  // 9. Current Month Stats
  const monthlyElec = electricBills.filter(b => new Date(b.createdAt) >= firstDayOfMonth);
  const monthlyElecUnits = monthlyElec.reduce((sum, bill) => sum + bill.unitsUsed, 0);

  // 10. Response
  const dashboardData = {
    // --- User Profile ---
    profile: {
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      trustLevel: user.trustLvl,
      badges: user.badges,
      address: user.addressId, 
    },

    // --- Key Metrics ---
    totalGreenTokens: user.greenTokens, // Real total from DB
    currentCarbonFootprint: user.carbonFootprint,

    // --- Graphs Data ---
    monthlyTokens,
    activityBreakdown,

    // --- Other Stats ---
    monthlyStats: {
      kmDriven: transportPoints, // Using points as proxy or just recalculate KM
      elecUnitsLogged: monthlyElecUnits,
    },

    // --- User's Assets ---
    vehicles: vehicles,
  };

  // 11. Calculate Submissions & Impact Stats
  // Note: Solar and Forestation are single-document summaries, so we count them as 1 "active submission" stream each. 
  // Electricity bills are individual documents, so we count them all.
  const totalSubmissions = 
      vehicles.length + 
      (solarData.length > 0 ? 1 : 0) + 
      (forestationData.length > 0 ? 1 : 0) + 
      electricBills.length; // + vehicleRuns.length (1 per vehicle, so covered by vehicles.length roughly)

  const treesPlanted = forestationData.length > 0 ? forestationData[0].totalPlants : 0;

  // CO2 Saved Estimation
  // 1. Trees: ~21kg per year per tree
  const treeSavings = treesPlanted * 21; 

  // 2. Solar: ~0.85kg per kWh generated
  const solarUnits = solarData.length > 0 ? (solarData[0].totalSolarUnitsUsed || 0) : 0;
  const solarSavings = solarUnits * 0.85;

  // 3. EV: ~0.12kg saved per km (vs ICE average)
  let evSavings = 0;
  vehicles.forEach(v => {
      if(v.isEV) {
          const run = vehicleRuns.find(r => r.vehicleID.toString() === v._id.toString());
          if(run) {
              evSavings += (run.totalKMCovered || 0) * 0.12;
          }
      }
  });

  const co2Saved = Math.round(treeSavings + solarSavings + evSavings);

  // Add to response
  dashboardData.totalSubmissions = totalSubmissions;
  dashboardData.treesPlanted = treesPlanted;
  dashboardData.co2Saved = co2Saved;

  // 11. Return a response
  return res
    .status(200)
    .json(
      new ApiResponse(200, dashboardData, "Dashboard data fetched successfully")
    );
});