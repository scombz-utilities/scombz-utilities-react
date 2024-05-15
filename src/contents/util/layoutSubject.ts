import { jsxToHtml } from "./functions";
import type { Saves } from "./settings";

// 要素並び替え
export const sortSubjectByOrder = async (currentData: Saves) => {
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
export const hideMaterial = async () => {
  const materialList = getListOfElementsPerClass().filter((e) =>
    e?.[0]?.querySelector(".block-title.material-sub-color"),
  );
  materialList.forEach((e) => {});
};
