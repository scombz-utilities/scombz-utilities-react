import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const styleAdd = () => {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/dialog_style.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

const styleDialog = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (!currentData.settings.styleDialog) return;

  //お知らせダイアログ処理
  const dialogObserver = new MutationObserver((_mutations) => {
    const infoDialog = document.querySelector('[aria-describedby="infoDetailView"]') as HTMLDivElement;
    const progressDialog = document.querySelector('[aria-describedby="progress_dialog"]') as HTMLDivElement;
    const notificationDialog = document.querySelector('[aria-describedby="info_detail_view2"]') as HTMLDivElement;
    const courseDialog = document.querySelector('[aria-describedby="info_detail_view"]') as HTMLDivElement;
    // const virusDialog = document.querySelector('[aria-describedby="ui-id-1"]') as HTMLDivElement;

    const widgetOverlay = document.getElementsByClassName("ui-widget-overlay")[0];

    const contentAppendCSSText = "max-height: calc(90vh - 40px)!important; height: calc(90vh - 40px);";
    const dialogAppendCSSText = "position: fixed; inset: 0; margin: auto; width: 960px; height: fit-content;";

    //  ポータルホームのダイアログの処理
    if (infoDialog && !progressDialog && infoDialog.style.display !== "none") {
      document.getElementById("infoDetailView").style.cssText += contentAppendCSSText;
      infoDialog.style.cssText += dialogAppendCSSText;
      widgetOverlay.addEventListener(
        "click",
        () => {
          (
            infoDialog.querySelector(
              ".commonDialogButtonArea button.under-btn.btn-color.btn-txt.ui-button.ui-corner-all.ui-widget",
            ) as HTMLElement
          ).click();
        },
        { once: true },
      );
      styleAdd();
    }

    //  お知らせのダイアログの処理
    if (notificationDialog && notificationDialog.style.display !== "none") {
      document.getElementById("info_detail_view2").style.cssText += contentAppendCSSText;
      notificationDialog.style.cssText += dialogAppendCSSText;
      widgetOverlay.addEventListener(
        "click",
        () => {
          (
            notificationDialog.querySelector(
              ".commonDialogButtonArea button.under-btn.btn-color.btn-txt.ui-button.ui-corner-all.ui-widget",
            ) as HTMLElement
          ).click();
        },
        { once: true },
      );
      styleAdd();
    }

    //  LMSの授業詳細ページ＆コミュニティ詳細ページのダイアログの処理
    if (courseDialog && courseDialog.style.display !== "none") {
      document.getElementById("info_detail_view").style.cssText += contentAppendCSSText;
      courseDialog.style.cssText += dialogAppendCSSText;
      widgetOverlay.addEventListener(
        "click",
        () => {
          (
            courseDialog.querySelector(
              ".commonDialogButtonArea button.under-btn.btn-color.btn-txt.ui-button.ui-corner-all.ui-widget",
            ) as HTMLElement
          ).click();
        },
        { once: true },
      );
      styleAdd();
    }
  });

  const config = {
    childList: true,
  };

  const target = document.body;

  dialogObserver.observe(target, config);

  return;
};

styleDialog();
