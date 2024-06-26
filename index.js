// Import necessary modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import routes
import userRoute from "./routes/api/user.js";
import blogRoute from "./routes/api/blog.js";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import refreshTokenRoute from "./routes/refreshToken.js";
import logoutRoute from "./routes/logout.js";
import helpRoute from "./routes/help.js";

// Import middleware
import authMiddleware from "./middleware/authMiddleware.js";
import { logger } from "./middleware/logEvents.js";
import { errorHandler } from "./middleware/errorHandler.js";
import credentials from "./middleware/credentials.js";

// Import CORS module
import cors from "cors";
import corsOptions from "./config/corsOptions.js";

// Import Cookie Parser
import cookieParser from "cookie-parser";

// Import connection to MongoDB
import "./config/databaseConnection.js";
import connectDB from "./config/databaseConnection.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();
const mongoose_db = process.env.MONGODB_URI;

// Built-in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static(join(__dirname, "public")));

// Middleware for parsing cookies
app.use(cookieParser());

// Custom middleware
app.use(logger);

// Credentials middleware
app.use(credentials);

// Third-party middleware --> Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

// Error handler middleware
app.use(errorHandler);

// Routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/refresh", refreshTokenRoute);
app.use("/logout", logoutRoute);
app.use("/help", helpRoute);
app.use("/users", userRoute); // authMiddleware
app.use("/blogs", authMiddleware, blogRoute);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
