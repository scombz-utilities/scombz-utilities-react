export type CalEvent = {
  description: string;
  start: number;
  end: number;
  summary: string;
  uid: string;
  startDate?: Date;
  endDate?: Date;
};

export type Holiday = {
  start: string; // yyyy-mm-dd
  end: string; // yyyy-mm-dd
  summary: string;
  description: string;
  uid: string;
};
