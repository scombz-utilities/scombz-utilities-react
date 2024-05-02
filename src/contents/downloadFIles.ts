import JSZip from "jszip";
import type { PlasmoCSConfig } from "plasmo";
import { getCourseTitle, serializeData, isFirefox } from "./util/functions";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course*"],
  run_at: "document_end",
};

const downloadFilesMain = (dlLabels, btn) => {
  const resultURLs = [];
  const resultNames = [];

  const downloadFileRoutine = (label: HTMLElement) => {
    // zip ファイルで画像をダウンロード
    const generateZip = (images) => {
      btn.textContent = "ZIPファイル生成中...(時間がかかります)";
      const zip = new JSZip();

      // フォルダ作成
      let folderName = "download";
      const courseTitle = document.querySelector(
        "#courseTopForm > div.course-header > div:nth-child(1) > div.course-title-txt.course-view-header-txt",
      );
      if (courseTitle) {
        // 科目名を取得する。例えば、「学部 01CD456789 Course Name」のような文字列から科目名（この例では「Course Name」）を抽出する
        const courseName = getCourseTitle();
        const t = new Date();

        folderName = `${courseName}`;
        if (btn.getAttribute("data-title")) folderName += `_${btn.getAttribute("data-title")}`;
        folderName += `_${("00" + (t.getMonth() + 1)).slice(-2)}${("00" + t.getDate()).slice(-2)}_${("00" + t.getHours()).slice(-2)}${("00" + t.getMinutes()).slice(-2)}`;
      }

      // フォルダ下にデータを格納
      images.forEach((image) => {
        if (image.data && image.fileName) {
          zip.file(image.fileName, image.data);
        }
      });

      // zip を生成
      zip
        .generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 3,
          },
        })
        .then((blob) => {
          // ダウンロードリンクを 生成
          const dlLink = document.createElement("a");

          // blob から URL を生成
          const dataUrl = URL.createObjectURL(blob);
          dlLink.href = dataUrl;
          dlLink.download = `${folderName}.zip`;

          // 設置/クリック/削除
          document.body.insertAdjacentElement("beforeend", dlLink);
          dlLink.click();
          dlLink.remove();

          // オブジェクト URL の開放
          setTimeout(() => {
            window.URL.revokeObjectURL(dataUrl);
          }, 1000);
          //終了処理
          setTimeout(() => {
            if (btn.getAttribute("data-title")) btn.textContent = "この回を一括DL";
            btn.textContent = "pdf一括ダウンロード";
            btn.classList.remove("clicked");
          }, 100);
        });
    };
    // 一括ダウンロード
    const dlZip = async (urls) => {
      let downloadCount = 0;
      // JSZip に追加するために非同期リクエストを Promise で wrap
      const imagePromises = urls.map(
        (src, i) =>
          new Promise((resolve, _reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", src, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
              downloadCount++;
              btn.textContent = "ダウンロード中...(" + downloadCount + "/" + urls.length + ")";
              // ファイル名とデータ返却
              const fileName = resultNames[i];
              resolve({ data: this.response, fileName: fileName });
            };
            // reject だと await Promise.all を抜けてしまう
            // => resolve でデータ無し
            xhr.onerror = () => resolve({ data: null });
            xhr.onabort = () => resolve({ data: null });
            xhr.ontimeout = () => resolve({ data: null });
            xhr.send();
          }),
      );

      // すべてのファイルが取得できたら zip 生成
      const images = await Promise.all(imagePromises);
      generateZip(images);
    };

    const tg = label.parentNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = {} as any;
    data.scanStatus = tg.querySelector(".scanStatus").textContent;
    data.fileName = tg.querySelector(".fileName").textContent;
    data.objectName = tg.querySelector(".objectName").textContent;
    data.resource_Id = tg.querySelector(".resource_Id").textContent;
    data.openEndDate = tg.querySelector(".openEndDate").textContent;
    data.dlMaterialId = (tg.querySelector("#dlMaterialId") as HTMLInputElement).value;

    //Ajaxする
    const param = {
      fileName: data.fileName,
      objectName: data.objectName,
      id: data.resource_Id,
      idnumber: (document.querySelector('input[name="idnumber"]') as HTMLInputElement).value,
    };

    const tempUrl = "/lms/course/make/tempfile";
    const queryString = new URLSearchParams(param).toString();
    const url = `${tempUrl}?${queryString}`;
    const mainTry = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          cache: "no-cache",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const e = await response.text();

        const result = {
          fileName: data.fileName,
          fileId: e,
          idnumber: (document.getElementById("idnumber") as HTMLInputElement).value,
          resourceId: data.resource_Id,
          screen: 1,
          contentId: data.dlMaterialId,
          endDate: data.openEndDate,
        };

        const encodedFileName = encodeURIComponent(data.fileName.replace(/\s+/g, "_").replace(/_+/g, "_")).replace(
          /#/g,
          "%23",
        );

        const resultURL = `https://scombz.shibaura-it.ac.jp/lms/course/material/setfiledown/${encodedFileName}?${serializeData(result)}`;
        resultURLs.push(resultURL);
        resultNames.push(data.fileName);

        btn.textContent = `URL取得中...(${resultURLs.length}/${dlLabels.length})`;

        if (resultURLs.length < dlLabels.length) {
          setTimeout(() => {
            downloadFileRoutine(dlLabels[resultURLs.length]);
          }, 100);
        } else {
          btn.textContent = `ダウンロード中...(0/${resultURLs.length})`;
          setTimeout(() => {
            dlZip(resultURLs);
          }, 100);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    mainTry();
  };
  downloadFileRoutine(dlLabels[0]);
};

const downloadFileBundle = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (!currentData.settings.downloadFileBundle) return;

  if (isFirefox)
    //firefoxでは動作しないためreturn
    return;
  setTimeout(() => {
    // 全体のDL
    //ない場合はreturn
    const check = document.querySelector("#courseContent #materialTitle");
    if (check == null) return;
    (document.querySelector("#courseContent #materialTitle") as HTMLElement).style.position = "relative";

    const link = document.createElement("link");
    link.href = chrome.runtime.getURL("css/download_bundle.css"); // 新しいCSSファイルのパス
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    document.querySelector("#courseContent #materialTitle").insertAdjacentHTML(
      "afterbegin",
      `
      <div style="position: absolute; left: 10px; top: 10px;">
        <div id="downloadFileBundle" class="btn btn-primary btn-sm" style="margin-right: 5px;">PDF一括ダウンロード</div>
      </div>`,
    );
    document.querySelector("#downloadFileBundle").addEventListener("click", function () {
      const dlLabels = [...document.querySelectorAll(".course-view-material-file-name > .fileDownload")].filter(
        (e: HTMLElement) => e.innerText.trim().match(/\.pdf$/),
      );
      if (dlLabels.length === 0) return;
      this.classList.add("clicked");
      this.textContent = "URL取得中...";
      downloadFilesMain(dlLabels, this);
    });
    // 回ごとのDL
    const titles = [
      ...document.querySelectorAll(
        "#materialContents > #materialList > .contents-detail.clearfix > .block-title.material-sub-color.block-wide.break > label.bold-txt",
      ),
    ].map((x) => x.textContent.trim());
    [
      ...document.querySelectorAll(
        "#materialContents > #materialList > .contents-list.contents-display-flex.contents-tag.contents-header-txt > .course-view-material-comment.bold-txt",
      ),
    ]
      .map((x) => x.parentNode)
      .forEach((x: HTMLElement, i) => {
        x.style.position = "relative";
        x.insertAdjacentHTML(
          "beforeend",
          `
                <div class="utilities-dl-file-button" data-title="${titles[i]}">
                    この回を一括DL
                </div>
                `,
        );
      });
    document.querySelectorAll(".utilities-dl-file-button").forEach((x) => {
      x.addEventListener("click", function () {
        const dlLabels = [];
        let targetnode = (x.parentNode as HTMLElement).nextElementSibling;
        while (targetnode?.classList.contains("materialCss") && targetnode.querySelector(".fileDownload")) {
          dlLabels.push(targetnode.querySelector(".fileDownload"));
          targetnode = targetnode.nextElementSibling;
        }
        if (dlLabels.length === 0) return;
        this.classList.add("clicked");
        this.textContent = "URL取得中...";
        downloadFilesMain(dlLabels, this);
      });
    });
  }, 500);
};

downloadFileBundle();
