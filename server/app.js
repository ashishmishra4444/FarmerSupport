import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import { optionalAuth } from "./middleware/authMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(optionalAuth);

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);
