import type { PlasmoCSConfig } from "plasmo";
import { toEscapedEUCJP } from "./util/encoding";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

const locationRegEx = /https?:\/\/syllabus.sic.shibaura-it.ac.jp\/(din|arc|dsn|sys|ko1)\.html.*/;

export const config: PlasmoCSConfig = {
  matches: ["http://syllabus.sic.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const hideSearchBox = async () => {
  const form = document.querySelector("form.form-inline");
  const beforeConatiner = document.querySelector(".container:has(+ .namazu-result-header)");

  if (form) {
    const wrapper = document.createElement("div");

    wrapper.style.overflow = "hidden";
    wrapper.style.transition = "max-height 0.3s ease-in-out";
    wrapper.style.maxHeight = "0";

    form.parentNode.insertBefore(wrapper, form);
    wrapper.appendChild(form);
    if (beforeConatiner) wrapper.appendChild(beforeConatiner);

    const toggleButton = document.createElement("button");
    toggleButton.textContent = "検索Boxを開く";
    toggleButton.style.display = "none";
    toggleButton.style.margin = "0 auto";
    toggleButton.type = "button"; // フォーム送信を防ぐ
    toggleButton.addEventListener("click", () => {
      const isOpen = wrapper.style.maxHeight !== "0px";
      wrapper.style.maxHeight = isOpen ? "0" : `${form.scrollHeight}px`;
    });
    wrapper.parentNode.insertBefore(toggleButton, wrapper);
  }
};

const fixDisplayBug = async () => {
  const strongAnchorList = [...document.querySelectorAll("a:has(strong)")] as HTMLAnchorElement[];
  strongAnchorList.forEach((anchor) => {
    if (anchor.href?.startsWith("http://syllabus.sic.shibaura-it.ac.jp/syllabus/")) return;
    const correctURL = anchor.outerHTML.match(/href="(http[^"]*)"/);
    if (correctURL && correctURL.length > 1) {
      anchor.setAttribute("href", correctURL[1]);
      anchor.innerHTML = anchor.innerHTML.replace(/href="http[^"]*"(&gt;)?/, "").replace(/^\"/, "");
      anchor.parentElement?.querySelector("a:not([href])")?.remove();
    }
  });
};

const linkToManualSearch = async () => {
  const header = document.querySelector(".namazu-result-header");
  if (!header) return;
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  const fac = currentData.settings.faculty;
  const bArray = ["ko1", "arc", "sys", "dsn", "mst", "dcr"];
  let paragraph = "";
  if (fac === "din") {
    paragraph = `うまく検索できない場合は手動で探してみて下さい。<br />
      修士の方は<a href="http://syllabus.sic.shibaura-it.ac.jp/mst.html?f=din&b=5">こちら</a><br />
      博士の方は<a href="http://syllabus.sic.shibaura-it.ac.jp/dcr.html?f=din&b=6">こちら</a>
      `;
  } else {
    const url = fac
      ? `http://syllabus.sic.shibaura-it.ac.jp/${fac}.html?f=${fac}&b=${bArray.indexOf(fac) + 1}`
      : "http://syllabus.sic.shibaura-it.ac.jp/";
    paragraph = `うまく検索できない場合は<a href="${url}">こちらから</a>手動で探してみて下さい。`;
  }
  header.insertAdjacentHTML(
    "beforebegin",
    `
    <style>
    .scombz-utilities-manual-search-box {
      font-size: 2rem;
      text-align: center;
      padding: 1rem;
      margin: 1rem;
      background-color: #f8d7da;
    }
    </style>
  <div class="scombz-utilities-manual-search-box">
    ${paragraph}
  </div>
  `,
  );
};

/**
 * 科目名完全一致があれば、その科目のみ表示する
 */
const filterMatchesBySubjectName = async (rawCourseTitle: string) => {
  const matchedArray = [...document.querySelectorAll(".container > dl > dt a[href]")].filter(
    (a: HTMLElement) => a.innerText.trim() === rawCourseTitle,
  );
  if (matchedArray.length === 0) return;
  matchedArray.forEach((a: HTMLAnchorElement) => {
    a.classList.add("scombz-utilities-matched-course");
  });
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <style>
      .container > dl > dt:has(a[href]) {
        display: none;
      }
      .container > dl > dt:has(a[href]) + dd, .container > dl > dt:has(a[href]) + dd + dd {
        display: none;
      }
      .container > dl > dt:has(a.scombz-utilities-matched-course) {
        display: block;
      }
      .container > dl > dt:has(a.scombz-utilities-matched-course) + dd, .container > dl > dt:has(a.scombz-utilities-matched-course) + dd + dd {
        display: block;
      }
    </style>
    `,
  );
};

const autoRedirect = async () => {
  const matchedCourse = document.querySelectorAll(
    ".container > dl > dt a[href][class='scombz-utilities-matched-course']",
  );
  if (matchedCourse.length === 1) {
    const url = matchedCourse[0].getAttribute("href");
    location.href = url as string;
  } else if (matchedCourse.length > 1) {
    for (const course of matchedCourse) {
      const url = course.getAttribute("href");
      if (url) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");
          const kamokuCD = doc.querySelector("#KamokuCD") as HTMLDivElement;
          const teachers = [...doc.querySelectorAll("td.teacher")] as HTMLDivElement[];
          course.insertAdjacentHTML(
            "afterend",
            `
            <div style="font-size: 1.5rem; margin-top: .2rem; margin-left: .5rem; display: grid; grid-template-columns: 85px 1fr; font-weight: normal;">
              <div>学科コード:</div><div style="font-weight: bold;">${kamokuCD?.innerText?.match(/^[A-Z]+/)?.[0] ?? "-"}</div>
              <div>担当教員:</div><div>${teachers?.map((teacher) => teacher.innerText)?.join(", ")}</div>
            <div>
          `,
          );
        } catch (error) {
          console.error(`Fetch error for URL: ${url}`, error);
        }
      }
    }
  }
};

const onNoMatch = async (rawCourseTitle: string, retryCount: number) => {
  const matchedCourse = document.querySelectorAll(".container > dl > dt a[href]");
  if (matchedCourse.length === 0 && retryCount === 0) {
    const newCourseTitle = rawCourseTitle
      .replace(/[！-／：-＠［-｀｛-～、-〜”’・&]+/g, " ")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, "");
    location.href = location.href.replace(/query=[^&]+/, `query=${toEscapedEUCJP(newCourseTitle)}`) + "&retryCount=1";
  }
  if (matchedCourse.length === 0 && retryCount === 1) {
    const searchResult = (document.querySelector(".namazu-result-header h2 + p") as HTMLParagraphElement).innerText
      .replace(/\s/g, "")
      .match(/\[[^\]]+\]/g);
    const filteredSearchWord = searchResult
      ?.filter((result) => result.match(/:([0-9]+)\]/)?.[1] !== "0")
      .map((result) => result.replace(/^\[(.+):[0-9]+\]$/, "$1"));
    const newCourseTitle = filteredSearchWord?.join(" ") || "";
    location.href = location.href
      .replace(/query=[^&]+/, `query=${toEscapedEUCJP(newCourseTitle)}`)
      .replace(/retryCount=1/, "retryCount=2");
  }
};

const loadFaculty = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  const enterYear = document.querySelector("select#enterYear") as HTMLSelectElement;
  const division = document.querySelector("select#division") as HTMLSelectElement;
  const keiretu = document.querySelector("select#keiretu") as HTMLSelectElement;
  const faculty = location.href.match(locationRegEx)[1] as string;

  if (faculty !== currentData.settings.syllabus.faculty) {
    return;
  }

  if (
    enterYear &&
    division &&
    keiretu &&
    currentData.settings.syllabus.enterYear &&
    currentData.settings.syllabus.division
  ) {
    // selectイベントを発火させる
    const event = new Event("change", { bubbles: true });
    enterYear.value = currentData.settings.syllabus.enterYear;
    await setTimeout(() => {}, 300);
    enterYear.dispatchEvent(event);
    division.value = currentData.settings.syllabus.division;
    await setTimeout(() => {}, 300);
    // keiretu.value = currentData.settings.syllabus.keiretu;
  }
};

const saveFaculty = async () => {
  const enterYear = document.querySelector("select#enterYear") as HTMLSelectElement;
  const division = document.querySelector("select#division") as HTMLSelectElement;
  const keiretu = document.querySelector("select#keiretu") as HTMLSelectElement;

  const buttonGroup = document.querySelector(".container > .panel > .panel-body > [align='right']");

  if (enterYear && division && keiretu && buttonGroup) {
    const button = document.createElement("a");
    button.textContent = "検索条件をScombZ Utilitiesに保存";
    button.classList.add("btn");
    button.style.color = "#fff";
    button.style.backgroundColor = "#19867B";
    const firstChild = buttonGroup.firstChild;
    buttonGroup.insertBefore(button, firstChild);
    button.addEventListener("click", async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      currentData.settings.syllabus.enterYear = enterYear.value;
      currentData.settings.syllabus.division = division.value;
      currentData.settings.syllabus.keiretu = keiretu.value;
      currentData.settings.syllabus.faculty = location.href.match(locationRegEx)[1] as
        | "din"
        | "arc"
        | "dsn"
        | "sys"
        | "ko1";
      await chrome.storage.local.set(currentData);
      alert("検索条件を保存しました。\n次回からシラバスを開くときに自動で入力されます。");
    });
  }
};

const linkSyllabus = async () => {
  if (location.href.startsWith("http://syllabus.sic.shibaura-it.ac.jp/namazu")) {
    const url = new URL(location.href);
    const params = url.searchParams;
    if (!params.has("scombzutilities")) return;
    const rawCourseTitle = params.get("scombzutilities");
    const retryCount = parseInt(params.get("retryCount") || "0", 10);
    hideSearchBox();
    linkToManualSearch();
    await fixDisplayBug();
    await filterMatchesBySubjectName(rawCourseTitle);
    autoRedirect();
    onNoMatch(rawCourseTitle, retryCount);
  }

  if (location.href.match(locationRegEx)) {
    saveFaculty();
    setTimeout(() => loadFaculty(), 300);
  }
};

linkSyllabus();
