import http from "../../config/http";
import type { CreateNoteRequest, SearchRequest } from "../../types";

export const createNote = (payload: CreateNoteRequest) =>
  http.post("/api/notes", payload).then((res) => res.data);

export const searchNotes = (searchPayload: SearchRequest) =>
  http.post("/api/notes/search", searchPayload).then((res) => res.data);
