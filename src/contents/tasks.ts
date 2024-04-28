import type { PlasmoCSConfig } from "plasmo";
import { getTasksOnTaskPage, insertSurveyBtnOnSubj, getTasksByAjax, fetchSurveys } from "./util/getTaskList";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

if (location.href === "https://scombz.shibaura-it.ac.jp/lms/task") {
  getTasksOnTaskPage();
}
insertSurveyBtnOnSubj();

// TODO: 10分に1回だけ自動で取得するようにする

document.body.insertAdjacentHTML(
  "afterbegin",
  "<button id='getTasksByAjax' style='position: fixed; top:0; right:0; z-index: 10000000;'>タスクを取得</button>",
);
document.getElementById("getTasksByAjax").addEventListener("click", () => {
  getTasksByAjax();
  fetchSurveys();
  const func = async () => {
    const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
    const subjects = currentData.settings.notifySurveySubjects.map((subject) => subject.name);
    const tasks = currentData.surveyList;
    console.log({ tasks, subjects });
    console.log({ displayTask: tasks.filter((task) => subjects.includes(task.course)) });
  };
  func();
});
