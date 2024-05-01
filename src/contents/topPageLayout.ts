import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/portal/home*"],
  run_at: "document_end",
};

const hideCompletedReports = () => {
  const finRepList = document.querySelectorAll(".portal-subblock-mark-finish");
  for (const finRep of finRepList) {
    (finRep.parentNode.parentNode as HTMLElement).style.display = "none";
  }
};

const styleTopPage = () => {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/top_page_layout.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  //リンクをすべて表示する
  const $school_link_list = document.getElementById("school_link_list");
  if ($school_link_list) {
    setTimeout(() => {
      ($school_link_list.querySelector(".portal-link-bottom a") as HTMLElement).click();
    }, 300);
  }
};

const topPageLayout = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.hideCompletedReports) hideCompletedReports();
  if (settings.layout.topPageLayout) styleTopPage();
};

topPageLayout();
