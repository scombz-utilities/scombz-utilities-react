import { Box } from "@mui/material";

import React, { useState, useEffect } from "react";
import type { Task } from "../types/task";
import { useWindowSize } from "../util/functions";
import { defaultSaves } from "../util/settings";
import type { Saves } from "../util/settings";

const TESTDATA: Task[] = [
  {
    course: "情報工学科4年生",
    deadline: "2025/04/01 00:00",
    id: "survey20023319",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20023319&idnumber=2024com0006329902",
    startline: "2024/04/01 00:00",
    title: "(TESTDATA)学生自身の学修目標とキャリアプランの設定および2024年度前期気づきアンケート　4年生",
  },
  {
    course: "工学英語 II",
    deadline: "2024/04/28 00:00",
    id: "survey20018759",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20018759&idnumber=202301SU0388772001",
    startline: "2024/02/14 00:00",
    title: "(TESTDATA)2023年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "感性情報処理",
    deadline: "2024/04/28 00:00",
    id: "survey20019019",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20019019&idnumber=202301SU0436862001",
    startline: "2024/02/14 00:00",
    title: "(TESTDATA)2023年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
];

export const TaskList = () => {
  const [tasklist, setTasklist] = useState<Task[]>([]);
  useEffect(() => {
    const fetchTasklist = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      const normalTaskList = currentData.scombzData.tasklist;

      const notifySurveySubjectsName = currentData.settings.notifySurveySubjects.map((subject) => subject.name);
      const allSurveyList = currentData.scombzData.surveyList;
      const surveyList = allSurveyList.filter((task) => notifySurveySubjectsName.includes(task.course));

      setTasklist([...normalTaskList, ...surveyList, ...TESTDATA]);
    };
    fetchTasklist();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, height] = useWindowSize();

  if (width < 540) {
    return <></>;
  }

  return (
    <>
      <Box
        maxWidth="1200px"
        m={width > 1540 ? "10px auto" : "10px"}
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: "#fff7",
          backdropFilter: "blur(6px)",
          padding: 1,
          borderRadius: 1,
        }}
      >
        TASKLIST
        {tasklist.map((task) => (
          <div>{task.title}</div>
        ))}
      </Box>
    </>
  );
};
