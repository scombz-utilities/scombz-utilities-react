import { updateBadgeText } from "./backgrounds/badge";
import { getJson } from "./backgrounds/getJson";
import { migrate } from "./backgrounds/migration";
import { onInstalled } from "./backgrounds/onInstalled";

export type RuntimeMessage = {
  action: "openOption" | "updateBadgeText" | "openNewTabInBackground" | "getJson";
  url?: string;
};

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, sendResponse) => {
  switch (message.action) {
    case "openOption":
      chrome.runtime.openOptionsPage();
      break;
    case "openNewTabInBackground":
      chrome.tabs.create({ url: message.url, active: false });
      break;
    case "updateBadgeText":
      updateBadgeText();
      break;
    case "getJson":
      getJson(message, sendResponse);
      break;
    default:
      break;
  }
  return true;
});

//インストール時
chrome.runtime.onInstalled.addListener(({ reason }) => {
  updateBadgeText();
  onInstalled(reason);
  if (reason === "update" && chrome.runtime.getManifest().version === "4.0.0") {
    migrate();
  }
});

//  起動時
chrome.runtime.onStartup.addListener(() => {
  updateBadgeText();
});
