import mongoose from "mongoose";
import envConfig from "./config/envConfig";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envConfig.MONGODB_URI, {
      dbName: "note-db",
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
