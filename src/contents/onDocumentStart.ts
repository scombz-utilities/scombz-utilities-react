import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_start",
};

const hideSideMenu = () => {
  const closeButton = document.getElementById("sidemenuClose");
  if (closeButton) {
    //一時的にサイドメニューのtransitionを無効化する
    document.getElementById("sidemenu").style.transition = "none";
    closeButton.click();
    //逆に開く問題の修正
    if (!document.getElementById("sidemenu").classList.contains("sidemenu-close")) {
      document.getElementById("sidemenu").classList.add("sidemenu-close");
    }
    if (!document.getElementById("pageMain").classList.contains("sidemenu-hide")) {
      document.getElementById("pageMain").classList.add("sidemenu-hide");
    }
    if (!document.getElementById("pageMain").classList.contains("sidemenu-hide")) {
      document.getElementById("pageMain").classList.add("sidemenu-hide");
    }
    //サイドメニューのtransitionをデフォルトに復元する
    document.getElementById("sidemenuOpen").addEventListener(
      "click",
      () => {
        document.getElementById("sidemenu").style.transition = "";
      },
      { once: true, capture: true },
    );
  }
};
document.addEventListener("DOMContentLoaded", async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.hideSideMenu) hideSideMenu();
});
