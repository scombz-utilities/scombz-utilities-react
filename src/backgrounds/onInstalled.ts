export const onInstalled = (reason: string) => {
  if (process.env.PLASMO_PUBLIC_ENVIRONMENT === "production") {
    if (reason === "install" || reason === "update") {
      chrome.tabs.create({
        url: `https://scombz-utilities.com/release/${chrome.runtime.getManifest().version}`,
        active: !!(reason === "install"),
      });
    }
  }
};
