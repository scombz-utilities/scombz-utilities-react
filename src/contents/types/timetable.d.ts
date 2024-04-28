export type TimeTableData = {
  day: number;
  time: number;
  id?: string;
  name: string;
  classroom?: string;
  teacher?: string[];
  termYear?: number;
  termPhase?: number;
};

export type TimeTable = TimeTableData[];
