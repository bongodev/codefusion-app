export type CreateNoteRequest = {
  title: string;
  content: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  sentiment: {
    score: number;
    label: "positive" | "negative" | "neutral";
  };
};

export type SentimentLabel = "positive" | "negative" | "neutral";
