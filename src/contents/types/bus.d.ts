export interface Root {
  update: string;
  timesheet: Timesheet[];
  calendar: Calendar[];
  site_info: SiteInfo[];
}

export interface Timesheet {
  status: string;
  edit_time: string;
  up_time: string;
  title: string;
  ts_id: string;
  back_color: string;
  text1: string;
  text2: string;
  text3: string;
  cal_text: string;
  double_line: string;
  list: List[];
}

export interface List {
  bus_left: BusLeft;
  train_left: TrainLeft;
  time: string;
  train_right: TrainRight;
  bus_right: BusRight;
}

export interface BusLeft {
  num1: string;
  memo1: string;
  num2: string;
  memo2: string;
}

export interface TrainLeft {
  num1: string;
  memo1: string;
  num2: string;
  memo2: string;
}

export interface TrainRight {
  num1: string;
  memo1: string;
  num2: string;
  memo2: string;
}

export interface BusRight {
  num1: string;
  memo1: string;
  num2: string;
  memo2: string;
}

export interface Calendar {
  status: string;
  edit_time: string;
  up_time: string;
  title: string;
  year: string;
  month: string;
  text1: string;
  list: List2[];
}

export interface List2 {
  day: string;
  ts_id: string;
  comment: string;
}

export interface SiteInfo {
  status: string;
  up_time: string;
  title: string;
  info_view: string;
  info_title: string;
  info_text: string;
  will: Will;
}

export interface Will {
  up: Up[];
  down: Down[];
}

export interface Up {
  mark: string;
  name: string;
  tip: string;
}

export interface Down {
  mark: string;
  name: string;
  tip: string;
}

export type BusDirection = "bus_left" | "bus_right";

export type TrainDirection = "train_left" | "train_right";
