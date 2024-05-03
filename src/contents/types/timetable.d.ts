export type TimeTableData = {
  day: number;
  time: number;
  id?: string;
  name: string;
  classroom?: string;
  teacher?: string[];
};

export type TimeTable = TimeTableData[];
