import type { PlasmoCSConfig } from "plasmo";
import type { RuntimeMessage } from "../background";
import darkModeCSS from "./util/darkModeCSS";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

//ページ最大横幅
const maxWidthOnSubjPage = (settings: Settings) => {
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/course?")) {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style type="text/css">
      #courseTopForm{
          max-width: ${settings.layout.maxWidthPx.subj}px;
          margin: 0 auto;
      }
      @media(min-width:${settings.layout.maxWidthPx.subj + 1}px){
          .course-header{
              border-left:1px solid #ccc;
              border-right:1px solid #ccc;
          }
      }
      </style>`,
    );
  } else if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/timetable")) {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style type="text/css">
      #timetable{
          max-width: ${settings.layout.maxWidthPx.lms}px;
          margin: 0 auto;
      }
      </style>`,
    );
  } else if (location.href.includes("https://scombz.shibaura-it.ac.jp/lms/course/report/submission")) {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style type="text/css">
      #pageContents{
          max-width: ${settings.layout.maxWidthPx.task}px;
          margin: 0 auto;
      }
      .block{
          margin: 40px 24px 0 34px;
      }
      </style>`,
    );
  }
};

//ページトップボタン
const removePageTop = () => {
  const pageTopBtn = document.querySelector(".page-top-btn");
  if (pageTopBtn) {
    pageTopBtn.remove();
  }
};

//ダイレクトリンク
const removeDirectLink = () => {
  const directLink = document.querySelector(".page-directlink");
  if (directLink) {
    directLink.remove();
  }
};

//拡張機能設定ボタンの追加
const addExtensionSettingsBtn = () => {
  const $headerBtnArea = document.querySelector(".page-head-navi-unordered-list");
  if ($headerBtnArea) {
    $headerBtnArea.insertAdjacentHTML(
      "afterbegin",
      `
        <style>
        @media (max-width:650px){
            #link_to_extention{
                display:none;
            }
        }
        </style>
        <li class="page-head-navi-list">
			<a class="page-head-navi-colomn" href="javascript:void(0);" id="link_to_extention">${chrome.i18n.getMessage("extensionOption")}</a>
		</li>
        `,
    );
    document.getElementById("link_to_extention").addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openOption" } as RuntimeMessage);
    });
  }
  return;
};

// クリックして名前を非表示にする
const clickToHideName = () => {
  const $loginViewName = document.getElementsByClassName("login-view-name")[0] as HTMLElement;
  if ($loginViewName) {
    $loginViewName.insertAdjacentHTML("beforeend", `<style>.name-hidden{opacity:0;}</style>`);
    $loginViewName.addEventListener("click", () => {
      if ($loginViewName.classList.contains("name-hidden")) {
        $loginViewName.classList.remove("name-hidden");
        $loginViewName.style.opacity = "1";
      } else {
        $loginViewName.classList.add("name-hidden");
        $loginViewName.style.opacity = "0";
      }
    });
  }
};

//ページ上部にある固定ヘッダのキモい影を直す
const fixHeadShadow = () => {
  const $headIdList = ["page_head", "examTimer", "survey_timer"];
  for (const $headId of $headIdList) {
    if (document.getElementById($headId)) {
      document.getElementById($headId).style.boxShadow =
        "rgb(60 64 67 / 30%) 0px 1px 2px, rgb(60 64 67 / 15%) 0px 2px 6px 2px";
    }
  }
};

const layout = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;

  if (settings.layout.setMaxWidth) maxWidthOnSubjPage(settings);
  if (settings.layout.removePageTop) removePageTop();
  if (settings.layout.removeDirectLink) removeDirectLink();
  if (settings.layout.clickToHideName) clickToHideName();
  if (settings.customCSS.length > 0) {
    document.head.insertAdjacentHTML("beforeend", `<style>${settings.customCSS}</style>`);
  }
  if (settings.darkMode) {
    document.body.insertAdjacentHTML("afterbegin", `<style>${darkModeCSS}</style>`);
  }
  fixHeadShadow();
  addExtensionSettingsBtn();
};

layout();
