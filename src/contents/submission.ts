import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course/report/submission*"],
  run_at: "document_end",
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

const dragAndDropStyling = async () => {
  // ドラッグ&ドロップエリアをわかりやすくする
  const dragAndDropArea = document.getElementById("fileDadArea") as HTMLDivElement;
  dragAndDropArea.addEventListener("dragenter", () => {
    dragAndDropArea.classList.add("isDragover");
  });
  dragAndDropArea.addEventListener("dragleave", () => {
    dragAndDropArea.classList.remove("isDragover");
  });
  dragAndDropArea.addEventListener("dragend", () => {
    dragAndDropArea.classList.remove("isDragover");
  });
  dragAndDropArea.addEventListener("drop", () => {
    dragAndDropArea.classList.remove("isDragover");
  });
};

const notifyFileInput = async (files: FileList) => {
  const fileNames = [...files].map((file) => file.name);
  const notify = document.createElement("div");
  notify.style.cssText = `
    position: fixed;
    top: -50%;
    right: 50vw;
    transform: translateX(50%);
    padding: 8px 16px;
    background-color: #1E9F39;
    box-shadow: 0 0 3px #0004;
    color: #fff;
    font-size: 1rem;
    width: 620px;
    border-radius: 8px;
    z-index: 10000;
    opacity: 0;
    transition: top 0.3s ease-in-out, opacity 0.2s ease-in-out;
  `;
  const notifyText = document.createElement("p");
  notifyText.textContent = `以下のファイルを添付しました:`;
  notify.appendChild(notifyText);
  const notifyList = document.createElement("ul");
  fileNames.forEach((name) => {
    const item = document.createElement("li");
    item.textContent = name;
    notifyList.appendChild(item);
  });
  notify.appendChild(notifyList);
  document.body.appendChild(notify);
  await new Promise((resolve) => setTimeout(resolve, 100));
  notify.style.top = "16px";
  notify.style.opacity = "1";
  await new Promise((resolve) => setTimeout(resolve, 4000));
  notify.style.top = "-100%";
  await new Promise((resolve) => setTimeout(resolve, 500));
  notify.remove();
};

const attachFilesToForm = async (files: FileList) => {
  // 標準のドラッグ&ドロップだった場合は切り替えてから処理を行う
  if (document.getElementById("isDragAndDrop").getAttribute("value") === "true") {
    document.getElementById("toSelectFile").click();
  }

  // 最初のファイル入力欄が空かどうかを確認し、必要数分ファイル入力欄を追加する
  const firstInput = document.querySelector("#reportSubmissionForm input[type='file']") as HTMLInputElement;
  for (let i = 1 - firstInput.files.length; i < files.length; i++) {
    const makeInput = document.querySelector(
      "a.input-file-btn-area.btn-inline.btn-txt.btn-color.fileadd",
    ) as HTMLAnchorElement;
    makeInput.click();
  }

  await new Promise((resolve) => setTimeout(resolve, 200));

  const fileInputs = [...document.querySelectorAll("#reportSubmissionForm input[type='file']")].slice(-files.length);
  // 各単一選択 input にファイルを割り当てる
  fileInputs.forEach((input: HTMLInputElement, index) => {
    if (files[index]) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[index]);
      input.files = dataTransfer.files;

      const changeEvent = new Event("change", { bubbles: true });
      input.dispatchEvent(changeEvent);
    }
  });

  notifyFileInput(files);
};

const makeMultipleFileInput = async () => {
  const form = document.querySelector("form#reportSubmissionForm") as HTMLFormElement;
  if (!form) return;

  const multiFileInput = document.createElement("input");
  multiFileInput.type = "file";
  multiFileInput.multiple = true;
  multiFileInput.style.display = "none";
  form.insertAdjacentElement("beforebegin", multiFileInput);

  const inputButton = document.createElement("div");
  inputButton.addEventListener("click", () => {
    multiFileInput.click();
  });

  inputButton.addEventListener("dragenter", () => {
    inputButton.classList.add("isDragover");
  });
  inputButton.addEventListener("dragleave", () => {
    inputButton.classList.remove("isDragover");
  });
  inputButton.addEventListener("dragend", () => {
    inputButton.classList.remove("isDragover");
  });
  inputButton.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  inputButton.addEventListener("drop", (event) => {
    event.preventDefault();
    inputButton.classList.remove("isDragover");
    const files = event.dataTransfer.files;
    attachFilesToForm(files);
  });

  inputButton.textContent = "ファイルをまとめて選択 or ドラッグ&ドロップ";
  inputButton.id = "scombzUtilitiesMultiFileInputArea";

  const poweredBy = document.createElement("span");
  poweredBy.textContent = "Powered by ScombZ Utilities";
  poweredBy.style.fontSize = "0.6rem";
  poweredBy.style.color = "#0004";
  poweredBy.style.position = "absolute";
  poweredBy.style.bottom = "4px";
  poweredBy.style.right = "8px";
  poweredBy.style.fontWeight = "normal";
  inputButton.appendChild(poweredBy);

  form.insertAdjacentElement("afterbegin", inputButton);

  multiFileInput.addEventListener("change", async (event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    attachFilesToForm(files);
  });
};

const clearButton = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;

  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/submission.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  if (settings.dragAndDropBugFix) submissionBugFix();

  if (document.querySelector("#report_dad")) {
    dragAndDropStyling();
    makeMultipleFileInput();
  }
};

clearButton();
