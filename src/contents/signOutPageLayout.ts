import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/logout*"],
  run_at: "document_end",
};

const signOutLayout = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.signOutPageLayout) {
    const $logoutMainContent = document.getElementById("logout") as HTMLElement;
    const $logoutButton = document.querySelector(".btn-logout") as HTMLElement;
    if ($logoutMainContent && $logoutButton) {
      $logoutButton.style.background = "#f43c49";
      $logoutButton.style.border = "1px solid #ff0000";
      $logoutButton.style.boxShadow = "none";
      $logoutButton.style.fontWeight = "bold";

      $logoutMainContent.style.width = "100%";
      $logoutMainContent.style.margin = "0 auto";
      $logoutMainContent.style.minWidth = "0";

      const link = document.createElement("link");
      link.href = chrome.runtime.getURL("css/sign_out.css"); // 新しいCSSファイルのパス
      link.type = "text/css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      $logoutButton.insertAdjacentHTML(
        "afterend",
        `<br><a class="btn-inline btn-back btn-color btn-txt" href="#" onclick="history.back(-1);return false;" >戻る</a>`,
      );
    }
  }
};

signOutLayout();
