import type { PlasmoCSConfig } from "plasmo";
import type { RuntimeMessage } from "../background";
import { getDownloadURL } from "./downloadFiles";
import type { DownloadMetaData } from "./downloadFiles";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const openFileOnBackgroundTab = (element: HTMLElement) => {
  const data = {
    scanStatus: element.querySelector(".scanStatus").textContent,
    fileName: element.querySelector(".fileName").textContent,
    objectName: element.querySelector(".objectName").textContent,
    resource_Id: element.querySelector(".resource_Id").textContent,
    openEndDate: element.querySelector(".openEndDate").textContent,
    dlMaterialId: (element.querySelector("#dlMaterialId") as HTMLInputElement).value,
  } as DownloadMetaData;

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
    document.querySelector(".utilities-contextMenuTarget")?.classList.remove("utilities-contextMenuTarget");
  });
};

const onRightClick = (element: HTMLElement, x: number, y: number, url?: string) => {
  element.classList.add("utilities-contextMenuTarget");
  const contextMenu = document.getElementById("scombzUtilitiesContextMenu");

  const buttonNormal = document.createElement("div");
  buttonNormal.textContent = chrome.i18n.getMessage("openInNewTab");
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
  buttonBack.textContent = chrome.i18n.getMessage("openInNewTabBackground");
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

  const buttonDownload = document.createElement("div");
  buttonDownload.textContent = chrome.i18n.getMessage("downloadLink");
  buttonDownload.classList.add("contextMenuButton");
  buttonDownload.addEventListener("click", async (e) => {
    e.preventDefault();
    const elm = element.parentNode as HTMLElement;
    const data = {
      scanStatus: elm.querySelector(".scanStatus").textContent,
      fileName: elm.querySelector(".fileName").textContent,
      objectName: elm.querySelector(".objectName").textContent,
      resource_Id: elm.querySelector(".resource_Id").textContent,
      openEndDate: elm.querySelector(".openEndDate").textContent,
      dlMaterialId: (elm.querySelector("#dlMaterialId") as HTMLInputElement).value,
    } as DownloadMetaData;
    buttonDownload.textContent = chrome.i18n.getMessage("downloading");
    const donwloadURL = await getDownloadURL(data);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = donwloadURL;
    downloadAnchor.download = data.fileName;
    downloadAnchor.click();
    contextMenu.style.display = "none";
    buttonDownload.textContent = chrome.i18n.getMessage("downloadLink");
  });

  contextMenu.innerHTML = "";
  contextMenu.appendChild(buttonNormal);
  contextMenu.appendChild(buttonBack);
  if (!url) contextMenu.appendChild(buttonDownload);

  contextMenu.style.top = y + "px";
  contextMenu.style.left = x + "px";
  contextMenu.style.display = "block";
};

const mousedownClick = (isCtrlKeyPressed: boolean, items: NodeListOf<HTMLElement>, openInBackground?: boolean) => {
  for (const item of items) {
    item.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.button === 1 || (event.button === 0 && isCtrlKeyPressed)) {
        // ホイールクリック
        // Ctrl + クリック
        if (openInBackground) {
          openFileOnBackgroundTab(item.parentNode as HTMLElement);
        } else {
          item.click();
        }
      }
    });
    item.addEventListener("contextmenu", (event: MouseEvent) => {
      // 右クリック
      if (openInBackground) {
        event.preventDefault();
        onRightClick(item, event.clientX, event.clientY);
      } else {
        item.click();
      }
    });
  }

  return;
};

const mousedownClickLMS = async (isCtrlKeyPressed: boolean) => {
  const LMSLinkElements = document.querySelectorAll(".timetable-course-top-btn") as NodeListOf<HTMLDivElement>;
  LMSLinkElements.forEach((linkElement) => {
    linkElement.addEventListener("contextmenu", (e: MouseEvent) => {
      e.preventDefault();
      onRightClick(
        linkElement,
        e.clientX,
        e.clientY,
        "https://scombz.shibaura-it.ac.jp/lms/course?idnumber=" + linkElement.getAttribute("id"),
      );
    });

    linkElement.addEventListener("mousedown", (e: MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && isCtrlKeyPressed)) {
        // ホイールクリック
        // Ctrl + クリック
        chrome.runtime.sendMessage({
          action: "openNewTabInBackground",
          url: "https://scombz.shibaura-it.ac.jp/lms/course?idnumber=" + linkElement.getAttribute("id"),
        } as RuntimeMessage);
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

  let isCtrlKeyPressed = false;
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      isCtrlKeyPressed = true;
    }
  });
  document.addEventListener("keyup", (e) => {
    if (!e.ctrlKey && !e.metaKey) {
      isCtrlKeyPressed = false;
    }
  });

  if (dlLinks) {
    mousedownClick(isCtrlKeyPressed, dlLinks, true);
  }
  if (dlFiles) {
    mousedownClick(isCtrlKeyPressed, dlFiles);
  }
  if (courseInfo) {
    mousedownClick(isCtrlKeyPressed, courseInfo);
  }
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/timetable")) {
    mousedownClickLMS(isCtrlKeyPressed);
  }
};

mouseDownEvents();
