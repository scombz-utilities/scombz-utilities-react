import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course/report/submission*"],
  run_at: "document_end",
};

//D&Dで課題を出す
const ddSub = () => {
  const DragAndDrop = document.getElementById("toDragAndDrop");
  if (DragAndDrop) {
    setTimeout(() => {
      DragAndDrop.click();
    }, 300);
  }
};

//ScombZバグ修正 D&D時に課題削除できないバグを修正
const submissionBugFix = () => {
  const dadFileAreaAddDiv = () => {
    document.querySelector("#dad_file_area").insertAdjacentHTML(
      "beforeend",
      `
                <div style="display:none;" id="DaDfix">
                <input type="file" class="fileSelectInput" name="uploadFiles" style="display : none;">
                <input type="hidden" class="originalFileName" name="originalFileName" value="">
                <input type="hidden" name="fileId" value="0">
                <input type="hidden" name="rowCounter" value="1">
                <input type="text" name="fileName" class="input input-box">
                <input type="text" name="comment" class="input input-box"></div>`,
    );
  };

  const DaDCheck = () => {
    if (document.querySelector("#dad_file_area > div") == null) {
      dadFileAreaAddDiv();
    } else {
      const dadFix = document.querySelectorAll("#DaDfix");
      if (dadFix.length != 1 || dadFix[0].id != "DaDfix") {
        for (const i of dadFix) {
          i.remove();
        }
      }
    }
    (document.querySelector("#report_submission_btn") as HTMLElement).click();
  };

  if (
    document.querySelectorAll("#toDragAndDrop").length === 1 &&
    document.querySelectorAll("#submissionFileResult").length === 1
  ) {
    const reportBtn = document.querySelector("#report_submission_btn") as HTMLElement;
    reportBtn.style.display = "none";
    reportBtn.insertAdjacentHTML(
      "beforebegin",
      `
        <a id="report_submission_btn_bugfix" class="under-btn btn-txt btn-color">確認画面に進む</a>
        `,
    );

    const button = document.getElementById("report_submission_btn_bugfix") as HTMLButtonElement;
    button?.addEventListener("click", () => {
      DaDCheck();
    });
  }
};

const clearButton = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.forceDragAndDropSubmit) ddSub();
  if (settings.dragAndDropBugFix) submissionBugFix();
};

clearButton();
