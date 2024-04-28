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
    title: "学生自身の学修目標とキャリアプランの設定および2024年度前期気づきアンケート　4年生",
  },
  {
    course: "工学英語 II",
    deadline: "2024/04/28 00:00",
    id: "survey20018759",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20018759&idnumber=202301SU0388772001",
    startline: "2024/02/14 00:00",
    title: "2023年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "感性情報処理",
    deadline: "2024/04/28 00:00",
    id: "survey20019019",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20019019&idnumber=202301SU0436862001",
    startline: "2024/02/14 00:00",
    title: "2023年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "卒研プレゼミナール",
    deadline: "2024/04/28 00:00",
    id: "survey20019117",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20019117&idnumber=202301SU0474232001",
    startline: "2024/02/14 00:00",
    title: "2023年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "ソフトウェア工学",
    deadline: "2023/10/08 00:00",
    id: "survey20015650",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015650&idnumber=202301SU0054921001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "数理計画法",
    deadline: "2023/10/08 00:00",
    id: "survey20014659",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20014659&idnumber=202301SU0054841001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期(１Q)_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "人工知能",
    deadline: "2023/10/08 00:00",
    id: "survey20015640",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015640&idnumber=202301SU0053561001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "情報セキュリティ",
    deadline: "2023/10/08 00:00",
    id: "survey20015633",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015633&idnumber=202301SU0052911001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "宇宙空間科学",
    deadline: "2023/10/08 00:00",
    id: "survey20015351",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015351&idnumber=202301SU0003791001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "データベース",
    deadline: "2023/10/08 00:00",
    id: "survey20015632",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015632&idnumber=202301SU0052831001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "組込みシステム",
    deadline: "2023/10/08 00:00",
    id: "survey20015642",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015642&idnumber=202301SU0053721001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "上級プログラミング１",
    deadline: "2023/10/08 00:00",
    id: "survey20014657",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20014657&idnumber=202301SU0053151001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期(１Q)_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "コンピュータビジョン",
    deadline: "2023/10/08 00:00",
    id: "survey20015634",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015634&idnumber=202301SU0052991001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "上級プログラミング２",
    deadline: "2023/10/08 00:00",
    id: "survey20015854",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015854&idnumber=202301SU0053231001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期(２Q)_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "集積回路工学",
    deadline: "2023/10/08 00:00",
    id: "survey20015648",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015648&idnumber=202301SU0054681001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "高度情報演習１Ａ",
    deadline: "2023/10/08 00:00",
    id: "survey20015895",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20015895&idnumber=202301SU0054201001",
    startline: "2023/09/04 00:00",
    title: "2023年度_前期_演習_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "情報工学科3年生",
    deadline: "2025/04/01 00:00",
    id: "survey20013661",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20013661&idnumber=2023com0003599902",
    startline: "2023/03/31 00:00",
    title: "学生自身の学修目標とキャリアプランの設定および2023年度前期気づきアンケート　３年生",
  },
  {
    course: "ディジタルメディア処理",
    deadline: "2023/04/22 00:00",
    id: "survey20009255",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20009255&idnumber=202201SU0421872001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "塗料・塗装工学概論",
    deadline: "2023/04/22 00:00",
    id: "survey20008959",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20008959&idnumber=202201SU0371592001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "プログラミング言語論",
    deadline: "2023/04/22 00:00",
    id: "survey20008092",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20008092&idnumber=202201SU0423232001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期(３Q)_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "データ構造とアルゴリズム２",
    deadline: "2023/04/22 00:00",
    id: "survey20009268",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20009268&idnumber=202201SU0422672001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "基礎情報演習２Ａ",
    deadline: "2023/04/22 00:00",
    id: "survey20009481",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20009481&idnumber=202201SU0422832001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_演習_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "基礎情報演習２Ｂ",
    deadline: "2023/04/22 00:00",
    id: "survey20009483",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20009483&idnumber=202201SU0422992001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_演習_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "相対論と量子論の基礎",
    deadline: "2023/04/22 00:00",
    id: "survey20009419",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20009419&idnumber=202201SU0671232001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "認知心理学",
    deadline: "2023/04/22 00:00",
    id: "survey20008915",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20008915&idnumber=202201SU0369222001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "形式言語とオートマトン",
    deadline: "2023/04/22 00:00",
    id: "survey20009271",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20009271&idnumber=202201SU0423152001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "数値計算法",
    deadline: "2023/04/22 00:00",
    id: "survey20009276",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20009276&idnumber=202201SU0423872001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "コンピュータ通信",
    deadline: "2023/04/22 00:00",
    id: "survey20009253",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20009253&idnumber=202201SU0421712001",
    startline: "2023/02/14 00:00",
    title: "2022年度_後期_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "信号処理",
    deadline: "2022/10/08 00:00",
    id: "survey20002045",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002045&idnumber=202201SU0056121001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "Ｈ．Ｃ．インタラクション",
    deadline: "2022/10/08 00:00",
    id: "survey20002037",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002037&idnumber=202201SU0055001001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "微分積分第１",
    deadline: "2022/10/08 00:00",
    id: "survey20002034",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002034&idnumber=202201SU0054881001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "現代日本の社会",
    deadline: "2022/10/08 00:00",
    id: "survey20001736",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20001736&idnumber=202201SU0005411001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "オペレーティングシステム",
    deadline: "2022/10/08 00:00",
    id: "survey20002043",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002043&idnumber=202201SU0055801001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "数理論理学",
    deadline: "2022/10/08 00:00",
    id: "survey20002220",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002220&idnumber=202201SU0055961001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期(１Q)_工学部_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "工学英語 I",
    deadline: "2022/10/08 00:00",
    id: "survey20002188",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002188&idnumber=202201SU0340951001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "基礎情報演習１Ａ",
    deadline: "2022/10/08 00:00",
    id: "survey20002284",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002284&idnumber=202201SU0055641001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_演習_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "データ構造とアルゴリズム１",
    deadline: "2022/10/08 00:00",
    id: "survey20002039",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002039&idnumber=202201SU0055161001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_講義_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "基礎情報演習１Ｂ",
    deadline: "2022/10/08 00:00",
    id: "survey20002286",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20002286&idnumber=202201SU0056281001",
    startline: "2022/09/05 00:00",
    title: "2022年度_前期_工学部_演習_自己評価アンケート / Class Evaluation Questionnaire",
  },
  {
    course: "情報工学科2年生",
    deadline: "2025/04/01 00:00",
    id: "survey20000146",
    kind: "survey",
    link: "https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?surveyId=survey20000146&idnumber=2022com0000879902",
    startline: "2022/04/01 09:00",
    title: "学生自身の学修目標とキャリアプランの設定および2022年度前期気づきアンケート　2年生",
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

      setTasklist([...normalTaskList, ...surveyList]);
      setTasklist(TESTDATA);
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
