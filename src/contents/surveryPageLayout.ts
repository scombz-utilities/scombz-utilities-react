import type { PlasmoCSConfig } from "plasmo";
import { fetchSurveys } from "./util/getTaskList";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course/surveys/*"],
  run_at: "document_end",
};

/* ScombZ Utilities */
/* styleSurveys.js */
//アンケート改善
const styleSurveys = () => {
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/course/surveys/take")) {
    //アンケート提出確認画面・アンケート画面
    const $submitBtnArea = document.querySelector(".block-under-area-btn") as HTMLElement;
    if ($submitBtnArea) {
      const link = document.createElement("link");
      link.href = chrome.runtime.getURL("css/survey_layout.css"); // 新しいCSSファイルのパス
      link.type = "text/css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      $submitBtnArea.style.maxWidth = "450px";
      //アンケート提出確認画面
      if ($submitBtnArea.childElementCount === 2) {
        $submitBtnArea.children[1].classList.add("submit");
        $submitBtnArea.appendChild($submitBtnArea.children[0]);
      }
    }
  }
  //アンケート提出完了画面
  if (location.href.includes("https://scombz.shibaura-it.ac.jp/lms/course/surveys/take?complete")) {
    setTimeout(() => {
      fetchSurveys();
    }, 500);
  }
};

const addSurveyListButton = () => {
  // 「科目トップに戻る」ボタン
  const backButton =
    document.getElementById("backManagement") ??
    document.querySelector("#surveysTakeForm > div.block-under-area > div > div > a");

  // アンケート回答完了ページ等かを判定する
  const isCompleted =
    location.hostname === "scombz.shibaura-it.ac.jp" &&
    location.pathname === "/lms/course/surveys/take" &&
    backButton !== null;

  if (isCompleted) {
    // 「科目トップに戻る」ボタンを基に「アンケート一覧に戻る」ボタンを生成する
    const surveyListButton = backButton.cloneNode(true) as HTMLAnchorElement;
    surveyListButton.id = "backSurveys";
    surveyListButton.href = "/portal/surveys/list";
    surveyListButton.textContent = chrome.i18n.getMessage("surveyBackToList");

    // 「科目トップに戻る」ボタンの隣に「アンケート一覧に戻る」ボタンを追加する
    backButton.after(surveyListButton);
  }
};

const surveyPageLayout = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (!currentData.settings.styleSurveys) return;
  styleSurveys();
  addSurveyListButton();
};

surveyPageLayout();
