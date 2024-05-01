import { getLMS } from "./getLMS";
import { defaultSaves } from "./settings";
import type { Settings } from "./settings";

const showClassroom = () => {
  const tooltipDivs = document.querySelectorAll('div[data-toggle="tooltip"]');

  tooltipDivs.forEach((div) => {
    const classroom = div.querySelector("div");
    const title = div.getAttribute("title");
    classroom.innerText = title;
  });
};

const centeringTimetable = () => {
  const table = document.querySelector(".div-table") as HTMLDivElement;
  if (table) {
    table.style.textAlign = "center";
  }
};

const hideNoClassDay = () => {
  const timetableData = getLMS();
  if (!timetableData.find((data) => data.day === 6)) {
    const sats = Array.from(document.getElementsByClassName("6-yobicol"));
    console.log({ sats });
    for (const sat of sats) sat.remove();
  }
  for (let i = 7; i > 4; i--) {
    if (!timetableData.find((data) => data.time === i)) {
      const TableDataRow = Array.from(document.getElementsByClassName("div-table-data-row"));
      if (TableDataRow.length > 0) TableDataRow[i - 1].remove();
    }
  }
};

export const customizeTimetable = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.lms.showClassroom) {
    showClassroom();
  }
  if (settings.lms.centering) {
    centeringTimetable();
  }
  if (settings.lms.hideNoClassDay) {
    hideNoClassDay();
  }
};
