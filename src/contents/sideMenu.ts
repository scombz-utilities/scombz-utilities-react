import type { PlasmoCSConfig } from "plasmo";
// import { defaultSaves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const styleSidemenu = () => {
  if (document.getElementById("sidemenu") === null) {
    return;
  }

  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/side_menu.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  //LMSページ飛び出る問題
  if (location.href.includes("https://scombz.shibaura-it.ac.jp/lms/course?")) {
    const contentsDetails = document.querySelectorAll(".contents-detail");
    for (const contentsDetail of contentsDetails) {
      const targetNode: HTMLElement = contentsDetail.parentNode as HTMLElement;
      const targetNodeParent: HTMLElement = targetNode.parentNode as HTMLElement;
      if (targetNodeParent?.classList?.contains("block") && targetNodeParent?.classList?.contains("clearfix")) {
        setTimeout(() => {
          targetNode.style.height = contentsDetail.clientHeight + "px";
          if (targetNode.previousElementSibling)
            (targetNode.previousElementSibling as HTMLElement).style.height = contentsDetail.clientHeight + "px";
        }, 300);
      }
    }
  }
  //ヘッダ中心にアイコンを表示 ヘッダをクリックで一番上へ
  chrome.storage.local.get(
    {
      headLinkTo: "/portal/home",
    },
    (items) => {
      const pageHead = document.getElementById("page_head");
      if (pageHead) {
        pageHead.insertAdjacentHTML(
          "beforeend",
          `<a href="${items.headLinkTo}" id="pagetop-head-logo">
            <div class="mainmenu-head-logo"><img src="/sitelogo" class="scombz-icon" alt="Top"></div>
          </a>`,
        );
      }
    },
  );
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
        <a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt info-color sidemenu-icon info-icon" href="https://scombz.shibaura-it.ac.jp/portal/home/information/list" style="height: 50px;border-top: 1px solid #CCC;">お知らせ</a>
        <a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt questionnaire-color sidemenu-icon questionnaire-icon" href="https://scombz.shibaura-it.ac.jp/portal/surveys/list" style="height: 50px;">アンケート</a>
        `,
    );
  }
  console.log("サイドメニューのスタイルを変更しました");
  return;
};

styleSidemenu();
