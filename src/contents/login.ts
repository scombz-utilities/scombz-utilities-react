import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Settings } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/login*"],
  run_at: "document_start",
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("scombz login");

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

  const oshirase = document.querySelector("#information .infotext");
  const currentData = await chrome.storage.local.get(defaultSaves);

  currentData.scombzData.beforeLoginOshirase = oshirase?.outerHTML;
  await chrome.storage.local.set(currentData);

  const settings = currentData.settings as Settings;
  if (settings.clickLogin) {
    location.href =
      "https://scombz.shibaura-it.ac.jp/saml/login?idp=http://adfs.sic.shibaura-it.ac.jp/adfs/services/trust";
  }
});
