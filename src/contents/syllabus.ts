import type { PlasmoCSConfig } from "plasmo";
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
      anchor.innerHTML = anchor.innerHTML.replace(/href="http[^"]*"(&gt;)?/, "");
    }
  });
};

const linkToManualSearch = async () => {
  const header = document.querySelector(".namazu-result-header");
  if (!header) return;
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  const fac = currentData.settings.faculty;
  const url = `http://syllabus.sic.shibaura-it.ac.jp/${fac}.html`;
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
    うまく検索できない場合は<a href="${url}">こちらから</a>手動で探してみて下さい。
  </div>
  `,
  );
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
    hideSearchBox();
    fixDisplayBug();
    linkToManualSearch();
  }

  if (location.href.match(locationRegEx)) {
    saveFaculty();
    setTimeout(() => loadFaculty(), 300);
  }
};

linkSyllabus();
