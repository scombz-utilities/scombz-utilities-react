import type { PlasmoCSConfig } from "plasmo";
import { hideSideMenu } from "./util/sideMenuLogic";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_start",
};

document.addEventListener("DOMContentLoaded", async () => {
  hideSideMenu();
});
hideSideMenu();
