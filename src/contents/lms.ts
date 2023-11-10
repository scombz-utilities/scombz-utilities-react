import type { PlasmoCSConfig } from "plasmo";
import { getLMSinLMSPage } from "./util/getLMS";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/timetable*"],
  run_at: "document_start",
};

document.addEventListener("DOMContentLoaded", async () => {
  getLMSinLMSPage();
});
