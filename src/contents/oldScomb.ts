import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://scomb.shibaura-it.ac.jp/portal/index*"],
  run_at: "document_end",
};

const scombLoginBtns = document.querySelectorAll("strong");
for (const scombLoginBtn of scombLoginBtns) {
  if (scombLoginBtn.innerHTML.includes("ScombZ")) {
    (scombLoginBtn.parentNode.parentNode.parentNode as HTMLElement).insertAdjacentHTML(
      "afterbegin",
      `
      <a href="https://scomb.shibaura-it.ac.jp/portal/dologin" style="margin-bottom:5px;">
        <span>
          <strong>学生ログイン</strong>
        </span>
      </a>
      `,
    );
  }
}
