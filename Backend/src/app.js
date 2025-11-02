import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// --- Initialize app ---
const app = express();

// --- Core Middlewares ---
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
import formRouter from "./routes/form.routes.js";

// --- Route Declarations ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/form", formRouter);

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.send("GreenLens backend running successfully!");
});

// --- Export app ---
export { app };





















































// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "16kb" })); //json limit
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public")); //folder_name for static files
// // app.use(cookieParser());

// // //routes import

// // import userRouter from "./routes/user.routes.js";

// // //routes declaration
// // app.use("/api/v1/users", userRouter);
// // ... other imports
// import userRouter from "./routes/user.routes.js";
// // import vehicleRouter from "./routes/vehicle.routes.js";
// // import plantationRouter from "./routes/plantation.routes.js";
// import storeRouter from "./routes/store.routes.js";

// // ... other middleware (cors, express.json, etc.)

// // --- ROUTES DECLARATION ---
// app.use("/api/v1/users", userRouter);
// // app.use("/api/v1/vehicles", vehicleRouter);
// // app.use("/api/v1/plantation", plantationRouter);
// app.use("/api/v1/store", storeRouter); // 2. Add the new route

// export { app };
