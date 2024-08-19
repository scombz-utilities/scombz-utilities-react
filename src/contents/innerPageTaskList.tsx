import { format as formatDate } from "date-fns";
import { ja } from "date-fns/locale";
import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect } from "react";
import { getTaskColor } from "./util/color";
import { jsxToHtml } from "./util/functions";
import { getRelativeTime } from "~contents/util/getRelativeTime";
import { defaultSaves, type Saves } from "~settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/portal/home*"],
  run_at: "document_end",
};

const insertTasklist = async (currentData: Saves) => {
  if (!currentData.settings.useTaskList) return;

  const subjects = currentData.settings.notifySurveySubjects;
  const lastUpdate = new Date(currentData.scombzData.lastTaskFetchUnixTime ?? 0);
  const highlightTask = currentData.settings.highlightTask;

  const normalTaskList = currentData.scombzData.tasklist;

  const notifySurveySubjectsName = currentData.settings.notifySurveySubjects.map((subject) => subject.name);
  const allSurveyList = currentData.scombzData.surveyList;
  const surveyList = allSurveyList.filter((task) => notifySurveySubjectsName.includes(task.course));

  const originalTasklist = currentData.scombzData.originalTasklist;

  const now = new Date();

  const tasklist = [...normalTaskList, ...surveyList, ...originalTasklist]
    .map((task) => {
      return { ...task, deadlineDate: new Date(task.deadline) };
    })
    .filter((task) => task.deadlineDate >= now)
    .filter((task) => !currentData.settings.hiddenTaskIdList.includes(task.id));

  tasklist.sort((x, y) => {
    const [a, b] = [x.deadlineDate, y.deadlineDate];
    return a.getTime() - b.getTime();
  });

  if (tasklist.length === 0) return;

  const taskListNode = (
    <div>
      <div className="utilities-taskListNode">最終更新: {formatDate(lastUpdate, "MM月dd日 HH時mm分")}</div>
      <div className="utilities-taskListNode">
        <div
          style={{
            fontWeight: "bold",
            borderTop: "1px solid",
            backgroundColor: currentData.settings.darkMode ? "#222" : "#f5f2eb",
            borderColor: currentData.settings.darkMode ? "rgb(67, 72, 75)" : "#ddd",
          }}
        >
          <div>科目</div>
          <div>タイトル</div>
          <div>締切</div>
        </div>
        {tasklist.slice(0, 10).map((task) => {
          const courseUrl = subjects.find((subject) => subject.name === task.course)?.url;
          const colors = highlightTask ? getTaskColor(task, currentData.settings.darkMode) : {};

          return (
            <div style={{ ...colors, borderColor: currentData.settings.darkMode ? "rgb(67, 72, 75)" : "#ddd" }}>
              <div>
                <a href={task.courseURL || courseUrl || ""}>{task.course}</a>
              </div>
              <div>
                <a href={task.link}>{task.title}</a>
              </div>
              <div>
                {currentData.settings.deadlineMode === "relative"
                  ? getRelativeTime(new Date(task.deadline), now)
                  : formatDate(task.deadlineDate, currentData.settings.deadlineFormat, { locale: ja })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const buttonHtml = jsxToHtml(taskListNode);
  const target = document.getElementById("top_information3");
  if (!target) return;
  const container = document.createElement("div");
  container.classList.add("portal-subblock");

  const containerTitle = document.createElement("div");
  containerTitle.classList.add("portal-subblock-title", "portal-top-subblock-title", "utilities-portal-task-title");
  containerTitle.textContent = "課題・テスト一覧";
  container.appendChild(containerTitle);

  container.insertAdjacentHTML("beforeend", buttonHtml);
  target.parentNode.insertBefore(container, target);
};

const styleElement = document.createElement("style");

export const getStyle = () => styleElement;

const InnerPageTaskList = () => {
  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      insertTasklist(currentData);
    });
  }, []);

  return <></>;
};

export default InnerPageTaskList;
