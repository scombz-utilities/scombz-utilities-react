import markdownit from "markdown-it";
import { toEscapedEUCJP } from "./encoding";
import { getCourseTitle } from "./functions";
import { defaultSaves } from "./settings";
import type { Saves } from "./settings";

//アンケートを取得するかどうかの設定を科目別ページに挿入
export const insertSurveyBtnOnSubj = async () => {
  if (location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/course?")) {
    const $courseTitle = document.querySelector(".course-title-txt");
    if ($courseTitle && !document.getElementById("noticeSurvey")) {
      const $courseName = getCourseTitle();
      const link = document.createElement("link");
      link.href = chrome.runtime.getURL("css/class_survey_button.css"); // 新しいCSSファイルのパス
      link.type = "text/css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
      ($courseTitle.parentNode as HTMLElement).insertAdjacentHTML(
        "beforeend",
        `
          <div class="noticeSurveyBox">
            <input class="ItemBox-CheckBox-Input" type="checkbox" id="noticeSurvey"></input>
            <label class="ItemBox-CheckBox-Label" for="noticeSurvey"></label>
            <span>${chrome.i18n.getMessage("displayThisSurveyForTaskList")}</span>
          </div>`,
      );
      const pageUrl = location.href;
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      const notifySurveySubjects = currentData.settings.notifySurveySubjects;

      //chrome.storageに保存されたオンオフ情報を復元
      (document.getElementById("noticeSurvey") as HTMLInputElement).checked = notifySurveySubjects.some(
        (subject) => subject.name === $courseName,
      );
      //値の変更時にchrome.storageに保存する
      document.getElementById("noticeSurvey").addEventListener("change", () => {
        const filteredNotifySurveySubjects = notifySurveySubjects.filter((subject) => subject.name !== $courseName);
        if ((document.getElementById("noticeSurvey") as HTMLInputElement).checked) {
          filteredNotifySurveySubjects.push({ name: $courseName, url: pageUrl });
        }
        currentData.settings.notifySurveySubjects = filteredNotifySurveySubjects;

        chrome.storage.local.set(currentData);
      });
    }
  }
};

export const modifyCoursePageTitle = () => {
  const courseTitle = document.querySelector(
    "#courseTopForm > div.course-header > div:nth-child(1) > div.course-title-txt.course-view-header-txt",
  );
  if (courseTitle) {
    // 科目名を取得する。
    const courseName = getCourseTitle();

    // 「科目名 - 科目トップ」のような表示にする
    document.title = `${courseName} - ${document.title}`;
  }
};

// URLをハイパーリンクに変換
export const urlToLink = (): void => {
  const linkify = (node: Node): void => {
    const urlPattern: RegExp = /\bhttps?:\/\/[^\s]+\b/g;
    const textNodes: Node[] = [];

    // テキストノードのリストを作成
    const getTextNodes = (n: Node): void => {
      if (n.nodeType === Node.TEXT_NODE) {
        if (n.parentNode && n.parentNode.nodeName !== "A") {
          textNodes.push(n);
        }
      } else {
        n.childNodes.forEach(getTextNodes);
      }
    };

    getTextNodes(node);

    // テキストノード内のURLを<a>タグに置換
    textNodes.forEach((textNode: Node) => {
      const parent = textNode.parentNode;
      if (!parent) return;

      const text: string = textNode.nodeValue || "";
      let remainingText: string = text;
      let match: RegExpExecArray | null;
      let lastLastIndex: number = 0;

      while ((match = urlPattern.exec(remainingText))) {
        // マッチしたURLの前のテキストを追加
        parent.insertBefore(document.createTextNode(remainingText.slice(0, match.index)), textNode);

        // マッチしたURLを<a>タグに置換
        const anchor: HTMLAnchorElement = document.createElement("a");
        anchor.href = match[0];
        anchor.textContent = match[0];
        anchor.classList.add("utilities-anchor");
        anchor.target = "_blank";
        parent.insertBefore(anchor, textNode);

        lastLastIndex = urlPattern.lastIndex;
        remainingText = remainingText.slice(lastLastIndex);
      }

      if (lastLastIndex > 0) {
        // マッチしたURLの後のテキストを追加
        parent.insertBefore(document.createTextNode(remainingText), textNode);
        parent.removeChild(textNode);
      }
    });
  };

  let changed = false;

  const changeURL = (): void => {
    const ps: NodeListOf<HTMLParagraphElement> = document.querySelectorAll("#courseTopForm p");
    if (ps.length > 0 && !changed) {
      const link = document.createElement("link");
      link.href = chrome.runtime.getURL("css/linkify.css"); // 新しいCSSファイルのパス
      link.type = "text/css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
      ps.forEach((p) => {
        if (p.innerText.match(/\bhttps?:\/\/[^\s]+\b/g)) {
          changed = true;
          linkify(p);
        }
      });
    }
  };

  setTimeout(changeURL, 1200);
  window.addEventListener("focus", () => {
    setTimeout(changeURL, 800);
    setTimeout(changeURL, 2500);
  });
};

const loadNotepad = async () => {
  const pageUrl = new URL(window.location.href);
  const idNum = pageUrl.searchParams.get("idnumber");
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  const coursePageMemo = currentData.scombzData.coursePageMemo;
  const memo = coursePageMemo.find((memo) => memo.id === idNum)?.memo || "";
  const mdNotepadArea = document.getElementById("mdNotepadArea") as HTMLDivElement;
  mdNotepadArea.innerHTML = markdownit().render(memo);
};

export const markdownNotePad = (): void => {
  if (!location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/course?")) return;

  // URLを取得
  const pageUrl = new URL(window.location.href);
  const idNum = pageUrl.searchParams.get("idnumber");

  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/markdown_notepad.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  document.querySelector(".contents-title").insertAdjacentHTML(
    "beforebegin",
    `
  <div class="contents-title">
    <div class="contents-title-txt">
      <div class="course-view-title-txt" style="min-height:1em;">
        <span style="float:left;">${chrome.i18n.getMessage("notepad")}</span><span id="mdNotepadAdd"></span>
      </div>
      <div id="mdNotepadArea"></div>
    </div>
  </div>`,
  );
  loadNotepad();
  const mdNotepadArea = document.getElementById("mdNotepadArea") as HTMLDivElement;
  //クリックイベント
  document.getElementById("mdNotepadAdd").addEventListener("click", async () => {
    {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      // 表示されているメモを削除
      while (mdNotepadArea.lastChild) {
        mdNotepadArea.removeChild(mdNotepadArea.lastChild);
      }
      // 入力欄を作成
      const mdNotepad = document.createElement("textarea");
      mdNotepad.id = "mdNotepadMd";
      mdNotepad.value = currentData.scombzData.coursePageMemo.find((memo) => memo.id === idNum)?.memo || "";
      mdNotepadArea.appendChild(mdNotepad);
      mdNotepadArea.insertAdjacentHTML(
        "beforeend",
        `
          <div class="md-exp">
            <a id="mdSaveButton" class="btn btn-inline btn-file-margin btn-txt btn-color">${chrome.i18n.getMessage("dialogSave")}</a>
            <a id="mdCancelButton" class="btn btn-inline btn-file-margin btn-txt btn-color">${chrome.i18n.getMessage("dialogCancel")}</a>
          </div>`,
      );
    }

    // 保存
    document.getElementById("mdSaveButton").addEventListener("click", async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      const coursePageMemoArray = currentData.scombzData.coursePageMemo;
      const mdNotepad = document.getElementById("mdNotepadMd") as HTMLTextAreaElement;
      const coursePageMemo = coursePageMemoArray.find((memo) => memo.id === idNum);
      if (coursePageMemo) {
        coursePageMemo.memo = mdNotepad.value;
      } else {
        const course = getCourseTitle();
        coursePageMemoArray.push({ id: idNum, memo: mdNotepad.value, course });
      }
      currentData.scombzData.coursePageMemo = coursePageMemoArray;
      chrome.storage.local.set(currentData);
      loadNotepad();
    });
    // キャンセル
    document.getElementById("mdCancelButton").addEventListener("click", () => {
      loadNotepad();
    });
  });
};

const splitByNumbers = (input: string): string[] => {
  // 半角・全角数字の直前で分割
  // 半角・全角アルファベットの前後で分割
  const pattern =
    /(?<=\D)(?=\d)|(?<=[^０-９])(?=[０-９])|(?<=[a-z|A-Z])(?=[ａ-ｚ|Ａ-Ｚ])|(?<=[ａ-ｚ|Ａ-Ｚ])(?=[a-z|A-Z])/;
  return input.split(pattern);
};

export const createSyllabusButton = async () => {
  if (!location.href.startsWith("https://scombz.shibaura-it.ac.jp/lms/course?")) return;

  const insertArea =
    document.querySelector(".contents-question-template-area") || document.querySelector(".course-title-txt");

  const year = location.href.split("idnumber=")[1].slice(0, 4);
  const facNumber = location.href.split("idnumber=")[1].slice(4, 6);

  let fac = "";
  if (facNumber === "01") {
    fac = "ko1";
  } else if (facNumber === "02") {
    fac = "arc";
  } else if (facNumber === "03") {
    fac = "sys";
  } else if (facNumber === "04") {
    fac = "dsn";
  } else if (facNumber === "05") {
    fac = "din";
  } else {
    // 博士の番号が違う場合でもシラバス検索は変わらない？
    console.log("createSyllabusButton: 学部特定失敗");
    console.log();
    fac = "din";
  }

  const rawCourseTitle = getCourseTitle().replace(/！-／：-＠［-｀｛-～、-〜”’・]+/g, " ");
  const courseTitle = splitByNumbers(rawCourseTitle).join(" ");
  const searchStr = courseTitle.includes(" ") ? courseTitle : `+subject:"${courseTitle}"`;
  const date = new Date();
  date.setMonth(date.getMonth() - 4);
  const urlParam = `ajaxmode=true&query=${toEscapedEUCJP(searchStr)}&whence=0&idxname=${year}%2F${fac}&max=20&result=normal&sort=score&scombzutilities=true`;

  insertArea.insertAdjacentHTML(
    "afterend",
    `<a href="http://syllabus.sic.shibaura-it.ac.jp/namazu/namazu.cgi?${urlParam}"  target="_blank" rel="noopener noreferrer" class="btn btn-square btn-square-area btn-txt white-btn-color" style="margin-left:40px;margin-bottom:5px;">${chrome.i18n.getMessage("openSyllabus")}</a>
    <span style="margin-left:35px;margin-bottom:10px;font-size:60%;">${chrome.i18n.getMessage("openSyllabusDescription")}</span>
    `,
  );
};

// 長いコンテンツはタイトルが見切れるのでstickyで固定
export const layoutMaterialTitles = async () => {
  const targets = document.querySelectorAll("#courseTopForm > .block > .block-title");
  const windowHeight = window.innerHeight;
  targets.forEach((target: HTMLDivElement) => {
    const iconElement = target.querySelector(".block-title-txt.cube-block-title-txt") as HTMLElement;
    if (!iconElement) return;
    if (target.offsetHeight > windowHeight) {
      iconElement.style.position = "sticky";
      iconElement.style.top = "50%";
      iconElement.style.margin = "calc(50vh - 32px) 0";
    } else {
      iconElement.style.position = "";
      iconElement.style.top = "";
      iconElement.style.margin = "";
    }
  });
};

// emailをコピー
export const copyEmail = async () => {
  const linkList = document.getElementById("linkList") as HTMLDivElement;
  if (!linkList) return;

  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/emails.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  linkList.querySelectorAll(":scope > div > .ml").forEach((ml: HTMLDivElement) => {
    ml.childNodes.forEach((node) => {
      if (node instanceof Text && node.nodeValue?.match(/.+@.+\..+/)) {
        const email = node.nodeValue;
        node.replaceWith(document.createElement("a"));

        const emailLink = ml.querySelector("a") as HTMLAnchorElement;
        emailLink.classList.add("scombz-utilities-email-anchor");
        emailLink.href = "mailto:" + email;
        emailLink.textContent = email;

        const parent = document.createElement("div");
        parent.classList.add("scombz-utilites-email-button-group");

        // コピー
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.style.marginLeft = "10px";
        parent.appendChild(copyButton);
        copyButton.addEventListener("click", (e) => {
          e.preventDefault();
          navigator.clipboard.writeText(email);
          copyButton.textContent = "Copied!";
          setTimeout(() => {
            copyButton.textContent = "Copy";
          }, 1000);
        });

        // gmail
        const gmailButton = document.createElement("button");
        gmailButton.textContent = "Gmail";
        parent.appendChild(gmailButton);
        gmailButton.addEventListener("click", (e) => {
          e.preventDefault();
          const name = ml.childNodes[0].nodeValue.replace(/\s/g, " ").split("/")[0] + " 先生";
          window.open(`https://mail.google.com/mail/?view=cm&to=${email}&body=${encodeURIComponent(name)}`);
        });

        ml.appendChild(parent);
      }
    });
  });
};

//LMSページ飛び出る問題
export const attachOverflowContents = async () => {
  // レポート提出画面等では除く
  if (location.pathname !== "/lms/course" && location.pathname !== "/lms/course/") return;

  const contentsDetails = document.querySelectorAll(".contents-detail");
  for (const contentsDetail of contentsDetails) {
    const targetNode: HTMLElement = contentsDetail.parentNode as HTMLElement;
    const targetNodeParent: HTMLElement = targetNode.parentNode as HTMLElement;

    if (targetNodeParent?.classList?.contains("block") && targetNodeParent?.classList?.contains("clearfix")) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      targetNode.style.height = contentsDetail.clientHeight + "px";
      if (targetNode.previousElementSibling) {
        (targetNode.previousElementSibling as HTMLElement).style.height = contentsDetail.clientHeight + "px";
      }
    }
  }
};
