import http from "../../config/http";
import type { CreateNoteRequest } from "../../types";

export const createNote = (payload: CreateNoteRequest) =>
  http.post("/api/notes", payload).then((res) => res.data);
