import { migrate } from "./migration";

const confirmMigrated = async (reason: string) => {
  const result = await migrate();
  if ((reason === "update" && result !== "alreadyMigrated") || reason === "install") {
    chrome.tabs.create({
      url: `https://scombz-utilities.com/lp/installed`,
      active: true,
    });
    return;
  } else {
    chrome.tabs.create({
      url: `https://scombz-utilities.com/release/${chrome.runtime.getManifest().version}`,
      active: !!(reason === "install"),
    });
  }
};

export const onInstalled = (reason: string) => {
  if (process.env.PLASMO_PUBLIC_ENVIRONMENT === "development") return;
  if (reason === "install" || reason === "update") {
    confirmMigrated(reason);
  }
};
