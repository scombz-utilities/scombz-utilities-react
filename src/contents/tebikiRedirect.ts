import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://guide.shibaura-it.ac.jp/*", "https://www.shibaura-it.ac.jp/extra/*"],
  run_at: "document_end",
};

if (
  document.title.includes("404") &&
  document.title.toLowerCase().includes("not") &&
  document.title.toLowerCase().includes("found") &&
  location.href.includes("tebiki")
) {
  location.href = "https://www.shibaura-it.ac.jp/campus_life/class/class.html";
}
