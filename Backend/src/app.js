import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// --- Initialize app ---
const app = express();

// --- Core Middlewares ---
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", process.env.CORS_ORIGIN],
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" })); // limit for JSON body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // handle form data
app.use(express.static("public")); // assets
app.use(cookieParser());

// --- Import Routes ---
import userRouter from "./routes/user.routes.js";
import storeRouter from "./routes/store.routes.js";
import formRouter from "./routes/submit.routes.js";

// --- Route Declarations ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/form", formRouter);

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.send("GreenLens backend running successfully!");
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

// --- Export app ---
export { app };
