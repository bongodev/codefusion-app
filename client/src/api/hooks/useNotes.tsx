import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { noteServices } from "../services";
import type { SearchRequest } from "../../types";

const NOTE_SEARCH_QUERY_KEY = "note-search-query-key";

export const useNoteSearch = (searchPayload: SearchRequest) => {
  const query = useQuery({
    queryKey: [NOTE_SEARCH_QUERY_KEY, searchPayload],
    queryFn: () => noteServices.searchNotes(searchPayload),
  });

  return {
    noteSearchQuery: query,
  };
};

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noteServices.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTE_SEARCH_QUERY_KEY] });
    },
  });
};
