import type { Task } from "../types/task";
import type { TimeTable } from "../types/timetable";

type Subject = {
  name: string;
  url: string;
};

/* Settings */
export type Settings = {
  clickLogin: boolean;
  loginData: {
    username: string;
    password: string;
  };
  notifySurveySubjects: Subject[];
  autoAdfs: boolean;
  hideSideMenu: boolean;
  styleSideMenu: boolean;
  displayClassroom: boolean; // 常に教室を表示する
  displayTime: boolean; // 常に開始終了時間を表示する
};
export const defaultSettings: Settings = {
  clickLogin: true,
  loginData: {
    username: "",
    password: "",
  },
  notifySurveySubjects: [],
  autoAdfs: true,
  hideSideMenu: true,
  styleSideMenu: true,
  displayClassroom: false,
  displayTime: true,
};

/* ScombzData */
export type ScombzData = {
  beforeLoginOshirase: string;
  lastTaskFetchUnixTime: number;
  timetable: TimeTable;
  tasklist: Task[];
  surveyList: Task[];
};
export const defaultScombzData: ScombzData = {
  beforeLoginOshirase: "",
  lastTaskFetchUnixTime: 0,
  timetable: [],
  tasklist: [],
  surveyList: [],
};

/* Saves */
export type Saves = {
  settings: Settings;
  scombzData: ScombzData;
};
export const defaultSaves: Saves = {
  settings: defaultSettings,
  scombzData: defaultScombzData,
};
