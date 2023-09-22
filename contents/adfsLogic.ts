import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./settings";

export const config: PlasmoCSConfig = {
  matches: ["https://adfs.sic.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

console.log("adfs");
const adfsButton = document.getElementById("continueButton");

const adfsPin = <HTMLInputElement>document.getElementById("pin");
const hasAdfsButton = adfsButton !== null;
const requiresPin = hasAdfsButton && adfsPin !== null;
const userId = <HTMLInputElement>document.getElementById("userNameInput");
const password = <HTMLInputElement>document.getElementById("passwordInput");
const submit = document.getElementById("submitButton");

const adfsLogic = async () => {
  const currentData = await chrome.storage.local.get(defaultSaves);
  if (currentData.settings.autoAdfs) {
    if (requiresPin) {
      // 2FA
      const adfsPinTip = document.querySelector("#customAuthArea > p:nth-child(3)");
      adfsPinTip.textContent = "MoSICAアプリを起動し、表示されている6桁のワンタイムパスコードを入力してください。";
      const adfsPinPattern = new RegExp("^[0-9]{6}$");
      adfsPin.addEventListener("input", () => {
        if (adfsPinPattern.test(adfsPin.value)) {
          adfsButton.click();
        }
      });
      adfsPin.focus();
    } else if (hasAdfsButton) {
      console.log("adfs login");
      adfsButton.click();
    } else if (
      userId &&
      password &&
      submit &&
      currentData.settings.loginData.username &&
      currentData.settings.loginData.password
    ) {
      if (document.getElementById("error") && document.getElementById("error").textContent.trim().length > 0) return;
      userId.value = currentData.settings.loginData.username;
      password.value = currentData.settings.loginData.password;
      submit.click();
    }
  }
};

adfsLogic();
