import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/login*"],
  run_at: "document_start",
};

const getOshirase = () => {
  const target = document.querySelector(".login-body script:nth-child(2)") as HTMLScriptElement;
  let decodedString = target.innerText.trim().split("setJsonData(")[1].split(", 'reference');")[0].slice(1, -1);
  decodedString = decodedString.replace(/\\\\n/g, "\\n"); // 改行
  decodedString = decodedString.replace(/\\t/g, "\t"); // タブ
  decodedString = decodedString.replace(/\\"/g, '"'); // ダブルクォート
  decodedString = decodedString.replace(/\\'/g, "'"); // シングルクォート

  decodedString = decodedString.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
    return String.fromCharCode(parseInt(code, 16)); // Unicodeエスケープシーケンス
  });
  const oshirase = JSON.parse(decodedString);
  return oshirase;
};

document.addEventListener("DOMContentLoaded", async () => {
  // 芝猫を表示
  const topLogo = document.querySelector(".sitelogo");
  if (topLogo) {
    const catImg = document.createElement("img");
    catImg.src = chrome.runtime.getURL("assets/shibaneko.jpeg");
    catImg.style.width = "960px";
    catImg.style.height = "153px";
    const wrapper = document.createElement("div");
    wrapper.style.textAlign = "center";
    wrapper.appendChild(catImg);
    topLogo.insertBefore(wrapper, topLogo.firstChild);
  }

  const currentData = await chrome.storage.local.get(defaultSaves);

  try {
    const oshiraseArray = getOshirase().ops as Array<{ attributes?: { [key: string]: string }; insert: string }>;
    let oshiraseHTML = "";

    for (const oshirase of oshiraseArray) {
      if (oshirase.attributes) {
        const bold = oshirase?.attributes?.bold ? "font-weight: bold;" : "";
        const background = oshirase?.attributes?.background ? `background: ${oshirase.attributes.background};` : "";
        const color = oshirase?.attributes?.color ? `color: ${oshirase.attributes.color};` : "";
        const large = oshirase?.attributes?.size === "large" ? "font-size: 1.5em;" : "";
        const content = oshirase.insert;
        oshiraseHTML += `<p style="${bold} ${color} ${large} ${background}">${content}</p>`;
      }
    }

    currentData.scombzData.beforeLoginOshirase = oshiraseHTML;
    await chrome.storage.local.set(currentData);
  } catch (e) {
    console.error("Failed to get oshirase");
    console.error(e);
  } finally {
    const settings = currentData.settings as Settings;
    if (settings.clickLogin) {
      location.href =
        "https://scombz.shibaura-it.ac.jp/saml/login?idp=http://adfs.sic.shibaura-it.ac.jp/adfs/services/trust";
    }
  }
});
