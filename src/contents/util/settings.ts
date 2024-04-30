import type { Subject } from "../types/subject";
import type { Task } from "../types/task";
import type { TimeTable } from "../types/timetable";

/* Settings */
export type Settings = {
  clickLogin: boolean;
  loginData: {
    username: string;
    password: string;
  };
  removeAttendance: "none" | "only" | "all";
  notifySurveySubjects: Subject[];
  autoAdfs: boolean;
  hideSideMenu: boolean;
  styleSideMenu: boolean;
  displayClassroom: boolean; // 常に教室を表示する
  displayTime: boolean; // 常に開始終了時間を表示する
  displayTodayDate: boolean; // 今日の日付を表示する
  highlightToday: boolean; // 今日の日付をハイライトする(TimeTable)
  highlightTask: boolean; // タスクを色でハイライトする
  deadlineMode: "relative" | "absolute"; // 締切表示モード
  deadlineFormat: string; // 締切表示フォーマット(yyyy/MM/dd HH:mm)
  changeReportBtn: boolean; // レポート提出ボタンを変更する
  sliderBarMax: number;
  timesBtnValue: number;
  defaultInputName: string;
};
export const defaultSettings: Settings = {
  clickLogin: true,
  removeAttendance: "none",
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
  displayTodayDate: true,
  highlightToday: true,
  highlightTask: true,
  deadlineMode: "relative",
  deadlineFormat: "yyyy/MM/dd HH:mm",
  changeReportBtn: true,
  sliderBarMax: 600,
  timesBtnValue: 0,
  defaultInputName: "AA00000_山田太郎",
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
