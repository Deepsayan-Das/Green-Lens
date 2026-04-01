import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import { logElectricityBill } from "../controllers/electricity.controller.js";
import { logSolarGeneration } from "../controllers/solar.controller.js";
import { logTrip } from "../controllers/trip.controller.js";
// import { logGreenPurchase } from "../controllers/purchase.controller.js";
import { logPlanting } from "../controllers/plantation.controller.js";

const router = Router();
router.use(authMiddleware);

// Backend controllers
router.route("/electricity").post(upload.single("billImage"), logElectricityBill); // For /electricity-form
router.route("/solar").post(upload.single("solarBillProof"), logSolarGeneration); // For /solar-form (multer used here)
router.route("/transport").post(logTrip); // For /transport-form
// router.route("/purchase").post(logGreenPurchase); // For /purchase-form
router.route("/plantation").post(upload.single("plantImage"), logPlanting); // For /plantation-form (multer used here)

export default router;
