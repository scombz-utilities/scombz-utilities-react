export const styleBody = () => {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/body_no_margin.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};
