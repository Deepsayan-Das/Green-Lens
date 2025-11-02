import mongoose from "mongoose";

const { Schema } = mongoose;

// 🧍 USER
const userSchema = new Schema(
  {
    // ID from Clerk's database.
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    // Get from Clerk
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String },

    adhaar: { type: String, required: true, unique: true },
    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
    ph1: { type: String, required: true },
    ph2: { type: String },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    greenTokens: { type: Number, default: 0 },
    badges: [{ type: String }],
    trustLvl: { type: Number, min: 0, max: 100, default: 0 },
    carbonFootprint: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🏠 ADDRESS
const addressSchema = new Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    nationality: { type: String },
    pinCode: { type: String, required: true },
    carpetArea: { type: String },
    homeType: {
      type: String,
      enum: ["House", "Apartment", "Bungalow", "Other"],
    },
    tenure: {
      type: String,
      enum: ["Owned", "Rented"],
      default: "Owned",
    },
    storey: { type: Number },
    floorNo: { type: String },
  },
  { timestamps: true }
);

// ⚡ ELECTRICITY USAGE
const electricityUsageSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bill: { type: Number },
    month: { type: String },
    unitsUsed: { type: Number, required: true },
    unitsCharged: { type: Number, default: 0 },
    hasSolarPanels: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ☀ SOLAR
const solarSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purchaseBill: { type: Number }, 
    modelName: { type: String }, 
    powerRating: { type: Number }, 
    totalSolarUnitsUsed: { type: Number, default: 0 },
    
    lastGenerationBill: { type: String }, 
  },
  { timestamps: true }
);

// 🚗 VEHICLE
const vehicleSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isEV: {
      type: Boolean,
      required: true,
    },
    batteryCapacity: { type: Number, default: 0 },
    verificationDocs: { type: String },
    modelName: { type: String },
    company: { type: String },
    type: {
      type: String,
      enum: [
        "Car",
        "Scooter",
        "Motorcycle",
        "E-Bike",
        "Bicycle",
        "Three-Wheeler",
        "Other",
      ],
    },
  },
  { timestamps: true }
);

// 🚘 VEHICLE RUN
const vehicleRunSchema = new Schema(
  {
    vehicleID: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
    },
    lastOdometer: { type: Number, default: 0 },
    currentMonthKMCover: { type: Number, default: 0 },
    currentMonthStartDate: { type: Date, default: () => new Date() },
    pastMonthKMCover: { type: Number, default: 0 },
    totalKMCovered: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// 🌱 FORESTATION
const forestationSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalPlants: { type: Number, default: 0 },

    // --- Details of the *last* planting event ---
    lastPic: { type: String },
    lastLocation: { type: String },
    lastSpecies: { type: [String] }, 
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);
export const ElectricityUsage =
  mongoose.models.ElectricityUsage ||
  mongoose.model("ElectricityUsage", electricityUsageSchema);
export const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export const Solar =
  mongoose.models.Solar || mongoose.model("Solar", solarSchema);
export const VehicleRun =
  mongoose.models.VehicleRun || mongoose.model("VehicleRun", vehicleRunSchema);
export const Forestation =
  mongoose.models.Forestation ||
  mongoose.model("Forestation", forestationSchema);
