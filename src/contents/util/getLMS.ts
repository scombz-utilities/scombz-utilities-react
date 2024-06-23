import type { TimeTable, TimeTableData } from "../types/timetable";
import { isFirefox } from "../util/functions";
import type { Saves } from "./settings";
import { defaultSaves } from "./settings";

const han2Zenkaku = ($str: string) => {
  return $str.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
};

const jigenInt = ($str: string) => {
  return han2Zenkaku($str.charAt(0));
};

export const getLMS = (d: Document): TimeTable => {
  // 時間割じゃなくてスケジュールだったら取得できないので取得しない
  if (!(d.getElementById("displayMode1") as HTMLInputElement)?.checked) {
    return [];
  }
  // データ取得
  const $courseList = d.querySelectorAll(".timetable-course-top-btn");
  if ($courseList[0]) {
    //JSON生成
    const $timetableData = [];
    for (const $course of $courseList) {
      const $timetableClassData: TimeTableData = {
        day: -1,
        time: -1,
        id: "",
        name: "",
      };
      for (let $yobicolNum = 1; $yobicolNum < 7; $yobicolNum++) {
        if (($course.parentNode.parentNode as HTMLElement).className.indexOf($yobicolNum + "-yobicol") != -1) {
          ($timetableClassData.day = $yobicolNum),
            ($timetableClassData.time = Number(
              jigenInt($course.parentNode.parentNode.parentNode.firstElementChild.innerHTML),
            ));
          if (!$timetableClassData.time) {
            $timetableClassData.time = Number(
              $course.parentNode.parentNode.parentNode.firstElementChild.innerHTML.slice(-1),
            );
          }
          break;
        }
        if ($yobicolNum === 6) {
          $timetableClassData.day = -1;
          $timetableClassData.time = -1; // 曜日時限不定履修
        }
      }
      if (!$course.getAttribute("id")) {
        continue;
      }
      $timetableClassData.id = $course.getAttribute("id");
      $timetableClassData.name = $course.innerHTML;
      $timetableClassData.classroom = $course.nextElementSibling?.firstElementChild?.getAttribute("title") ?? "";
      const $courseTeacherList =
        $course.nextElementSibling?.querySelectorAll("div[data-toggle='tooltip'] > span") || [];
      const $courseTeachers = [];
      for (const $teacher of $courseTeacherList) {
        if (!$teacher.hasAttribute("class")) {
          $courseTeachers.push($teacher.innerText.replace(",  ", ""));
        }
      }
      $timetableClassData.teacher = $courseTeachers;
      $timetableData.push($timetableClassData);
    }
    return $timetableData;
  }
  return [];
};

export const getLMSinLMSPage = async () => {
  const waitTime = isFirefox() ? 1500 : 0;
  setTimeout(async () => {
    const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
    currentData.scombzData.timetable = getLMS(document);
    chrome.storage.local.set(currentData);
  }, waitTime);
};

export const fetchLMS = async () => {
  const res = await fetch("https://scombz.shibaura-it.ac.jp/lms/timetable?selectDisplayMode=0");
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  currentData.scombzData.timetable = getLMS(doc);
  await chrome.storage.local.set(currentData);
  return currentData.scombzData.timetable;
};
