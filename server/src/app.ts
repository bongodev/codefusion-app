import express from "express";
import helmet from "helmet";
import cors from "cors";

import envConfig from "./config/envConfig";
import connectDB from "./db";
import { requestLogger } from "./middlewares";

// import noteRoutes from "./routes/notes";

const app = express();

connectDB();

// Security and CORS middleware
app.use(helmet());
app.use(
  cors({
    origin: envConfig.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// app.use("/api/notes", noteRoutes);

app.listen(envConfig.PORT, () => {
  console.log(`Server is running on PORT ${envConfig.PORT}`);
});
