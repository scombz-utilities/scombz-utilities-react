import type { PlasmoCSConfig } from "plasmo";
import { getTasksByAjax } from "./util/getTaskList";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course/examination/*"],
  run_at: "document_end",
};

const styleExam = () => {
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/course/examination/take")) {
    //テストを受ける前の画面
    if (
      document.querySelector(".block-under-area-btn") &&
      document.querySelector(".block-under-area-btn").innerHTML.includes("受験する")
    ) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
            <style>
            .block-under-area .block-under-area-btn{
                margin:0 auto;
            }
            .block-under-area .block-under-area-btn .btn-color{
                display: grid;
                place-items: center;
                margin:10px auto;
                width:100%;
                min-width:140px;
                min-height:50px;
                box-shadow:none;
            }
            .block-under-area .block-under-area-btn #backbtn,#back{
                color:#545555;
                background:#fff;
                font-size:90%;
                border:1px solid #ccc;
                min-height:40px;
            }
            .block-under-area .block-under-area-btn #backbtn:hover,#back:hover{
                border:1px solid #999;
                box-shadow:0 0 3px #888;
            }
            .block-under-area .block-under-area-btn #takebtn{
                color:#fff;
                background:#4892e0;
                font-weight:bold;
                font-size:110%;
                border:1px solid #ccc;
            }
            #confirm_dialog{
                min-height:90px !important;
            }
            #confirm_dialog .block-popup{
                padding-bottom:none !important;
            }
            .ui-dialog-buttonset.commonDialogButtonArea{
                transform:translateX(6px);
            }
            </style>
            `,
      );
      const $submitBtnArea = document.querySelector(".block-under-area-btn") as HTMLElement;
      $submitBtnArea.style.maxWidth = "450px";
      if ($submitBtnArea.childElementCount == 2) {
        $submitBtnArea.appendChild($submitBtnArea.children[0]);
      }
      if (document.querySelector(".page-directlink")) document.querySelector(".page-directlink").remove();
    }
    //テスト中の画面
    if (
      document.querySelector(".block-under-area-btn") &&
      document.querySelector(".block-under-area-btn").innerHTML.includes("一時保存する")
    ) {
      const $examTimer = document.getElementById("examTimer");
      window.onbeforeunload = function (e) {
        if (
          $examTimer &&
          $examTimer.querySelector("a.tempSaveBtn") &&
          $examTimer.querySelector("a.tempSaveBtn").classList.contains("disabled")
        ) {
          window.onbeforeunload = null;
        } else {
          e.returnValue = "ページを離れようとしています。よろしいですか？";
        }
      };
      document.head.insertAdjacentHTML(
        "beforeend",
        `
            <style>
            .block-under-area .block-under-area-btn{
                margin:0 auto;
            }
            .block-under-area .block-under-area-btn .btn-color{
                display: grid;
                place-items: center;
                margin:10px auto;
                width:100%;
                min-width:140px;
                min-height:50px;
                box-shadow:none;
            }
            .block-under-area .block-under-area-btn .takeConfirm{
                color:#fff;
                background:#4892e0;
                font-weight:bold;
                font-size:110%;
                border:1px solid #ccc;
            }
            .block-under-area .block-under-area-btn .tempSaveBtn{
                color:#545555;
                background:#fff;
                font-weight:bold;
                border:1px solid #ccc;
                min-height:40px;
                box-shadow:none;
            }
            .block-under-area .block-under-area-btn .tempSaveBtn:hover{
                border:1px solid #999;
                box-shadow:0 0 3px #888;
            }
            .take-save-temp-area{
                display:block;
            }
            #pagetop-head-logo, #link_to_extention{
                display:none !important;
            }
            </style>
            `,
      );
      const $submitBtnArea = document.querySelector(".block-under-area-btn") as HTMLElement;
      $submitBtnArea.style.maxWidth = "450px";
      //押しても大丈夫なボタン
      const $confirmBtn = document.querySelector(".block-under-area .block-under-area-btn .takeConfirm");
      if ($confirmBtn) {
        $confirmBtn.addEventListener("click", () => {
          window.onbeforeunload = null;
        });
      }

      if ($examTimer && $examTimer.querySelector("a.takeConfirm")) {
        $examTimer.querySelector("a.takeConfirm").addEventListener("click", () => {
          window.onbeforeunload = null;
        });
      }
      if ($submitBtnArea.childElementCount == 2) {
        $submitBtnArea.appendChild($submitBtnArea.children[0]);
      }
      if (document.querySelector(".page-directlink")) document.querySelector(".page-directlink").remove();
      //毎分自動保存
      setInterval(() => {
        const $saveBtn = document.querySelector(".block-under-area .block-under-area-btn .tempSaveBtn") as HTMLElement;
        if (
          $saveBtn &&
          $examTimer &&
          $examTimer.querySelector("a.tempSaveBtn") &&
          !$examTimer.querySelector("a.tempSaveBtn").classList.contains("disabled")
        ) {
          $saveBtn.click();
        }
      }, 60000); //秒数
    }
    //テスト提出確認画面
    if (location.href === "https://scombz.shibaura-it.ac.jp/lms/course/examination/take?confirm") {
      window.onbeforeunload = function (e) {
        e.returnValue = "ページを離れようとしています。よろしいですか？";
      };
      document.head.insertAdjacentHTML(
        "beforeend",
        `
            <style>
            .block-under-area .block-under-area-btn{
                margin:0 auto;
            }
            .block-under-area .block-under-area-btn .btn-color{
                display: grid;
                place-items: center;
                margin:10px auto;
                width:100%;
                min-width:140px;
                min-height:50px;
                box-shadow:none;
            }
            .block-under-area .block-under-area-btn .backbutton{
                color:#545555;
                background:#fff;
                font-size:90%;
                border:1px solid #ccc;
                min-height:40px;
            }
            .block-under-area .block-under-area-btn .backbutton:hover{
                border:1px solid #999;
                box-shadow:0 0 3px #888;
            }
            .block-under-area .block-under-area-btn #submit{
                color:#fff;
                background:#4892e0;
                font-weight:bold;
                font-size:110%;
                border:1px solid #ccc;
            }
            </style>
            `,
      );
      const $submitBtnArea = document.querySelector(".block-under-area-btn") as HTMLElement;
      $submitBtnArea.style.maxWidth = "450px";
      if ($submitBtnArea.childElementCount == 2) {
        $submitBtnArea.appendChild($submitBtnArea.children[0]);
      }
      const $confirmBtnList = [
        ...document.querySelectorAll(".block-under-area .block-under-area-btn a"),
        ...document.querySelectorAll(".timer-btn-confirm-area-btn a"),
      ];
      for (const $confirmBtn of $confirmBtnList) {
        $confirmBtn.addEventListener("click", () => {
          window.onbeforeunload = null;
        });
      }
      if (document.querySelector(".page-directlink")) document.querySelector(".page-directlink").remove();
    }
    //テストを受け終わった画面
    //すでに受けたテストを参照する画面
    if (location.href.includes("examination/take?complete")) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
            <style>
            .block-under-area .block-under-area-btn{
                margin:0 auto;
            }
            .block-under-area .block-under-area-btn .btn-color{
                display: grid;
                place-items: center;
                margin:10px auto;
                min-width:140px;
                min-height:50px;
                box-shadow:none;
                max-width: 440px;
            }
            </style>
            `,
      );
      if (document.querySelector(".page-directlink")) document.querySelector(".page-directlink").remove();
      //提出完了時にAjax通信をして課題一覧を更新
      setTimeout(() => {
        getTasksByAjax();
      }, 500);
    }
    if (location.href.includes("https://scombz.shibaura-it.ac.jp/lms/course/examination/takeresult")) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
            <style>
            .course-header .course-header-detail .contents-detail .hides{
                opacity: 0;
            }
            </style>
            `,
      );
      const contentsInputAreas = document.querySelectorAll(
        ".course-header .course-header-detail .contents-detail .contents-input-area",
      );
      for (const contentsInputArea of contentsInputAreas) {
        contentsInputArea.addEventListener("click", () => {
          if (contentsInputArea.classList.contains("hides")) contentsInputArea.classList.remove("hides");
          else contentsInputArea.classList.add("hides");
        });
      }
    }
  }
  return;
};

const styleExamPageLayout = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (!currentData.settings.styleExam) return;
  styleExam();
};

styleExamPageLayout();
