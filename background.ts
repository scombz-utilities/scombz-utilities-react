// eslint-disable-next-line @typescript-eslint/no-unused-vars
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "open_settings":
      chrome.runtime.openOptionsPage();
      break;
    default:
      break;
  }
});
