import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

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

const beforeLoginInformation = async (currentData: Saves) => {
  if (currentData.scombzData.beforeLoginOshirase?.length < 130) return;
  const newInfoContainer = document.createElement("div");
  newInfoContainer.classList.add("portal-subblock");

  const newInfoTitle = document.createElement("div");
  newInfoTitle.classList.add("portal-subblock-title", "portal-top-subblock-title", "top_etc_pull");
  newInfoTitle.textContent = "ScombZからのお知らせ";
  newInfoContainer.appendChild(newInfoTitle);

  const newInfoContent = document.createElement("div");
  newInfoContent.style.maxHeight = "200px";
  newInfoContent.style.overflow = "auto";
  newInfoContent.setAttribute("id", "utilities_top_information");
  newInfoContent.innerHTML = currentData.scombzData.beforeLoginOshirase;
  newInfoContainer.appendChild(newInfoContent);

  const insertBefore = document.getElementById("top_information3");
  if (insertBefore) {
    insertBefore.parentNode.insertBefore(newInfoContainer, insertBefore);
  }
};

const topPageLayout = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  const settings = currentData.settings;
  if (settings.hideCompletedReports) hideCompletedReports();
  if (settings.layout.topPageLayout) {
    styleTopPage();
    beforeLoginInformation(currentData);
  }
};

topPageLayout();
