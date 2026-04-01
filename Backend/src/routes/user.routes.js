import { Router } from "express";
import { getUserDashboard, getLeaderboard } from "../controllers/user.controller.js";
// import { updateUserProfile } from "../controllers/profile.controller.js"; 
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// Route to get all dashboard data
router.route("/dashboard").get(getUserDashboard);

// Route for leaderboard
router.route("/leaderboard").get(getLeaderboard);

// Route for updating the profile
// router.route("/profile").patch(updateUserProfile);

export default router;