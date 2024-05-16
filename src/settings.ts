import type { CalEvent } from "./contents/types/calender";
import type { Subject } from "./contents/types/subject";
import type { Task } from "./contents/types/task";
import type { TimeTable } from "./contents/types/timetable";
import type { List as BusList } from "~contents/types/bus";
import type { Widget } from "~contents/types/widget";

export type Faculty = "din" | "arc" | "dsn" | "sys" | "ko1";

/* Settings */
export type Settings = {
  clickLogin: boolean;
  loginData: {
    username: string;
    password: string;
  };
  popupBadge: boolean;
  removeAttendance: "none" | "only" | "all";
  notifySurveySubjects: Subject[];
  autoAdfs: boolean;
  autoFillSgsot: boolean;
  hideSideMenu: boolean;
  styleSideMenu: boolean;
  styleDialog: boolean;
  styleSurveys: boolean;
  styleExam: boolean;
  useSubTimeTable: boolean;
  useTaskList: boolean;
  widgetOrder: Widget[];
  columnCount: 1 | 2;
  forceNarrowTimeTable: boolean;
  displayClassroom: boolean; // 常に教室を表示する
  displayTime: boolean; // 常に開始終了時間を表示する
  timeTableTopDate: "date" | "time" | false; // 時間割の上部に表示する日付
  highlightToday: boolean; // 今日の日付をハイライトする(TimeTable)
  highlightTask: boolean; // タスクを色でハイライトする
  deadlineMode: "relative" | "absolute"; // 締切表示モード
  deadlineFormat: string; // 締切表示フォーマット(yyyy/MM/dd HH:mm)
  changeReportBtn: boolean; // レポート提出ボタンを変更する
  hiddenTaskIdList: string[]; // 非表示課題IDリスト
  taskListRowsPerPage: number;
  sliderBarMax: number;
  timesBtnValue: number;
  defaultInputName: string;
  faculty: Faculty | null;
  lms: {
    showClassroom: boolean;
    centering: boolean;
    hideNoClassDay: boolean;
  };
  updateClear: boolean;
  dragAndDropBugFix: boolean;
  forceDragAndDropSubmit: boolean;
  downloadFileBundle: boolean;
  hideCompletedReports: boolean;
  signOutPageLayout: boolean;
  layout: {
    maxWidthPx: {
      subj: number;
      lms: number;
      task: number;
    };
    setMaxWidth: boolean;
    removePageTop: boolean;
    removeDirectLink: boolean;
    topPageLayout: boolean;
    clickToHideName: boolean;
    linkify: boolean;
  };
  modifyCoursePageTitle: boolean;
  modifyClickableLinks: boolean; // リンクの右クリック、中クリックを発火させる
  markdownNotePad: boolean;
  syllabus: {
    faculty: Faculty | null;
    enterYear: string | null;
    division: string | null;
    keiretu: string | null;
  };
  headLinkTo: string;
  customCSS: string;
  originalLinks: { title: string; url: string }[];
  createSyllabusButton: boolean;
  sortSubjectByOrder: boolean;
  subjectOrder: string[];
  materialSortOrder: "asc" | "desc" | false;
  hideMaterial: boolean;
  autoHideMaterial: "all" | "recent" | false;
};

export const defaultSettings: Settings = {
  clickLogin: true,
  loginData: {
    username: "",
    password: "",
  },
  popupBadge: true,
  removeAttendance: "none",
  notifySurveySubjects: [],
  autoAdfs: true,
  autoFillSgsot: true,
  hideSideMenu: true,
  styleSideMenu: true,
  styleDialog: true,
  styleSurveys: true,
  styleExam: true,
  useSubTimeTable: true,
  useTaskList: true,
  widgetOrder: ["Bus", "UserMemo"],
  columnCount: 2,
  forceNarrowTimeTable: false,
  displayClassroom: false,
  displayTime: true,
  timeTableTopDate: "date",
  highlightToday: true,
  highlightTask: true,
  deadlineMode: "relative",
  deadlineFormat: "yyyy/MM/dd HH:mm",
  changeReportBtn: true,
  hiddenTaskIdList: [],
  taskListRowsPerPage: 5,
  sliderBarMax: 600,
  timesBtnValue: 0,
  defaultInputName: "AA00000_山田太郎",
  faculty: null,
  lms: {
    showClassroom: true,
    centering: true,
    hideNoClassDay: true,
  },
  updateClear: false,
  dragAndDropBugFix: true,
  forceDragAndDropSubmit: false,
  downloadFileBundle: true,
  hideCompletedReports: true,
  signOutPageLayout: true,
  layout: {
    maxWidthPx: {
      subj: 1280,
      lms: 1280,
      task: 1280,
    },
    setMaxWidth: true,
    removePageTop: true,
    removeDirectLink: true,
    topPageLayout: true,
    clickToHideName: true,
    linkify: true,
  },
  modifyCoursePageTitle: true,
  modifyClickableLinks: true,
  markdownNotePad: true,
  syllabus: {
    faculty: null,
    enterYear: null,
    division: null,
    keiretu: null,
  },
  headLinkTo: "/portal/home",
  customCSS: "",
  originalLinks: [],
  createSyllabusButton: true,
  sortSubjectByOrder: false,
  subjectOrder: [
    "message",
    "information",
    "report",
    "courseContent",
    "examination",
    "questionnaire",
    "discussion",
    "attendance",
    "ltiExternalToolLink",
  ],
  materialSortOrder: false,
  hideMaterial: true,
  autoHideMaterial: false,
};

/* ScombzData */
export type ScombzData = {
  beforeLoginOshirase: string;
  lastTaskFetchUnixTime: number;
  timetable: TimeTable;
  tasklist: Task[];
  surveyList: Task[];
  originalTasklist: Task[];
  sideMenuMemo: string[];
  coursePageMemo: { id: string; memo: string; course?: string }[];
  doMigration: boolean;
  scombzCalendar: CalEvent[];
  lastCalendarFetchUnixTime: number;
  busList: BusList[];
  lastBusFetchUnixTime: number;
};
export const defaultScombzData: ScombzData = {
  beforeLoginOshirase: "",
  lastTaskFetchUnixTime: 0,
  timetable: [],
  tasklist: [],
  surveyList: [],
  originalTasklist: [],
  sideMenuMemo: [],
  coursePageMemo: [],
  doMigration: false,
  scombzCalendar: [],
  lastCalendarFetchUnixTime: 0,
  busList: [],
  lastBusFetchUnixTime: 0,
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
