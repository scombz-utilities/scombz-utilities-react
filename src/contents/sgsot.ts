import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://sgsot.sic.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const inputUser = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;

  const userInput = document.querySelector("form[name='login'] input[name='user']") as HTMLInputElement;
  const userName = currentData.settings.loginData.username;
  if (userInput && userName && currentData.settings.autoFillSgsot) {
    userInput.value = userName.toLowerCase().split("@")[0];
  }
};

inputUser();
