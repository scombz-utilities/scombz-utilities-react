import type { PlasmoCSConfig } from "plasmo";
import type { RuntimeMessage } from "../background";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const openFileOnBackgroundTab = (element: HTMLElement) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = {} as any;
  data.scanStatus = element.querySelector(".scanStatus").textContent;
  data.fileName = element.querySelector(".fileName").textContent;
  data.objectName = element.querySelector(".objectName").textContent;
  data.resource_Id = element.querySelector(".resource_Id").textContent;
  data.openEndDate = element.querySelector(".openEndDate").textContent;
  data.dlMaterialId = (element.querySelector("#dlMaterialId") as HTMLInputElement).value;

  const param = {
    fileName: data.fileName,
    objectName: data.objectName,
    id: data.resource_Id,
    idnumber: (document.querySelector('input[name="idnumber"]') as HTMLInputElement).value,
    redirectIdNumber: (document.getElementById("idnumber") as HTMLInputElement).value,
    resource_Id: data.resource_Id,
    dlMaterialId: data.dlMaterialId,
    openEndDate: data.openEndDate,
  };

  const tempUrl = "https://scombz.shibaura-it.ac.jp/lms/course/make/tempfile";
  const queryString = new URLSearchParams(param).toString();
  const url = `${tempUrl}?${queryString}&scombzExtensionRedirect=true`;
  chrome.runtime.sendMessage({ action: "openNewTabInBackground", url } as RuntimeMessage);
};

const insertContextMenu = () => {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/context_menu.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  document.body.insertAdjacentHTML("beforeend", `<div id="scombzUtilitiesContextMenu"></div>`);
  document.body.addEventListener("click", () => {
    document.getElementById("scombzUtilitiesContextMenu").style.display = "none";
  });
};

const onRightClick = (element: HTMLElement, x: number, y: number, url?: string) => {
  const contextMenu = document.getElementById("scombzUtilitiesContextMenu");

  const buttonNormal = document.createElement("div");
  buttonNormal.textContent = "新しいタブで開く";
  buttonNormal.classList.add("contextMenuButton");
  buttonNormal.addEventListener("click", (e) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      element.click();
    }
    e.preventDefault();
    contextMenu.style.display = "none";
  });

  const buttonBack = document.createElement("div");
  buttonBack.textContent = "バックグラウンドで開く";
  buttonBack.classList.add("contextMenuButton");
  buttonBack.addEventListener("click", (e) => {
    e.preventDefault();
    if (url) {
      chrome.runtime.sendMessage({
        action: "openNewTabInBackground",
        url,
      } as RuntimeMessage);
    } else {
      openFileOnBackgroundTab(element.parentNode as HTMLElement);
    }
    contextMenu.style.display = "none";
  });

  contextMenu.innerHTML = "";
  contextMenu.appendChild(buttonNormal);
  contextMenu.appendChild(buttonBack);

  contextMenu.style.top = y + "px";
  contextMenu.style.left = x + "px";
  contextMenu.style.display = "block";
};

const mousedownClick = (items: NodeListOf<HTMLElement>, openInBackground?: boolean) => {
  for (const item of items) {
    item.addEventListener("mousedown", (event: MouseEvent) => {
      switch (event.button) {
        case 1:
          // ホイールクリック
          if (openInBackground) {
            openFileOnBackgroundTab(item.parentNode as HTMLElement);
          } else {
            item.click();
          }
          break;
        case 2:
          // 右クリック
          if (openInBackground) {
            event.preventDefault();
            onRightClick(item, event.clientX, event.clientY);
          } else {
            item.click();
          }
          break;
        default:
      }
    });
    if (openInBackground) {
      item.addEventListener("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
      });
    }
  }
  return;
};

const mousedownClickLMS = async () => {
  const LMSLinkElements = document.querySelectorAll(".timetable-course-top-btn") as NodeListOf<HTMLDivElement>;
  LMSLinkElements.forEach((linkElement) => {
    linkElement.addEventListener("contextmenu", (e: MouseEvent) => {
      e.preventDefault();
    });
    linkElement.addEventListener("mousedown", (e: MouseEvent) => {
      if (e.button === 1) {
        // ホイールクリック
        chrome.runtime.sendMessage({
          action: "openNewTabInBackground",
          url: "https://scombz.shibaura-it.ac.jp/lms/course?idnumber=" + linkElement.getAttribute("id"),
        } as RuntimeMessage);
      }
      if (e.button === 2) {
        // 右クリック
        onRightClick(
          linkElement,
          e.clientX,
          e.clientY,
          "https://scombz.shibaura-it.ac.jp/lms/course?idnumber=" + linkElement.getAttribute("id"),
        );
      }
    });
  });
};

const mouseDownEvents = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (!currentData.settings.modifyClickableLinks) return;
  const dlLinks = document.querySelectorAll(".fileDownload") as NodeListOf<HTMLElement>;
  const dlFiles = document.querySelectorAll(".downloadFile") as NodeListOf<HTMLElement>;
  const courseInfo = document.querySelectorAll(".course-view-information-name") as NodeListOf<HTMLElement>;
  insertContextMenu();
  if (dlLinks) {
    mousedownClick(dlLinks, true);
  }
  if (dlFiles) {
    mousedownClick(dlFiles);
  }
  if (courseInfo) {
    mousedownClick(courseInfo);
  }
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/timetable")) {
    mousedownClickLMS();
  }
};

mouseDownEvents();
