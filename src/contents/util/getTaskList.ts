import type { Task } from "../types/task";
import { defaultSaves } from "./settings";
import type { Saves } from "./settings";
import type { RuntimeMessage } from "~background";

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
    const taskLinkObj = new URL(task.link);
    if (taskLinkObj.origin !== "https://scombz.shibaura-it.ac.jp") {
      switch (taskLinkObj.pathname) {
        case "/lms/course/report/submission":
        case "/lms/course/surveys/take":
        case "/portal/surveys/take":
        case "/lms/course/examination/take":
          taskLinkObj.protocol = "https:";
          taskLinkObj.hostname = "scombz.shibaura-it.ac.jp";
          task.link = taskLinkObj.toString();
          break;
        default:
          task.link = "";
      }
    }
    taskList.push(task);
  }

  return taskList;
};

export const getTasksOnTaskPage = async () => {
  const taskList = getTasks(document);
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  currentData.scombzData.tasklist = taskList;
  await chrome.storage.local.set(currentData);
  chrome.runtime.sendMessage({ action: "updateBadgeText" } as RuntimeMessage);
  return taskList;
};

export const getTasksByAjax = async () => {
  const response = await fetch("https://scombz.shibaura-it.ac.jp/lms/task");
  if (!response.ok) {
    throw new Error("ネットワーク応答が正しくありません");
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  if (doc.querySelector("[property='og:url']")?.getAttribute("content") === "https://scombz.shibaura-it.ac.jp/login") {
    throw new Error("ログインしていません");
  }
  const taskList = getTasks(doc);
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  currentData.scombzData.tasklist = taskList;
  await chrome.storage.local.set(currentData);
  chrome.runtime.sendMessage({ action: "updateBadgeText" } as RuntimeMessage);
  return taskList;
};

export const fetchSurveys = async () => {
  const response = await fetch("https://scombz.shibaura-it.ac.jp/portal/surveys/list");
  if (!response.ok) {
    throw new Error("ネットワーク応答が正しくありません");
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  if (doc.querySelector("[property='og:url']")?.getAttribute("content") === "https://scombz.shibaura-it.ac.jp/login") {
    throw new Error("ログインしていません");
  }

  const taskListsObj = [];

  let i = 0;
  while (doc.querySelector(`#portalSurveysForm .result-list:nth-of-type(${i + 1})`)) {
    const titleElement = doc.querySelector(
      `#portalSurveysForm .result-list:nth-of-type(${i + 1}) .survey-list-title .template-name`,
    );
    const endColorElement = doc.querySelector(
      `#portalSurveysForm .result-list:nth-of-type(${i + 1}) .survey-list-title .portal-surveys-status-end-color`,
    );
    const takeEndColorElement = doc.querySelector(
      `#portalSurveysForm .result-list:nth-of-type(${i + 1}) .survey-list-title .portal-surveys-status-takeend-color`,
    );

    if (endColorElement || takeEndColorElement) {
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
    taskObj.id = (
      doc.querySelector(`#portalSurveysForm .result-list:nth-of-type(${i + 1}) #listSurveyId`) as HTMLInputElement
    ).value;

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
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  currentData.scombzData.surveyList = taskListsObj;
  await chrome.storage.local.set(currentData);
  chrome.runtime.sendMessage({ action: "updateBadgeText" } as RuntimeMessage);
  return taskListsObj;
};
