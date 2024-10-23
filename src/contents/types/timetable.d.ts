export type TimeTableData = {
  day: number;
  time: number;
  id?: string;
  name: string;
  classroom?: string;
  teacher?: string[];
  url?: string; // 自作時間割のみ
};

export type TimeTable = TimeTableData[];
