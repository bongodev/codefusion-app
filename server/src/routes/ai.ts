import axios from "axios";
import express, { type Request, type Response } from "express";

import envConfig from "../config/envConfig";
import { AnalyzeRequest, AnalyzeResponse } from "../types";

const router = express.Router();

router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { title, note }: AnalyzeRequest = req.body;
    if (!title || !note) {
      return res.status(400).json({ error: "Title and note are required" });
    }

    const response = await axios.post<AnalyzeResponse>(
      envConfig.AI_SERVICE_URL,
      {
        title,
        note,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": envConfig.AI_API_KEY,
        },
        timeout: 3 * 60 * 1000, // 3 minutes
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
