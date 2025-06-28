export type AnalyzeRequest = {
  title: string;
  note: string;
};

export type AnalyzeResponse = {
  summary: string;
  tag: string;
  sentiment: {
    label: string;
    score: number;
  };
};
