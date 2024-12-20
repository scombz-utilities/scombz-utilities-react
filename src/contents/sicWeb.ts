import type { PlasmoCSConfig } from "plasmo";
import type { RuntimeMessage } from "../background";

export const config: PlasmoCSConfig = {
  matches: ["https://web.sic.shibaura-it.ac.jp/Scomb_news"],
  run_at: "document_end",
};
const isChrome = () => {
  const ua = navigator.userAgent;
  return ua.includes("Chrome") && !ua.includes("Edge") && !ua.includes("OPR");
};

const article = document.querySelector(
  "main.container > .row > [role='main'] section.plugin-announcements article",
) as HTMLElement;

if (article) {
  const clearButtonTemplate = document.createElement("button");
  clearButtonTemplate.innerHTML = "Clear";
  clearButtonTemplate.style.cssText = `
    padding: .8rem 1.5rem;
    font-size: 1.4rem;
    background-color: #556CD6;
    box-shadow: 0 2px 2px #556CD655;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s;
  `;

  const chromeHistoryButton = clearButtonTemplate.cloneNode(true) as HTMLButtonElement;
  chromeHistoryButton.innerHTML = "Chromeのキャッシュ設定を開く";
  chromeHistoryButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "openNewTab",
      url: "chrome://settings/clearBrowserData",
    } as RuntimeMessage);
  });

  const clearAllButton = clearButtonTemplate.cloneNode(true) as HTMLButtonElement;
  clearAllButton.innerHTML = "全てのサイトのキャッシュをクリア";
  clearAllButton.style.border = "1px solid #FF2F41";
  clearAllButton.style.backgroundColor = "#FFF";
  clearAllButton.style.color = "#FF2F41";
  clearAllButton.style.boxShadow = "none";
  clearAllButton.addEventListener("click", () => {
    if (
      window.confirm(
        "**ScombZ以外の全てのウェブサイトのキャッシュも削除されます。**\n\nこの操作には数十秒かかることがあります。",
      )
    ) {
      clearAllButton.disabled = true;
      clearAllButton.textContent = "キャッシュをクリア中...";
      chrome.runtime.sendMessage(
        {
          action: "clearCache",
          url: "https://scombz.shibaura-it.ac.jp",
        } as RuntimeMessage,
        (response) => {
          alert(response);
          clearAllButton.disabled = false;
          clearAllButton.textContent = "全てのキャッシュをクリア";
        },
      );
    }
  });

  const buttonGroup = document.createElement("div");
  buttonGroup.style.cssText = `
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: .5rem;
    margin: 1rem 0;
    padding: 2rem 0;
  `;
  const text = document.createElement("p");
  text.textContent =
    "※これらのボタンはScombZ Utilitiesによる追加機能です。問い合わせは学情ではなくUtilities運営にお願いします。";
  text.style.color = "#444";

  if (isChrome()) {
    buttonGroup.append(chromeHistoryButton);
  }
  buttonGroup.append(clearAllButton);
  article.appendChild(buttonGroup);

  buttonGroup.appendChild(text);
}
