import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const styleSidemenu = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.styleSideMenu === false) return;

  if (document.getElementById("sidemenu") === null) {
    return;
  }

  const anchors = document.querySelectorAll(
    "a.sidemenu-link.sidemenu-lms-link.sidemenu-link-txt.sidemenu-icon",
  ) as NodeListOf<HTMLAnchorElement>;

  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/side_menu.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  // ページ内リンクをクリックしたときにメニューを閉じる
  document.querySelectorAll(".sidemenu-list a.sidemenu-list-colomn").forEach((element) => {
    element.addEventListener("click", () => {
      document.getElementById("sidemenuClose").click();
    });
  });
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/portal/home")) {
    anchors.forEach((anchor) => {
      const onclick = anchor.getAttribute("onclick");
      if (onclick && onclick.startsWith("portalHomeAnchor")) {
        anchor.addEventListener("click", () => {
          document.getElementById("sidemenuClose").click();
        });
      }
    });
  }

  // 英語だといくつか改行されてしまう
  for (const anchor of anchors) {
    if (anchor.textContent?.length > 19) {
      anchor.style.paddingTop = "2px";
    }
  }

  //ヘッダ中心にアイコンを表示 ヘッダをクリックで一番上へ
  const pageHead = document.getElementById("page_head");
  if (pageHead) {
    pageHead.insertAdjacentHTML(
      "beforeend",
      `<a href="${currentData.settings.headLinkTo}" id="pagetop-head-logo">
            <div class="mainmenu-head-logo"><img src="/sitelogo" class="scombz-icon" alt="Top"></div>
          </a>`,
    );
  }
  //サイドメニューの開閉ボタンを変える
  const closeButton = document.getElementById("sidemenuClose");
  if (closeButton) {
    closeButton.classList.add("hamburger-icon");
    closeButton.innerHTML =
      '<div class="hamburger-line"></div>\n<div class="hamburger-line"></div>\n<div class="hamburger-line"></div>';
  }
  //お知らせ、アンケートを直リンクにする
  //お知らせ(ついでにborder-topもつけてスタイル直す)
  const infoButton = document.querySelector(
    ".sidemenu-link.sidemenu-lms-link.sidemenu-link-txt.info-color.sidemenu-icon.info-icon",
  ) as HTMLAnchorElement;
  if (infoButton) {
    infoButton.href = "https://scombz.shibaura-it.ac.jp/portal/home/information/list";
    infoButton.style.borderTop = "1px solid #CCC";
    infoButton.removeAttribute("onclick");
  }
  //アンケート
  const questionnaire = document.querySelector(
    ".sidemenu-link.sidemenu-lms-link.sidemenu-link-txt.questionnaire-color.sidemenu-icon.questionnaire-icon",
  ) as HTMLAnchorElement;
  if (questionnaire) {
    questionnaire.href = "https://scombz.shibaura-it.ac.jp/portal/surveys/list";
    questionnaire.removeAttribute("onclick");
  }
  //お知らせ、アンケートが表示されてないとき追加する
  const comBtn = document.querySelector(
    ".sidemenu-link.sidemenu-lms-link.sidemenu-link-txt.community-search-color.sidemenu-icon.search-icon",
  );
  if (comBtn && !infoButton && !questionnaire) {
    comBtn.insertAdjacentHTML(
      "afterend",
      `
        <br>
        <a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt info-color sidemenu-icon info-icon" href="https://scombz.shibaura-it.ac.jp/portal/home/information/list" style="height: 50px;border-top: 1px solid #CCC;">${chrome.i18n.getMessage("notifications")}</a>
        <a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt questionnaire-color sidemenu-icon questionnaire-icon" href="https://scombz.shibaura-it.ac.jp/portal/surveys/list" style="height: 50px;">${chrome.i18n.getMessage("surveys")}</a>
        `,
    );
  }
  // Background Layer
  const version = chrome.runtime.getManifest().version;
  document.getElementById("pageMain").insertAdjacentHTML(
    "beforeend",
    `
    <div id="graylayer" onclick="document.getElementById('sidemenuClose').click();"></div>
    <p class="usFooter">ScombZ Utilities ver.${version}</p>
    `,
  );
  return;
};

styleSidemenu();
