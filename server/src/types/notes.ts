export type Note = {
  _id: string;
  title: string;
  content: string; // Markdown content
  summary: string; // User-provided summary
  keyPoints: string[]; // User-provided key points
  tags: string[]; // User-provided tags
  sentiment: {
    score: number; // User-provided score (-1 to 1)
    label: "positive" | "negative" | "neutral"; // User-provided label
  };
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateNoteRequest = Omit<
  Note,
  "_id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateNoteRequest = Partial<Note> & {
  _id: string;
};

export type SearchRequest = {
  query?: string; // full-text search across content, summary, keyPoints
  tags?: string[]; // filter by user-provided tags
  sentiment?: "positive" | "negative" | "neutral"; // sentiment filtering
  sortBy?: "relevance" | "date" | "title"; // sorting options
  page?: number; // pagination page number (default: 1)
  limit?: number; // items per page (default: 20)
  dateRange?: {
    from?: Date;
    to?: Date;
  };
};

export type SearchResponse = {
  notes: Note[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
