import type { Subject } from "~contents/types/subject";
import { defaultSaves } from "~settings";
import type { Saves } from "~settings";

const oldSavesTemp = {
  mdNotepadData: [],
  TaskGetTime: 0,
  addSubTimetable: true,
  addSurveyListButton: true,
  addTaskDate: [true, false, false, false, false, false, false, true, true],
  addTaskInPage: true,
  addTaskTime: [true, false, false, false, false, true, false, true, false],
  addTaskTimeButton: false,
  adfs: {
    forcelogin: true,
    password: "",
    username: "",
  },
  adfsSkip: true,
  adjustTimetableData: {
    dispClassroom: false,
    erase6: false,
    erase7: false,
    eraseSat: false,
    timetableCentering: false,
  },
  attendance: "none",
  autoTaskInput: true,
  changeLogout: true,
  changeReportBtn: true,
  clickLoginBtn: true,
  customcss: "",
  dadbugFix: true,
  darkmode: "relative",
  ddSubmission: false,
  deadlinemode: "relative-absoluteLong",
  defaultInputName: "AA00000_山田太郎",
  displayName: false,
  displaySubtimetableWhileExam: true,
  downloadFileBundle: true,
  enterAttendance: true,
  exitSidemenu: true,
  exportIcs: true,
  fac: null,
  fixHeadShadow: true,
  gasCal: false,
  gasTodo: true,
  gasURL: "",
  getNewsData: [0, 2],
  headLinkTo: "/portal/home",
  hideCompletedReports: true,
  highlightDeadline: true,
  layoutHome: true,
  manualTasklist: [],
  materialHide: true,
  materialHideDetail: "none",
  materialTop: false,
  materialTopDetail: "first",
  maxTaskDisplay: "5",
  maxWidthPx: {
    lms: "1280",
    subj: "1280",
    task: "1280",
  },
  modifyCoursePageTitle: true,
  mouseDown: true,
  nickname: "",
  notepadData: [],
  notepadMode: true,
  noticeSurvey: [],
  pageTopBtn: true,
  pastSurvey: true,
  pastSurveyList: [],
  popupBadge: true,
  popupDarkenUncountedTasks: true,
  popupOverflowMode: "hidden",
  popupTasksLinks: true,
  popupTasksTab: true,
  popupUncountFutureTaskDays: "365",
  quarterCount: 0,
  remomveDirectLink: true,
  reportHide: false,
  reportHideDetail: "all",
  setMaxWidth: true,
  sliderBarMax: "600",
  specialSubj: 1,
  styleDialog: true,
  styleExamBtn: true,
  styleExamImg: false,
  styleNowPeriod: true,
  styleSidemenu: true,
  subjectList: "12345678",
  surveyListData: "%5B%5D",
  syllBtn: true,
  tasklistData: "%5B%7B%22data%22%3Anull%7D%5D",
  tasklistDisplay: true,
  tasklistTranslate: "0",
  testHide: false,
  testHideDetail: "all",
  timesBtnValue: "mode1",
  timetableData: [],
  undisplayFutureTaskDays: "365",
  updateClear: false,
  urlToLink: true,
  year: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const migrateLogic = (oldSaves: any): Saves => {
  const newSaves = {
    scombzData: {
      ...defaultSaves.scombzData,
      ...(oldSaves?.scombzData ?? {}),
    },
    settings: {
      ...defaultSaves.settings,
      ...(oldSaves?.settings ?? {}),
    },
  } as Saves;

  // ScombZDataの移植
  newSaves.scombzData.lastTaskFetchUnixTime = oldSaves?.TaskGetTime ?? defaultSaves.scombzData.lastTaskFetchUnixTime;
  newSaves.scombzData.timetable = oldSaves?.timetableData ?? defaultSaves.scombzData.timetable;
  newSaves.scombzData.originalTasklist =
    oldSaves?.manualTasklist?.map((task) => {
      task.kind = "originalTask";
      task.link = task.tasklink ?? "";
      task.courseURL = task.subjlink ?? "";
      return task;
    }) ?? [];
  newSaves.scombzData.sideMenuMemo =
    oldSaves?.notepadData?.map((memo) => {
      const memoIndex = memo?.index
        ?.replace(/\s+/g, " ")
        ?.replace(/<br>/g, "    ")
        ?.replace(/<a.*?>(.*?)<\/a>/g, "[$1]($1)");
      return `${memo.title}    ${memoIndex}`.trim();
    }) ?? [];
  newSaves.scombzData.coursePageMemo =
    oldSaves?.mdNotepadData?.map((memo) => {
      return {
        id: memo.id,
        memo: memo.value ?? "",
      };
    }) ?? [];

  // Settingsの移植

  newSaves.settings.clickLogin =
    oldSaves?.clickLoginBtn ?? newSaves?.settings?.clickLogin ?? defaultSaves.settings.clickLogin;
  newSaves.settings.loginData = {
    username: oldSaves?.adfs?.username ?? "",
    password: oldSaves?.adfs?.password ?? "",
  };
  newSaves.settings.popupBadge =
    oldSaves?.popupBadge ?? newSaves?.settings?.popupBadge ?? defaultSaves.settings.popupBadge;
  newSaves.settings.removeAttendance =
    oldSaves?.attendance ?? newSaves?.settings?.removeAttendance ?? defaultSaves.settings.removeAttendance;
  newSaves.settings.notifySurveySubjects =
    oldSaves?.noticeSurvey
      ?.filter((survey) => survey.value === true)
      ?.map((survey) => {
        return {
          name: survey.name,
          url: survey.url,
        } as Subject;
      }) ?? [];
  newSaves.settings.autoAdfs = oldSaves?.adfsSkip ?? newSaves?.settings?.autoAdfs ?? defaultSaves.settings.autoAdfs;
  newSaves.settings.hideSideMenu =
    oldSaves?.exitSidemenu ?? newSaves?.settings?.hideSideMenu ?? defaultSaves.settings.hideSideMenu;
  newSaves.settings.styleSideMenu =
    oldSaves?.styleSidemenu ?? newSaves?.settings?.styleSideMenu ?? defaultSaves.settings.styleSideMenu;
  newSaves.settings.styleDialog =
    oldSaves?.styleDialog ?? newSaves?.settings?.styleDialog ?? defaultSaves.settings.styleDialog;
  newSaves.settings.styleSurveys =
    oldSaves?.styleExamBtn ?? newSaves?.settings?.styleSurveys ?? defaultSaves.settings.styleSurveys;
  newSaves.settings.styleExam =
    oldSaves?.styleExamBtn ?? newSaves?.settings?.styleExam ?? defaultSaves.settings.styleExam;
  newSaves.settings.useSubTimeTable =
    oldSaves?.addSubTimetable ?? newSaves?.settings?.useSubTimeTable ?? defaultSaves.settings.useSubTimeTable;
  newSaves.settings.useTaskList =
    oldSaves?.tasklistDisplay ?? newSaves?.settings?.useTaskList ?? defaultSaves.settings.useTaskList;
  newSaves.settings.highlightToday =
    oldSaves?.styleNowPeriod ?? newSaves?.settings?.highlightToday ?? defaultSaves.settings.highlightToday;
  newSaves.settings.highlightTask =
    oldSaves?.highlightDeadline ?? newSaves?.settings?.highlightTask ?? defaultSaves.settings.highlightTask;
  newSaves.settings.deadlineMode = oldSaves?.deadlinemode?.includes("relative")
    ? "relative"
    : "absolute" ?? newSaves?.settings?.deadlineMode ?? defaultSaves.settings.deadlineMode;
  newSaves.settings.changeReportBtn =
    oldSaves?.changeReportBtn ?? newSaves?.settings?.changeReportBtn ?? defaultSaves.settings.changeReportBtn;
  newSaves.settings.sliderBarMax =
    Number(oldSaves?.sliderBarMax) || newSaves?.settings?.sliderBarMax || defaultSaves.settings.sliderBarMax;
  newSaves.settings.timesBtnValue = oldSaves?.timesBtnValue
    ? Number(oldSaves?.timesBtnValue?.replace(/\D/g, "")) - 1
    : newSaves?.settings?.timesBtnValue ?? defaultSaves.settings.timesBtnValue;
  newSaves.settings.defaultInputName =
    oldSaves?.defaultInputName ?? newSaves?.settings?.defaultInputName ?? defaultSaves.settings.defaultInputName;
  newSaves.settings.faculty = oldSaves?.fac ?? newSaves?.settings?.faculty ?? defaultSaves.settings.faculty;
  newSaves.settings.lms = {
    showClassroom: oldSaves?.adjustTimetableData?.dispClassroom ?? defaultSaves.settings.lms.showClassroom,
    centering: oldSaves?.adjustTimetableData?.timetableCentering ?? defaultSaves.settings.lms.centering,
    hideNoClassDay: defaultSaves.settings.lms.hideNoClassDay,
  };
  newSaves.settings.updateClear =
    oldSaves?.updateClear ?? newSaves?.settings?.updateClear ?? defaultSaves.settings.updateClear;
  newSaves.settings.dragAndDropBugFix =
    oldSaves?.dadbugFix ?? newSaves?.settings?.dragAndDropBugFix ?? defaultSaves.settings.dragAndDropBugFix;
  newSaves.settings.forceDragAndDropSubmit =
    oldSaves?.ddSubmission ??
    newSaves?.settings?.forceDragAndDropSubmit ??
    defaultSaves.settings.forceDragAndDropSubmit;
  newSaves.settings.downloadFileBundle =
    oldSaves?.downloadFileBundle ?? newSaves?.settings?.downloadFileBundle ?? defaultSaves.settings.downloadFileBundle;
  newSaves.settings.hideCompletedReports =
    oldSaves?.hideCompletedReports ??
    newSaves?.settings?.hideCompletedReports ??
    defaultSaves.settings.hideCompletedReports;
  newSaves.settings.signOutPageLayout =
    oldSaves?.changeLogout ?? newSaves?.settings?.signOutPageLayout ?? defaultSaves.settings.signOutPageLayout;
  newSaves.settings.layout = {
    maxWidthPx: {
      subj: Number(oldSaves?.maxWidthPx?.subj) || defaultSaves.settings.layout.maxWidthPx.subj,
      lms: Number(oldSaves?.maxWidthPx?.lms) || defaultSaves.settings.layout.maxWidthPx.lms,
      task: Number(oldSaves?.maxWidthPx?.task) || defaultSaves.settings.layout.maxWidthPx.task,
    },
    setMaxWidth: oldSaves?.setMaxWidth ?? defaultSaves.settings.layout.setMaxWidth,
    removePageTop: oldSaves?.pageTopBtn ?? defaultSaves.settings.layout.removePageTop,
    removeDirectLink: oldSaves?.remomveDirectLink ?? defaultSaves.settings.layout.removeDirectLink,
    topPageLayout: oldSaves?.layoutHome ?? defaultSaves.settings.layout.topPageLayout,
    clickToHideName: defaultSaves.settings.layout.clickToHideName,
    linkify: oldSaves?.urlToLink ?? defaultSaves.settings.layout.linkify,
  };
  newSaves.settings.modifyCoursePageTitle =
    oldSaves?.modifyCoursePageTitle ?? defaultSaves.settings.modifyCoursePageTitle;
  newSaves.settings.modifyClickableLinks = defaultSaves.settings.modifyClickableLinks;
  newSaves.settings.markdownNotePad = defaultSaves.settings.markdownNotePad;
  newSaves.settings.headLinkTo = oldSaves?.headLinkTo ?? defaultSaves.settings.headLinkTo;
  newSaves.settings.customCSS = oldSaves?.customcss ?? defaultSaves.settings.customCSS;
  newSaves.settings.materialSortOrder = oldSaves?.materialTop
    ? oldSaves?.materialTopDetail === "first"
      ? "asc"
      : "desc"
    : false;
  newSaves.settings.hideMaterial = oldSaves?.materialHide ?? defaultSaves.settings.hideMaterial;
  newSaves.settings.autoHideMaterial =
    oldSaves?.materialHideDetail !== "none" ? (oldSaves?.materialHideDetail === "recent" ? "recent" : "all") : false;

  newSaves.scombzData.doMigration = true;
  return newSaves;
};

export const migrate = (): Promise<Saves | "alreadyMigrated"> => {
  return new Promise((resolve) => {
    chrome.storage.local.get({ ...oldSavesTemp, ...defaultSaves }, (oldSaves) => {
      if (oldSaves?.scombzData?.doMigration || process.env.PLASMO_PUBLIC_ENVIRONMENT === "development") {
        console.log("Migration already completed");
        resolve("alreadyMigrated");
      } else {
        const newSaves = migrateLogic(oldSaves);
        chrome.storage.local.clear(() => {
          chrome.storage.local.set(newSaves, () => {
            console.log("Migration completed");
            resolve(newSaves);
          });
        });
      }
    });
  });
};
