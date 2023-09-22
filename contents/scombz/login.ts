import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/login*"],
  run_at: "document_start",
};

document.addEventListener("DOMContentLoaded", () => {
  document;
});
