import { migrate } from "./migration";
export const onInstalled = (reason: string) => {
  if (process.env.PLASMO_PUBLIC_ENVIRONMENT === "development") return;
  if (chrome.runtime.getManifest().version === "4.1.0") {
    migrate();
    return;
  }
  if (reason === "install" || reason === "update") {
    chrome.tabs.create({
      url: `https://scombz-utilities.com/release/${chrome.runtime.getManifest().version}`,
      active: !!(reason === "install"),
    });
  }
};
