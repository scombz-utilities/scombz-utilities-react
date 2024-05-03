import { updateBadgeText } from "./backgrounds/badge";

export type RuntimeMessage = {
  action: "openOption" | "updateBadgeText" | "openNewTabInBackground";
  url?: string;
};

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, _sendResponse) => {
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
    default:
      break;
  }
});

//インストール時
chrome.runtime.onInstalled.addListener(({ reason }) => {
  updateBadgeText();
  console.log(`onInstalled: ${reason}`);
});

//  起動時
chrome.runtime.onStartup.addListener(() => {
  updateBadgeText();
});
