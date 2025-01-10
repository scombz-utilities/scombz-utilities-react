import type { PlasmoCSConfig } from "plasmo";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/portal/home*"],
  run_at: "document_end",
};

const hideCompletedReports = () => {
  const finRepList = document.querySelectorAll(".portal-subblock-mark-finish");
  for (const finRep of finRepList) {
    (finRep.parentNode.parentNode as HTMLElement).style.display = "none";
  }
};

const styleTopPage = () => {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("css/top_page_layout.css"); // 新しいCSSファイルのパス
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  //リンクをすべて表示する
  const schoolLinkList = document.getElementById("school_link_list");
  if (schoolLinkList) {
    setTimeout(() => {
      (schoolLinkList.querySelector(".portal-link-bottom a") as HTMLElement).click();
    }, 300);
  }
  // 一部範囲だけ4カラムになる謎挙動を消す

  const newStyle = document.createElement("style");
  newStyle.textContent = `
    .portal-subblock-link {
      padding-left: 20px;
    }

    .portal-link-list-li {
      float: left;
      width: 50%;
    }

    @media (max-width: 960px) {
      .portal-link-list-li {
        float: left;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(newStyle);
  // 順番を入れ替える
  const favorites = [
    {
      urlPattern: "sgsot.sic.shibaura-it.ac.jp", // S*gsot
      icon: "sgsot.webp",
    },
    {
      urlPattern: "ami.sic.shibaura-it.ac.jp", // AMI
      icon: "ami.png",
    },
    {
      urlPattern: "syllabus.sic.shibaura-it.ac.jp", // シラバス
    },
    {
      urlPattern: "shibaura.pita.services/career", // CAST(マッチするものが2つあるので注意)
      containPattern: "就職支援",
      icon: "cast.png",
    },
    {
      urlPattern: "station.sic.shibaura-it.ac.jp/facilityreservation/schedule.html", // 施設予約
      icon: "reserve.png",
    },
    {
      urlPattern: "asrv.sic.shibaura-it.ac.jp/STST", // アルバイト管理システム
      icon: "work.png",
    },
    {
      urlPattern: "microsoft-stream", // Microsoft Stream
      icon: "Microsoft_Stream.svg",
    },
    {
      urlPattern: "bus.shibaura-it.ac.jp", // バス時刻表
      icon: "bus.png",
    },
    {
      urlPattern: "supereigo", // スーパー英語
      icon: "supereigoman.png",
    },
  ];

  for (const fav of favorites.reverse()) {
    const favLinks = [
      ...document.querySelectorAll(
        `#school_link_list > dd:has(a.portal-subblock-link-main-a[href*='${fav.urlPattern}'])`,
      ),
    ] as HTMLElement[];
    if (favLinks.length > 0) {
      let idx = 0;
      if (fav.containPattern) {
        idx = favLinks.findIndex((link) => link.textContent.includes(fav.containPattern));
      }
      const favLink = favLinks[idx];
      // 一番上に持ってくる
      document.getElementById("school_link_list").prepend(favLink);
      // アイコンを追加
      if (fav.icon) {
        const icon = document.createElement("img");
        icon.src = chrome.runtime.getURL(`assets/${fav.icon}`);
        icon.style.width = "22px";
        icon.style.height = "22px";
        icon.style.objectFit = "contain";
        icon.style.marginRight = "6px";
        icon.style.transform = "translateY(4px)";
        favLink.querySelector("a.portal-subblock-link-main-a").prepend(icon);
      }
    }
  }
  // ヘッダを一番上に戻す
  const header = document.querySelector("#school_link_list > dt.portal-subblock-link-subtitle");
  if (header) {
    document.getElementById("school_link_list").prepend(header);
  }
  // 全てのリンクのスタイリング
  const linkList = document.querySelectorAll("#school_link_list > dd a.portal-subblock-link-main-a:not(:has(img))");
  linkList.forEach((link: HTMLElement) => {
    // 左端をアイコンの位置に揃える
    link.style.paddingLeft = "29px";
  });
};

const beforeLoginInformation = async (currentData: Saves) => {
  if (currentData.scombzData.beforeLoginOshirase?.length < 130) return;
  const newInfoContainer = document.createElement("div");
  newInfoContainer.classList.add("portal-subblock");

  const newInfoTitle = document.createElement("div");
  newInfoTitle.classList.add("portal-subblock-title", "portal-top-subblock-title", "top_etc_pull");
  newInfoTitle.textContent = "ScombZからのお知らせ";
  newInfoContainer.appendChild(newInfoTitle);

  const newInfoContent = document.createElement("div");
  newInfoContent.style.maxHeight = "200px";
  newInfoContent.style.overflow = "auto";
  newInfoContent.setAttribute("id", "utilities_top_information");
  newInfoContent.innerHTML = currentData.scombzData.beforeLoginOshirase;
  newInfoContainer.appendChild(newInfoContent);

  const insertBefore = document.getElementById("top_information3");
  if (insertBefore) {
    insertBefore.parentNode.insertBefore(newInfoContainer, insertBefore);
  }
};

const topPageLayout = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  const settings = currentData.settings;
  if (settings.hideCompletedReports) hideCompletedReports();
  if (settings.layout.topPageLayout) {
    styleTopPage();
    beforeLoginInformation(currentData);
  }
};

topPageLayout();
