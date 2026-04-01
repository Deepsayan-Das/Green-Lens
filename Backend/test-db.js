import mongoose from 'mongoose';
import { User, ElectricityUsage } from './src/models/models.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(`${process.env.MONGODB_URI}/GreenLens`);
  console.log('Connected to DB');
  
  const users = await User.find({});
  console.log("Users:", users.map(u => ({ Objectid: u._id, name: u.fullName, email: u.email, greenTokens: u.greenTokens, clerkId: u.clerkId })));
  
  const bills = await ElectricityUsage.find({});
  console.log("Electricity Bills:", bills.map(b => ({ userID: b.userID, month: b.month, unitsUsed: b.unitsUsed, createdAt: b.createdAt })));
  
  process.exit(0);
}
run();
