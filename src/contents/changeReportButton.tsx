import type { PlasmoCSConfig } from "plasmo";
import { getTasksByAjax } from "./util/getTaskList";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";
import { SLIDER_BAR_MINS } from "~/constants";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course/report/submission*"],
  run_at: "document_end",
};

//課題提出時の作成にかかった時間をマウス操作だけで入力できるようにボタンとバーを付ける
const createTimeTempBtn = (currentData: Saves) => {
  const timeBoxes = document.getElementsByName("creationTime") as NodeListOf<HTMLInputElement>;
  const mins = SLIDER_BAR_MINS[currentData.settings.timesBtnValue];
  for (const timeBox of timeBoxes) {
    if (timeBox.type != "hidden") {
      const targetNode = timeBox.parentNode.parentNode.parentNode as HTMLElement;
      targetNode.insertAdjacentHTML(
        "beforeend",
        `
        <div class="minBtnArea">
        <input type="button" value="${mins[0]}分" class="minBtn" style="margin-left:25px"/>
        <input type="button" value="${mins[1]}分" class="minBtn"/>
        <input type="button" value="${mins[2]}分" class="minBtn"/>
        <input type="button" value="${mins[3]}分" class="minBtn"/>
        <input type="button" value="${mins[4]}分" class="minBtn"/>
        <input type="button" value="${mins[5]}分" class="minBtn"/>
        <input type="button" value="${mins[6]}分" class="minBtn"/>
        </div>
        <div class="minBarArea">
        <input type="range" min="0" max="${currentData.settings.sliderBarMax}" step="30" class="min-slider-bar">
        </div>
        `,
      );
      if (!timeBox.value) {
        timeBox.value = "0";
      }
      const $minBtns = document.querySelectorAll(".minBtn") as NodeListOf<HTMLInputElement>;
      const $minSliderBars = document.querySelectorAll(".min-slider-bar") as NodeListOf<HTMLInputElement>;
      for (let i = 0; i < $minBtns.length; i++) {
        $minBtns[i].addEventListener("click", () => {
          for (const $minSliderBar of $minSliderBars) {
            $minSliderBar.value = timeBox.value = mins[i % ($minBtns.length / 2)].toString();
          }
        });
      }
      for (const $minSliderBar of $minSliderBars) {
        $minSliderBar.value = timeBox.value;
        $minSliderBar.addEventListener(
          "input",
          () => {
            timeBox.value = $minSliderBar.value;
          },
          false,
        );
      }
    }
  }
  return;
};
//課題提出時名前自動入力
const autoInputNameOnReport = (currentData: Saves) => {
  if (document.getElementById("toDragAndDrop") && document.getElementById("report_submission_btn")) {
    const $nameInputs = document.querySelectorAll('input[name="fileName"]');
    for (const $nameInput of $nameInputs) {
      $nameInput.previousElementSibling.insertAdjacentHTML(
        "beforeend",
        `
        <input type="button" class="autoInputNameBtn" value="自動入力" onclick="javascript:this.parentNode.nextElementSibling.value='${currentData.settings.defaultInputName}';"></input>
        `,
      );
    }
  }
};

export const changeReportBtn = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (currentData.settings.changeReportBtn === false) return;

  //課題提出完了時にAjax通信をして課題一覧を更新
  if (document.querySelector(".contents-detail.contents-complete")) {
    getTasksByAjax();
    currentData.scombzData.lastTaskFetchUnixTime = new Date().getTime();
    chrome.storage.local.set(currentData);
  }

  //時間入力バーを作る
  createTimeTempBtn(currentData);
  //自動入力ボタンを作る
  autoInputNameOnReport(currentData);
  //ボタンを変える
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/new_report_button.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const submitBtnArea = document.querySelector(".block-under-area-btn") as HTMLElement;
  if (submitBtnArea) {
    submitBtnArea.style.maxWidth = "450px";
    if (submitBtnArea.childElementCount === 2) {
      submitBtnArea.firstElementChild.id = submitBtnArea.firstElementChild.id || "back";
      submitBtnArea.appendChild(submitBtnArea.children[0]);
    }
  }
  if (document.querySelector(".page-directlink")) document.querySelector(".page-directlink").remove();
  return;
};

changeReportBtn();
