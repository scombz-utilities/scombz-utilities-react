import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course*"],
  run_at: "document_end",
};

const attendanceRemove = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.removeAttendance === "only") {
    const attendanceKome = document.querySelector(
      "#attendance > div.block-contents > div > div:nth-child(3) > div:nth-child(1) > div.course-view-attendance-status > label",
    );
    if (attendanceKome) {
      if (attendanceKome.textContent === "※") {
        const attendance = document.querySelector("#attendance");
        attendance.remove();
      }
    }
  } else if (settings.removeAttendance === "all") {
    const attendance = document.querySelector("#attendance");
    if (attendance) {
      attendance.remove();
    }
  }
};

attendanceRemove();
