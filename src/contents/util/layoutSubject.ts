import { layoutMaterialTitles } from "./courseLogic";
import type { Saves } from "./settings";

/* 
移行ノート

移行済
- 要素並び替え
- 教材の順番統一
- 教材を一部非表示
- 課題手動追加を科目ページから呼び出す

未移行
- 期限過ぎ課題を非表示
- 期限過ぎテストを非表示
*/

// 先頭にクイックメニューを追加

export const addQuickMenu = async () => {
  if (!document.querySelector(".block.clearfix:has(> .block-title.block-cube")) return;
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/quickmenu.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const quickMenu = document.createElement("div");
  quickMenu.id = "quickMenu";
  document.querySelectorAll(".block.clearfix:has(> .block-title.block-cube").forEach((node) => {
    const id = node.id;
    const title = node.querySelector(".block-title.block-cube .block-title-txt")?.textContent;
    if (!id || !title) return;
    const link = document.createElement("a");
    link.textContent = title;
    link.href = `#${id}`;
    quickMenu.appendChild(link);
  });
  const targetNode = document.querySelector(".course-header") as HTMLElement;
  targetNode.insertAdjacentElement("afterend", quickMenu);
};

// 要素並び替え
export const sortSubjectByOrder = (currentData: Saves) => {
  const orderIds = currentData.settings.subjectOrder;

  const parentContainer = document.getElementById("courseTopForm");
  orderIds?.forEach((id) => {
    const target = document.getElementById(id);
    if (target) {
      parentContainer?.appendChild(target);
    }
  });
};

const getListOfElementsPerClass = () => {
  const resultList: HTMLElement[][] = [];
  const materialListNode = document.getElementById("materialList") as HTMLDivElement;
  let instantElementsPerClass: HTMLElement[] = [];
  materialListNode.childNodes.forEach((node: HTMLElement) => {
    if (!(node instanceof HTMLElement)) return;
    if (node?.matches(".contents-detail.clearfix:has(.block-title.material-sub-color)")) {
      resultList.push(instantElementsPerClass);
      instantElementsPerClass = [];
      instantElementsPerClass.push(node);
    } else {
      instantElementsPerClass.push(node);
    }
  });
  resultList.push(instantElementsPerClass);
  return resultList;
};

// 教材の順番統一
export const forceMaterialOrder = async (currentData: Saves) => {
  const materialList = getListOfElementsPerClass();

  materialList.sort((a, b) => {
    const aNo = a?.[0]?.querySelector(".block-title.material-sub-color")?.textContent?.match(/No\.(\d+)/)?.[1];
    const bNo = b?.[0]?.querySelector(".block-title.material-sub-color")?.textContent?.match(/No\.(\d+)/)?.[1];
    // どちらもない場合は0を返す
    if (!aNo && !bNo) return 0;
    // 片方がない場合はある方を後ろにする
    if (!aNo) return -1;
    if (!bNo) return 1;
    // どちらもある場合は設定に従う
    if (currentData.settings.materialSortOrder === "asc") return parseInt(aNo) - parseInt(bNo);
    return parseInt(bNo) - parseInt(aNo);
  });

  const materialListNode = document.getElementById("materialList") as HTMLDivElement;
  materialList.flat().forEach((node) => {
    materialListNode.appendChild(node);
  });
};

// 教材を一部非表示化
export const hideMaterial = async (currentData: Saves) => {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/hide_material_button.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  const materialList = getListOfElementsPerClass().filter((e) =>
    e?.[0]?.querySelector(".block-title.material-sub-color"),
  );
  materialList.forEach((classElements) => {
    const titleElement = classElements[0] as HTMLElement;
    titleElement.style.position = "relative";
    const toggleButton = document.createElement("div");
    toggleButton.classList.add("scombzUtilitiesHideMaterialButton");
    if (currentData.settings.autoHideMaterial) {
      toggleButton.classList.add("openButton");
      classElements.slice(1).forEach((element) => {
        element.style.overflow = "hidden";
        element.style.maxHeight = "0";
        element.style.padding = "0 6px 0 20px";
        element.style.borderWidth = "0";
        element.style.display = "none";
      });
    } else {
      toggleButton.classList.add("closeButton");
    }
    toggleButton.onclick = () => {
      if (toggleButton.classList.contains("closeButton")) {
        classElements.slice(1).forEach((element) => {
          element.style.transition = "all 0.3s";
          element.style.overflow = "hidden";
          element.style.maxHeight = "0";
          element.style.padding = "0 6px 0 20px";
          element.style.borderWidth = "0";
          setTimeout(() => {
            // element.style.display = "none";
          }, 300);
        });
        toggleButton.classList.remove("closeButton");
        toggleButton.classList.add("openButton");
      } else {
        classElements.slice(1).forEach((element) => {
          element.style.display = "";
          element.style.transition = "all 0.3s";
          element.style.maxHeight = "";
          element.style.padding = "";
          element.style.borderWidth = "";
          setTimeout(() => {
            element.style.overflow = "";
          }, 300);
        });
        toggleButton.classList.remove("openButton");
        toggleButton.classList.add("closeButton");
      }
      setTimeout(() => {
        const materialTitleNode = document.getElementById("materialTitle") as HTMLDivElement;
        const materialContentsNode = document.getElementById("materialContents") as HTMLDivElement;
        const materialListNode = document.getElementById("materialList") as HTMLDivElement;
        let newHeight = 0;
        materialListNode.childNodes.forEach((node: HTMLElement) => {
          if (!(node instanceof HTMLElement)) return;
          newHeight += node.offsetHeight;
        });
        materialTitleNode.style.height = newHeight + "px";
        materialContentsNode.style.height = newHeight + "px";
        layoutMaterialTitles();
      }, 350);
    };
    titleElement.appendChild(toggleButton);
  });

  // 最新のみ表示
  if (currentData.settings.autoHideMaterial === "recent") {
    materialList.sort((a, b) => {
      const aNo = a?.[0]?.querySelector(".block-title.material-sub-color")?.textContent?.match(/No\.(\d+)/)?.[1];
      const bNo = b?.[0]?.querySelector(".block-title.material-sub-color")?.textContent?.match(/No\.(\d+)/)?.[1];
      // 片方がない場合はある方を前にする
      if (!aNo) return 1;
      if (!bNo) return -1;
      // Noが大きいものを最前に
      return parseInt(bNo) - parseInt(aNo);
    });
    (materialList[0][0].querySelector(".scombzUtilitiesHideMaterialButton") as HTMLElement)?.click();
  }
};
