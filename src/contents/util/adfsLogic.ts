import { defaultSaves } from "./settings";
import type { Settings } from "./settings";

export const adfsLogic = async () => {
  const adfsButton = document.getElementById("continueButton");
  const adfsPin = <HTMLInputElement>document.getElementById("pin");
  const hasAdfsButton = adfsButton !== null;
  const requiresPin = hasAdfsButton && adfsPin !== null;
  const userId = <HTMLInputElement>document.getElementById("userNameInput");
  const password = <HTMLInputElement>document.getElementById("passwordInput");
  const submit = document.getElementById("submitButton");
  const currentData = await chrome.storage.local.get(defaultSaves);
  const settings = currentData.settings as Settings;
  if (settings.autoAdfs) {
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
      adfsButton.click();
    } else if (userId && password && submit && settings.loginData.username && settings.loginData.password) {
      userId.value = settings.loginData.username;
      password.value = settings.loginData.password;
      setTimeout(() => {
        if (document.getElementById("error") && document.getElementById("error").textContent.trim().length > 0) return;
        submit.click();
      }, 200);
    }
  }
};
