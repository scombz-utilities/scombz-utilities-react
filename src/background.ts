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
    default:
      break;
  }
});
