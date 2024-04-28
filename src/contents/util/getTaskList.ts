import type { Task } from "../types/task";
import { defaultSaves } from "./settings";
import type { Saves } from "./settings";

const getTasks = (doc: Document): Task[] => {
  const taskListNode = doc.getElementById("taskList") as HTMLElement;
  if (!taskListNode) return [];
  const taskList = [];
  const taskNodeList = taskListNode.querySelectorAll(".result_list_line") as NodeListOf<HTMLElement>;
  for (const taskNode of taskNodeList) {
    const task: Task = {
      kind: "task",
      course: taskNode.querySelector(".course").innerHTML,
      title: taskNode.querySelector(".tasklist-title a:nth-child(1)").innerHTML,
      link: (taskNode.querySelector(".tasklist-title a:nth-child(1)") as HTMLAnchorElement).href,
      deadline: taskNode.querySelector(".tasklist-deadline .deadline").innerHTML,
      id: null,
    };
    if (task.link.includes("idnumber=")) {
      task.id = task.link.slice(task.link.indexOf("idnumber=") + 9).replace(/&|Id=/g, "");
    }
    if (!task.link.startsWith("https://scombz.shibaura-it.ac.jp")) {
      task.link = "https://scombz.shibaura-it.ac.jp" + task.link;
    }
    taskList.push(task);
  }

  return taskList;
};

export const getTasksOnTaskPage = () => {
  const taskList = getTasks(document);
  chrome.storage.local.set(
    {
      tasklist: taskList,
    },
    () => {
      console.log(taskList);
      chrome.runtime.sendMessage({ action: "updateBadgeText" });
    },
  );
};

export const getTasksByAjax = async () => {
  const response = await fetch("https://scombz.shibaura-it.ac.jp/lms/task");
  if (!response.ok) {
    throw new Error("ネットワーク応答が正しくありません");
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const taskList = getTasks(doc);
  chrome.storage.local.set(
    {
      tasklist: taskList,
    },
    () => {
      chrome.runtime.sendMessage({ action: "updateBadgeText" });
      console.log(taskList);
    },
  );
};

export const fetchSurveys = async () => {
  const response = await fetch("https://scombz.shibaura-it.ac.jp/portal/surveys/list");
  if (!response.ok) {
    throw new Error("ネットワーク応答が正しくありません");
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const taskListsObj = [];

  let i = 0;
  while (doc.querySelector(`#portalSurveysForm .result-list:nth-of-type(${i + 1})`)) {
    const titleElement = doc.querySelector(
      `#portalSurveysForm .result-list:nth-of-type(${i + 1}) .survey-list-title .template-name`,
    );
    const endColorElement = doc.querySelector(
      `#portalSurveysForm .result-list:nth-of-type(${i + 1}) .survey-list-title .portal-surveys-status-end-color`,
    );

    if (endColorElement) {
      i++;
      continue;
    }

    const taskObj: Task = {
      kind: "survey",
      link: "",
      title: "",
      course: "",
      deadline: "",
      id: "",
    };
    taskObj.title = titleElement.innerHTML;
    taskObj.course = doc.querySelector(
      `#portalSurveysForm .result-list:nth-of-type(${i + 1}) .survey-list-address span`,
    ).innerHTML;
    taskObj.startline = doc.querySelector(
      `#portalSurveysForm .result-list:nth-of-type(${i + 1}) .survey-list-update span:nth-of-type(1)`,
    ).innerHTML;
    taskObj.deadline = doc.querySelector(
      `#portalSurveysForm .result-list:nth-of-type(${i + 1}) .survey-list-update span:nth-of-type(3)`,
    ).innerHTML;
    taskObj.id =
      "survey" +
      (doc.querySelector(`#portalSurveysForm .result-list:nth-of-type(${i + 1}) #listSurveyId`) as HTMLInputElement)
        .value;

    const idnumber = (
      doc.querySelector(`#portalSurveysForm .result-list:nth-of-type(${i + 1}) #listIdnumber`) as HTMLInputElement
    ).value;
    if (idnumber.length > 3) {
      taskObj.link = `https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=${taskObj.id}${"&idnumber=" + idnumber}`;
    } else {
      taskObj.link = `https://scombz.shibaura-it.ac.jp/portal/surveys/take?surveyId=${taskObj.id}`;
    }

    taskListsObj.push(taskObj);
    i++;
  }
  chrome.storage.local.set(
    {
      surveyList: taskListsObj,
    },
    () => {
      chrome.runtime.sendMessage({ action: "updateBadgeText" });
      console.log(taskListsObj);
    },
  );
};

//アンケートを取得するかどうかの設定を科目別ページに挿入
export const insertSurveyBtnOnSubj = async () => {
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/course?")) {
    const $courseTitle = document.querySelector(".course-title-txt");
    if ($courseTitle && !document.getElementById("noticeSurvey")) {
      const $nameInt = $courseTitle.innerHTML.indexOf(" ", $courseTitle.innerHTML.indexOf(" ") + 2);
      const $courseName = $courseTitle.innerHTML.slice($nameInt + 1);
      const link = document.createElement("link");
      link.href = chrome.runtime.getURL("css/class_survey_button.css"); // 新しいCSSファイルのパス
      link.type = "text/css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
      ($courseTitle.parentNode as HTMLElement).insertAdjacentHTML(
        "beforeend",
        `
          <div class="noticeSurveyBox">
            <input class="ItemBox-CheckBox-Input" type="checkbox" id="noticeSurvey"></input>
            <label class="ItemBox-CheckBox-Label" for="noticeSurvey"></label>
            <span>この科目のアンケートを課題一覧に表示する</span>
          </div>`,
      );
      const pageUrl = location.href;
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      const notifySurveySubjects = currentData.settings.notifySurveySubjects;

      //chrome.storageに保存されたオンオフ情報を復元
      (document.getElementById("noticeSurvey") as HTMLInputElement).checked = notifySurveySubjects.some(
        (subject) => subject.name === $courseName,
      );
      //値の変更時にchrome.storageに保存する
      document.getElementById("noticeSurvey").addEventListener("change", () => {
        const filteredNotifySurveySubjects = notifySurveySubjects.filter((subject) => subject.name !== $courseName);
        if ((document.getElementById("noticeSurvey") as HTMLInputElement).checked) {
          filteredNotifySurveySubjects.push({ name: $courseName, url: pageUrl });
        }
        currentData.settings.notifySurveySubjects = filteredNotifySurveySubjects;

        chrome.storage.local.set(currentData);
      });
    }
  }
};
