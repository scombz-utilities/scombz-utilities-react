type TimeTableData = {
  day: number;
  time: number;
  id?: string;
  name: string;
  classroom?: string;
  teacher?: string[];
  termYear?: number;
  termPhase?: number;
};

const han2Zenkaku = ($str: string) => {
  return $str.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
};

const jigenInt = ($str: string) => {
  return han2Zenkaku($str.charAt(0));
};

const getLMSMain = (d?: Document): undefined | TimeTableData[] => {
  if (d === undefined) d = document;
  // 時間割じゃなくてスケジュールだったら取得できないので取得しない
  if (!(document.getElementById("displayMode1") as HTMLInputElement)?.checked) {
    return;
  }
  // データ取得
  const $courseList = document.querySelectorAll(".timetable-course-top-btn");
  if ($courseList[0]) {
    //JSON生成
    const $timetableData = [];
    let futei = 0;
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
        if ($yobicolNum == 6) {
          $timetableClassData.day = -1;
          $timetableClassData.time = -1; // 曜日時限不定履修
          futei++;
        }
      }
      $timetableClassData.id = $course.getAttribute("id");
      $timetableClassData.name = $course.innerHTML;
      $timetableClassData.classroom = $course.nextElementSibling.firstElementChild.getAttribute("title");
      const $courseTeacherList = $course.nextElementSibling.firstElementChild.querySelectorAll("span");
      const $courseTeachers = [];
      for (const $teacher of $courseTeacherList) {
        if (!$teacher.hasAttribute("class")) {
          $courseTeachers.push($teacher.innerHTML.replace(",  ", ""));
        }
      }
      $timetableClassData.teacher = $courseTeachers;
      $timetableData.push($timetableClassData);
    }
    $timetableData.push({
      day: -2,
      time: -2,
      name: "授業は存在しません",
    });
    $timetableData.push({
      termYear: Number(
        String((document.getElementById("nendo").querySelector("[selected]") as HTMLSelectElement)?.value),
      ),
      termPhase:
        (document.getElementById("kikanCd").querySelector("[selected]") as HTMLSelectElement)?.value === "10" ? 1 : 2,
    });
    // データ保存
    chrome.storage.local.set(
      {
        timetableData: $timetableData,
        specialSubj: futei,
      },
      () => {
        console.log("ChromeLocalStorageに保存しました");
      },
    );
    return $timetableData;
  }
  return undefined;
};

export const getLMSinLMSPage = () => {
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/timetable")) {
    getLMSMain(document);
  }
};
