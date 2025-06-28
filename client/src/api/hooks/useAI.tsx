import { useMutation } from "@tanstack/react-query";
import { aiServices } from "../services";

export const useAnalyzeNoteMutation = () => {
  return useMutation({
    mutationFn: aiServices.analyzeNote,
  });
};
