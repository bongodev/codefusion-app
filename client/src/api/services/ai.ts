import http from "../../config/http";
import type { AnalyzeRequest } from "../../types";

export const analyzeNote = async (payload: AnalyzeRequest) => {
  const response = await http.post("/api/ai/analyze", payload, {
    timeout: 3 * 60 * 1000, // 3 minutes
  });
  return response.data;
};
