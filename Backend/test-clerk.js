import dotenv from 'dotenv';
dotenv.config();

import { createClerkClient } from "@clerk/clerk-sdk-node";

async function run() {
  console.log("Checking Clerk SDK");
  try {
    const clerkClient = createClerkClient({ 
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY 
    });
    
    console.log("clerkClient properties:", Object.keys(clerkClient));
    if (clerkClient.users) {
      console.log("clerkClient.users properties:", Object.keys(clerkClient.users));
    }
    
    // Test with a dummy ID to see if it makes a network request and throws 404 (success!) 
    // or throws a TypeError because users is undefined.
    await clerkClient.users.getUser("user_dummy123");
  } catch (e) {
     console.error("Caught error:", e.message);
  }
}
run();
