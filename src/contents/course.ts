import type { PlasmoCSConfig } from "plasmo";
import { getCourseTitle } from "./util/functions";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course*"],
  run_at: "document_end",
};

//アンケートを取得するかどうかの設定を科目別ページに挿入
const insertSurveyBtnOnSubj = async () => {
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
            <span>この科目のアンケートを課題一覧に表示する</span>
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

const modifyCoursePageTitle = () => {
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
const urlToLink = (): void => {
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

const course = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (currentData.settings.layout.linkify) {
    urlToLink();
  }
  if (currentData.settings.modifyCoursePageTitle) {
    modifyCoursePageTitle();
  }
  if (currentData.settings.useTaskList) {
    insertSurveyBtnOnSubj();
  }
};

course();
