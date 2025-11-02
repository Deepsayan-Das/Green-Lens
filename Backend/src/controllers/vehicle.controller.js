import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
// Use the named imports from your models.js file
import { User, Vehicle, VehicleRun } from "../models/models.js";
import axios from "axios";


export const handleTransportForm = asyncHandler(async (req, res) => {
  // 1. Get User ID
  const clerkId = req.auth.userId;
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const {
    isEv, // boolean
    vehicleType, // "4 Wheeler", "2 Wheeler", "Cycle", "Public Transport"
    kmCovered, // For public/cycle trips
    vehicleNumber, // For personal vehicles
    odometerReading, // For personal vehicles
    vehicleModel, // Form field for "Vehicle Model"
    batteryCapacity, // Form field for "Battery Capacity"
  } = req.body;

  if (!vehicleType) {
    throw new ApiError(400, "Vehicle type is required.");
  }

  // --- 2. LOGIC PATH A: Public Transport or Cycle ---
  // These types don't create a saved vehicle. They just log a trip.
    if (vehicleType === "Public Transport" || vehicleType === "Cycle") {
    const numDistance = Number(kmCovered);
    if (!numDistance || numDistance <= 0) {
      throw new ApiError(400, "A valid distance (kmCovered) is required.");
    }

    // Call ML API
    const mlResponse = await axios.post(
      `${process.env.ML_API_URL}/calculate-travel`,
      {
        // Translate form "Cycle" to model "Bicycle" for the ML API
        vehicle_type: vehicleType === "Cycle" ? "Bicycle" : "Public Transport",
        kmCovered: numDistance,
      }
    );
    const { user_co2_footprint_kg, tokens_awarded } = mlResponse.data;

    // Update user tokens
    user.greenTokens += tokens_awarded;
    await user.save({ validateBeforeSave: false });

    // Return success
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          distanceLogged: numDistance,
          tokensEarned: tokens_awarded,
          co2Footprint: user_co2_footprint_kg,
          newTotalTokens: user.greenTokens,
        },
        "Travel logged successfully"
      )
    );
  }

  // --- 3. LOGIC PATH B: Personal Vehicle (4 Wheeler / 2 Wheeler) ---
  // Validate required fields for this path
  if (!vehicleNumber || odometerReading === undefined) {
    throw new ApiError(
      400,
      "Vehicle Number and Odometer Reading are required."
    );
  }
  const numOdometer = Number(odometerReading);

  // Check if this vehicle already exists for this user
  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: vehicleNumber,
    userID: user._id,
  });

  // --- 3a. If Vehicle EXISTS: Run UPDATE ODOMETER logic ---
  if (existingVehicle) {
    const run = await VehicleRun.findOne({ vehicleID: existingVehicle._id });
    if (!run) {
      throw new ApiError(404, "Vehicle run data not found. Please re-add the vehicle.");
    }

    // Validate odometer
    if (numOdometer < run.lastOdometer) {
      throw new ApiError(
        400,
        `Odometer reading must be higher than the last one (${run.lastOdometer} km).`
      );
    }

    const distanceForThisTrip = numOdometer - run.lastOdometer;
    if (distanceForThisTrip === 0) {
      return res.status(200).json(new ApiResponse(200, null, "No new distance logged."));
    }

    // Call ML API
    const mlResponse = await axios.post(
      `${process.env.ML_API_URL}/calculate-travel`,
      {
        vehicle_type: existingVehicle.type, // Use the *saved* type (e.g., "Car")
        kmCovered: distanceForThisTrip,
      }
    );

    const { user_co2_footprint_kg, tokens_awarded } = mlResponse.data;

    // Handle Month Rollover logic
    const today = new Date();
    const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let pastMonthTotal = run.pastMonthKMCover;
    let currentMonthTotal = run.currentMonthKMCover;

    if (run.currentMonthStartDate < firstDayOfThisMonth) {
      pastMonthTotal = run.currentMonthKMCover;
      currentMonthTotal = distanceForThisTrip;
    } else {
      currentMonthTotal += distanceForThisTrip;
    }

    // Update Run document
    run.lastOdometer = numOdometer;
    run.totalKMCovered += distanceForThisTrip;
    run.currentMonthKMCover = currentMonthTotal;
    run.pastMonthKMCover = pastMonthTotal;
    run.currentMonthStartDate = firstDayOfThisMonth;
    await run.save();

    // Update User tokens
    user.greenTokens += tokens_awarded;
    await user.save({ validateBeforeSave: false });

    // Return success
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          distanceLogged: distanceForThisTrip,
          tokensEarned: tokens_awarded,
          co2Footprint: user_co2_footprint_kg,
          newTotalTokens: user.greenTokens,
        },
        "Odometer updated successfully"
      )
    );
  }

  // 3b. Vehicle NEW: Run ADD VEHICLE logic
  else {
    // Validation
    if (!vehicleModel) {
      throw new ApiError(400, "Vehicle Model is required to add a new vehicle.");
    }
    if (isEv === undefined) {
      throw new ApiError(400, "Please specify if the vehicle is EV or Non-EV.");
    }

    // Translate "4 Wheeler" -> "Car", "2 Wheeler" -> "Scooter"
    const mappedVehicleType =
      vehicleType === "4 Wheeler"
        ? "Car"
        : "Scooter"; // Defaulting 2-wheeler to Scooter

    // Create the new Vehicle
    const newVehicle = await Vehicle.create({
      userID: user._id,
      isEV: isEv, // Save the boolean directly
      modelName: vehicleModel, // Map form's `vehicleModel` to schema's `modelName`
      type: mappedVehicleType, // Save the mapped type
      vehicleNumber: vehicleNumber,
      // `company` and `verificationDocs` are not on the form, so they are omitted
    });

    // Create the corresponding VehicleRun
    await VehicleRun.create({
      vehicleID: newVehicle._id,
      lastOdometer: numOdometer,
      totalKMCovered: 0,
      currentMonthKMCover: 0,
      pastMonthKMCover: 0,
      currentMonthStartDate: new Date(),
    });

    // Return success (no tokens are awarded for just *adding* a vehicle)
    return res
      .status(201)
      .json(
        new ApiResponse(201, { vehicle: newVehicle }, "Vehicle added successfully")
      );
  }
});










































































// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { User } from "../models/models.js";
// import { Vehicle } from "../models/models.js";
// import { VehicleRun } from "../models/models.js";
// import axios from "axios"; // Make sure to import axios

// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { User } from "../models/models.js";
// import { Vehicle } from "../models/models.js";
// import { VehicleRun } from "../models/models.js";
// import axios from "axios"; // Make sure to import axios

// export const addVehicle = asyncHandler(async (req, res) => {
//   // 1. Get vehicle type, odometer, user ID
//   const { type, initialOdometer } = req.body;
//   const clerkId = req.auth.userId;

//   // 2. Validate the input
//   if (!type || !type.trim()) {
//     throw new ApiError(400, "Vehicle type is required.");
//   }
//   const numOdometer = Number(initialOdometer);
//   if (initialOdometer === undefined || isNaN(numOdometer) || numOdometer < 0) {
//     throw new ApiError(400, "A valid non-negative initial odometer reading is required.");
//   }

//   // 3. Find the user in the DB
//   const user = await User.findOne({ clerkId });
//   if (!user) {
//     throw new ApiError(404, "User not found.");
//   }

//   // 4. Create the new Vehicle document
//   const newVehicle = await Vehicle.create({
//     userID: user._id,
//     type: type,
//   });

//   if (!newVehicle) {
//     throw new ApiError(500, "Failed to create vehicle record in the database.");
//   }

//   // 5. Create the corresponding VehicleRun document to track its stats
//   let newRun;
//   try {
//     newRun = await VehicleRun.create({
//       vehicleID: newVehicle._id,
//       lastOdometer: numOdometer,
//       totalKMCovered: 0,
//       currentMonthKMCover: 0,
//       pastMonthKMCover: 0,
//       currentMonthStartDate: new Date(), // Initialize the tracking month
//     });
//   } catch (error) {
//     await Vehicle.findByIdAndDelete(newVehicle._id);
//     console.error("Failed to create VehicleRun:", error);
//     throw new ApiError(500, "Failed to initialize vehicle run data.");
//   }

//   // 6. Return a success response
//   return res
//     .status(201)
//     .json(
//       new ApiResponse(
//         201,
//         { vehicle: newVehicle, run: newRun },
//         "Vehicle added successfully"
//       )
//     );
// });

// export const updateVehicleOdometer = asyncHandler(async (req, res) => {
//   // 1. Get data, user ID 
//   const { vehicleID, newOdometer } = req.body;
//   const clerkId = req.auth.userId;

//   // 2. Find the user in the DB
//   const user = await User.findOne({ clerkId });
//   if (!user) throw new ApiError(404, "User not found.");

//   // 3. Find the vehicle and its run data
//   const vehicle = await Vehicle.findById(vehicleID);
//   const run = await VehicleRun.findOne({ vehicleID: vehicleID });

//   // 4. Validate that records
//   if (!vehicle || !run) throw new ApiError(404, "Vehicle record not found.");
//   if (vehicle.userID.toString() !== user._id.toString()) {
//     throw new ApiError(403, "You do not own this vehicle.");
//   }

//   // 5. Validate the new odometer reading
//   if (newOdometer < run.lastOdometer) {
//     throw new ApiError(
//       400,
//       `Odometer reading must be higher than the last one (${run.lastOdometer} km).`
//     );
//   }

//   // 6. Calculate the distance for this specific trip
//   const distanceForThisTrip = newOdometer - run.lastOdometer;

//   // 7. If no distance was covered, return early
//   if (distanceForThisTrip === 0) {
//     return res
//       .status(200)
//       .json(new ApiResponse(200, null, "No new distance logged."));
//   }

//   // 8. Call the FastAPI ML Service
//   let mlResponse;
//   try {
//     const payload = {
//       vehicle_type: vehicle.type,
//       kmCovered: distanceForThisTrip,
//     };
//     mlResponse = await axios.post(
//       `${process.env.ML_API_URL}/calculate-travel`,
//       payload
//     );
//   } catch (error) {
//     console.error("ML API Error:", error.message);
//     throw new ApiError(500, "ML service is unavailable");
//   }

//   // 9. Process the response from the ML service
//   const { user_co2_footprint_kg, tokens_awarded } = mlResponse.data;

//   // 10. Get date boundaries for monthly tracking
//   const today = new Date();
//   const firstDayOfThisMonth = new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     1
//   );

//   // 11. Handle the "Month Rollover" logic
//   let pastMonthTotal = run.pastMonthKMCover;
//   let currentMonthTotal = run.currentMonthKMCover;

//   if (run.currentMonthStartDate < firstDayOfThisMonth) {
//     // It's a new month.
//     pastMonthTotal = run.currentMonthKMCover; // Archive the old "current" total
//     currentMonthTotal = distanceForThisTrip; // Start the new month's total
//   } else {
//     // It's still the same month.
//     currentMonthTotal += distanceForThisTrip; // Add to the current total
//   }

//   // 12. Update the VehicleRun document with new totals
//   run.lastOdometer = newOdometer;
//   run.totalKMCovered += distanceForThisTrip;
//   run.currentMonthKMCover = currentMonthTotal;
//   run.pastMonthKMCover = pastMonthTotal;
//   run.currentMonthStartDate = firstDayOfThisMonth; // Set/update the start date
//   await run.save();

//   // 13. Update the User's token balance
//   user.greenTokens += tokens_awarded;
//   await user.save({ validateBeforeSave: false });

//   // 14. Return a successful response with all the new data
//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         distanceLogged: distanceForThisTrip,
//         tokensEarned: tokens_awarded,
//         co2Footprint: user_co2_footprint_kg,
//         newTotalTokens: user.greenTokens,
//       },
//       "Odometer updated successfully"
//     )
//   );
// });
