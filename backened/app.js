import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import short_url from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config();
const app = express();
const _dirname = path.resolve();

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Standard middleware
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development frontend
    'http://localhost:5000',  // Local development backend
    'https://your-render-app-name.onrender.com', // Render domain
    process.env.FRONTEND_URL || '*' // Allow configurable frontend URL or any origin in production
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);

// API routes
app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", short_url);

// Serve the frontend as static files
const distPath = path.join(_dirname, "frontened/dist");
app.use(express.static(distPath));

// Short URL redirect route - with regex validation in the handler
app.get("/:id", (req, res, next) => {
  const { id } = req.params;
  if (/^[a-zA-Z0-9]{1,10}$/.test(id)) {
    return redirectFromShortUrl(req, res, next);
  }
  next();
});

// For any other route, send the index.html file
app.get((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
}); 

// GET - Redirection
// POST - Create short url
