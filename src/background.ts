export type RuntimeMessage = {
  action: "openOption" | "updateBadgeText";
};

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, _sendResponse) => {
  switch (message.action) {
    case "openOption":
      chrome.runtime.openOptionsPage();
      break;
    default:
      break;
  }
});
