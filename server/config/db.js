import mongoose from "mongoose";

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection || mongoose.connection.readyState === 1) {
    return cachedConnection || mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    cachedConnection = null;
    throw error;
  }
};
