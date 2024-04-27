chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  switch (message.type) {
    case "open_settings":
      chrome.runtime.openOptionsPage();
      break;
    default:
      break;
  }
});
