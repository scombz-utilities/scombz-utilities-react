import type { PlasmoCSConfig } from "plasmo";
import {
  urlToLink,
  modifyCoursePageTitle,
  insertSurveyBtnOnSubj,
  markdownNotePad,
  createSyllabusButton,
  layoutMaterialTitles,
} from "./util/courseLogic";
import { sortSubjectByOrder, forceMaterialOrder } from "./util/layoutSubject";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course*"],
  run_at: "document_end",
};

const course = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (currentData.settings.layout.linkify) {
    urlToLink();
  }
  if (currentData.settings.modifyCoursePageTitle) {
    modifyCoursePageTitle();
  }
  if (currentData.settings.useTaskList) {
    insertSurveyBtnOnSubj();
  }
  if (currentData.settings.markdownNotePad) {
    markdownNotePad();
  }
  if (currentData.settings.createSyllabusButton) {
    createSyllabusButton();
  }
  if (currentData.settings.sortSubjectByOrder) {
    sortSubjectByOrder(currentData);
  }
  if (currentData.settings.materialSortOrder) {
    forceMaterialOrder(currentData);
  }
  layoutMaterialTitles();
};

course();
