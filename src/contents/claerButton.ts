import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

/* clearButton.jsからの移植 */
//更新通知を削除するボタンの追加

const updateClear = async () => {
  const buttonUl = document.getElementsByClassName("page-head-notification-area clearfix")[0];
  if (buttonUl) {
    const button = document.createElement("li");

    const buttonLink = document.createElement("a");
    buttonLink.className = "btn-header-info btnControl";
    buttonLink.id = "ctrl_btn_clear";
    buttonLink.href = "javascript:void(0);";

    let buttonSpan = document.createElement("span");
    buttonSpan.className = "header-icon-space";

    buttonLink.appendChild(buttonSpan);
    buttonLink.insertAdjacentHTML(
      "beforeend",
      `
        <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="opacity: 1;" xml:space="preserve" class="header-img">
        <title>通知削除</title>
        <style type="text/css">
            .st0{fill:#4B4B4B;}
        </style>
        <g>
            <path class="st0" d="M439.114,69.747c0,0,2.977,2.1-43.339-11.966c-41.52-12.604-80.795-15.309-80.795-15.309l-2.722-19.297
                C310.387,9.857,299.484,0,286.642,0h-30.651h-30.651c-12.825,0-23.729,9.857-25.616,23.175l-2.722,19.297
                c0,0-39.258,2.705-80.778,15.309C69.891,71.848,72.868,69.747,72.868,69.747c-10.324,2.849-17.536,12.655-17.536,23.864v16.695
                h200.66h200.677V93.611C456.669,82.402,449.456,72.596,439.114,69.747z" style="fill: rgb(75, 75, 75);"></path>
            <path class="st0" d="M88.593,464.731C90.957,491.486,113.367,512,140.234,512h231.524c26.857,0,49.276-20.514,51.64-47.269
                l25.642-327.21H62.952L88.593,464.731z M342.016,209.904c0.51-8.402,7.731-14.807,16.134-14.296
                c8.402,0.51,14.798,7.731,14.296,16.134l-14.492,239.493c-0.51,8.402-7.731,14.798-16.133,14.288
                c-8.403-0.51-14.806-7.722-14.296-16.125L342.016,209.904z M240.751,210.823c0-8.42,6.821-15.241,15.24-15.241
                c8.42,0,15.24,6.821,15.24,15.241v239.492c0,8.42-6.821,15.24-15.24,15.24c-8.42,0-15.24-6.821-15.24-15.24V210.823z
                M153.833,195.608c8.403-0.51,15.624,5.894,16.134,14.296l14.509,239.492c0.51,8.403-5.894,15.615-14.296,16.125
                c-8.403,0.51-15.624-5.886-16.134-14.288l-14.509-239.493C139.026,203.339,145.43,196.118,153.833,195.608z" style="fill: rgb(75, 75, 75);"></path>
        </g>
        </svg>
        `,
    );

    button.className = "header-clear";

    buttonUl.insertAdjacentHTML(
      "beforebegin",
      `
        <style>
        .header-clear {
            margin-right: 10px;
            float: left;
            margin-top: 5px;
            margin-left: 10px;
        }
        
        .header-icon-space {
            background-color: transparent;
            width: 13px;
            height: 13px;
            display: inline-block;
            position: relative;
            top: -21px;
            left: 40px;
            border-radius: 50%;
        }
        </style>
        `,
    );

    button.appendChild(buttonLink);
    buttonUl.appendChild(button);
    //ボタン追加終了

    //ボタン部分のレイアウト調整
    //透明の赤丸を入れている
    const headerButtons = document.getElementsByClassName("btn-header-info btnControl");
    for (const headerButton of headerButtons) {
      if (headerButton.getElementsByTagName("span").length === 0) {
        buttonSpan = document.createElement("span");
        buttonSpan.className = "header-icon-space";
        headerButton.insertBefore(buttonSpan, headerButton.getElementsByClassName("header-img")[0]);
      }
    }
  }
  const clearButton = document.getElementById("ctrl_btn_clear") as HTMLButtonElement;
  clearButton.addEventListener("click", async () => {
    if (
      document.querySelectorAll("#ctrl_menu_notification > li").length > 1 &&
      window.confirm("通知を削除しますか？")
    ) {
      try {
        const response = await fetch("https://scombz.shibaura-it.ac.jp/updateinfo");
        if (!response.ok) throw new Error("通知の取得に失敗しました");

        const textData = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(textData, "text/html");

        const csrf = (doc.querySelector('input[name="_csrf"]') as HTMLInputElement)?.value;
        const method = (doc.querySelector('input[name="_method"]') as HTMLInputElement)?.value;
        const updateInfoIds = doc.querySelectorAll('input[name="deleteUpdateInfoList"]');

        const postData = new URLSearchParams();
        postData.append("_csrf", csrf);
        postData.append("_method", method);

        updateInfoIds.forEach((input: HTMLInputElement) => {
          postData.append("deleteUpdateInfoList", input.value);
        });

        const deleteResponse = await fetch("https://scombz.shibaura-it.ac.jp/updateinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: postData,
        });

        if (!deleteResponse.ok) throw new Error("通知の削除に失敗しました");

        const notifications = document.querySelectorAll("#ctrl_menu_notification > li");
        for (let i = 0; i < notifications.length - 1; i++) {
          notifications[i].remove();
        }
        document.querySelector("#ctrl_btn_notification > span")!.className = "header-icon-space";
      } catch (error) {
        console.error("error on clearButton.ts:", error);
      }
    }
  });
};

const clearButton = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.updateClear) updateClear();
};

clearButton();
