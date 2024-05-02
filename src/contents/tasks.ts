import { differenceInMinutes } from "date-fns";
import type { PlasmoCSConfig } from "plasmo";
import { getTasksOnTaskPage, getTasksByAjax, fetchSurveys } from "./util/getTaskList";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";
import { FETCH_INTERVAL } from "~/constants";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};
// タスクページにアクセスしたときにタスクを取得
if (location.href === "https://scombz.shibaura-it.ac.jp/lms/task") {
  getTasksOnTaskPage();
}

// タスクを取得
const fetchTasks = async () => {
  const now = new Date();
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  const lastTaskFetch = new Date(currentData.scombzData.lastTaskFetchUnixTime);
  if (differenceInMinutes(now, lastTaskFetch) >= FETCH_INTERVAL) {
    console.log("fetch tasks");
    currentData.scombzData.lastTaskFetchUnixTime = now.getTime();
    chrome.storage.local.set(currentData);
    console.log(await getTasksByAjax());
    console.log(await fetchSurveys());
  }
  return;
};
fetchTasks();
