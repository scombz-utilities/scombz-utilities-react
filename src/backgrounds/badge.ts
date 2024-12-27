import { defaultSaves } from "~contents/util/settings";
import type { Saves } from "~contents/util/settings";

const setBadgeText = async (text: string) => {
  if (chrome?.action) {
    return await chrome.action.setBadgeText({ text });
  } else {
    // @ts-expect-error browserAction is not defined in plasmo
    return await browser.browserAction.setBadgeText({ text });
  }
};

const setBadgeBackgroundColor = async (color: string) => {
  if (chrome?.action) {
    return await chrome.action.setBadgeBackgroundColor({ color });
  } else {
    // @ts-expect-error browserAction is not defined in plasmo
    return await browser.browserAction.setBadgeBackgroundColor({ color });
  }
};

export const updateBadgeText = () => {
  // firefox v2がsocial workerでのasync/awaitを使ったstorage取得に対応していない
  chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
    if (!currentData.settings.popupBadge) return;
    const tasklist = currentData.scombzData.tasklist;

    const notifySurveySubjectsName = currentData.settings.notifySurveySubjects.map((subject) => subject.name);
    const allSurveyList = currentData.scombzData.surveyList;
    const surveyList = allSurveyList.filter((task) => notifySurveySubjectsName.includes(task.course));

    const originalTasklist = currentData.scombzData.originalTasklist;

    const mergedTaskList = [...tasklist, ...surveyList, ...originalTasklist];

    const now = new Date().getTime();

    const filteredTaskList = mergedTaskList
      .filter((task) => Date.parse(task.deadline) >= now)
      .filter((task) => !currentData.settings.hiddenTaskIdList.includes(task.id))
      .filter(
        (task) =>
          !currentData.settings.popupHideFutureTasks ||
          (Date.parse(task.deadline) - now) / 86400000 < currentData.settings.popupHideFutureTasksRange,
      );

    filteredTaskList.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));

    if (filteredTaskList.length > 0) {
      const rd = (Date.parse(filteredTaskList[0].deadline) - now) / 60000;
      if (rd < 60 * 24) {
        setBadgeBackgroundColor("#ee3333");
      } else if (rd < 60 * 24 * 2) {
        setBadgeBackgroundColor("#ff8800");
      } else {
        setBadgeBackgroundColor("#1a73e8");
      }
    }
    setBadgeText(filteredTaskList.length > 0 ? filteredTaskList.length.toString() : "");
  });
};
