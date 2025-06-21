import { useMutation } from "@tanstack/react-query";
import { noteServices } from "../services";

export const useCreateNoteMutation = () => {
  return useMutation({
    mutationFn: noteServices.createNote,
  });
};
