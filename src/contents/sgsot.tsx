import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, Button, Stack, ButtonGroup } from "@mui/material";
import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect, useMemo, useState } from "react";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";
import theme from "~/theme";

export const config: PlasmoCSConfig = {
  matches: ["https://*.sic.shibaura-it.ac.jp/*", "http://*.sic.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

// ユーザ名を入力した際にリダイレクトされるURL:
// https://sgsot.sic.shibaura-it.ac.jp/redirect.php?user=[入力した学番]&domain=sic.shibaura-it.ac.jp

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement,
});

export const getStyle = () => styleElement;

const inputUser = async () => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;

  const userInput = document.querySelector("form[name='login'] input[name='user']") as HTMLInputElement;
  const userName = currentData.settings.loginData.username;
  if (userInput && userName && currentData.settings.autoFillSgsot) {
    userInput.value = userName.toLowerCase().split("@")[0];
  }
};

const AcademicGuidesEn = () => {
  return (
    <>
      <Button
        href="https://www.shibaura-it.ac.jp/en/campus_life/academic_life/academic_guide.html"
        variant="contained"
        target="_blank"
      >
        Open Academic Guides (English)
      </Button>
      <Button href="https://www.shibaura-it.ac.jp/campus_life/class/class.html" target="_blank" variant="text">
        Open Academic Guides (Japanese)
      </Button>
    </>
  );
};

const AcademicGuidesJa = () => {
  type Buttons = {
    name: string;
    url: string;
  };

  const [buttons, setButtons] = useState<Buttons[]>([]);

  useEffect(() => {
    const studentID = location.pathname.split("/")[1].toLowerCase();
    // 学部: a: 工学部, b: システム理工学部, c:デザイン工学部, d: 建築学部
    const faculty = studentID[0];
    const year = parseInt(studentID.slice(2, 4), 10);

    const newButtons: Buttons[] = [];

    // 特殊事例の辞書対応
    if (year === 25) {
      if (faculty === "c") {
        newButtons.push({
          name: `デザイン工学部2025年度入学`,
          url: `https://shibaura-it.notion.site/13f80feff3d1804cb8cae22d3bafe5d5?v=13f80feff3d18187964a000c34d47d73`,
        });
      }
      if (faculty === "d") {
        newButtons.push({
          name: `建築学部2025年度入学`,
          url: `https://www.shibaura-it.ac.jp/extra/tebiki2025/architecture/index.html`,
        });
      }
      setButtons(newButtons);
      return;
    }

    // 25年度からの手引きのURLが変わっている学部がある
    if (year >= 25) {
      if (faculty === "a") {
        newButtons.push({
          name: `工学部20${year}年度入学`,
          url: `https://www.shibaura-it.ac.jp/extra/tebiki20${year}/engineering/index.html`,
        });
      }
      if (faculty === "b") {
        newButtons.push({
          name: `システム理工学部20${year}年度入学`,
          url: `https://www.shibaura-it.ac.jp/extra/tebiki20${year}/systems/index.html`,
        });
      }
    } else {
      switch (faculty) {
        case "a":
          newButtons.push({
            name: `工学部20${year}年度入学`,
            url: `https://guide.shibaura-it.ac.jp/tebiki20${year}/engineering/`,
          });
          break;
        case "b":
          newButtons.push({
            name: `システム理工学部20${year}年度入学`,
            url: `https://guide.shibaura-it.ac.jp/tebiki20${year}/systems/`,
          });
          break;
        case "c":
          newButtons.push({
            name: `デザイン工学部20${year}年度入学`,
            url: `https://guide.shibaura-it.ac.jp/tebiki20${year}/design/`,
          });
          break;
        case "d":
          newButtons.push({
            name: `建築学部20${year}年度入学`,
            url: `https://guide.shibaura-it.ac.jp/tebiki20${year}/architecture/`,
          });
          break;
        default:
          break;
      }
    }

    setButtons(newButtons);
  }, []);

  return (
    <>
      {buttons.map(({ name: buttonName, url: buttonUrl }) => (
        <Button href={buttonUrl} target="_blank" key={buttonName} variant="contained">
          学修の手引き（{buttonName}）を開く
        </Button>
      ))}
      <Button href="https://www.shibaura-it.ac.jp/campus_life/class/class.html" target="_blank" variant="text">
        学修の手引き一覧を開く
      </Button>
    </>
  );
};

const Sgsot = () => {
  const isClassInsert = useMemo(
    () => location.href.match(/^https?:\/\/sgsot[0-9]+[a-z]+\.sic\.shibaura-it\.ac\.jp\/[A-z]{2}[0-9]{5}\/?$/),
    [],
  );

  useEffect(() => {
    const subDomain = location.origin.split(".")[0].split("//")[1];
    if (subDomain === "sgsot") {
      inputUser();
    }
  }, []);

  return isClassInsert ? (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <Stack position={"fixed"} bottom={20} right={20}>
          <ButtonGroup orientation="vertical" aria-label="Open Academic Guide" size="small">
            {chrome.i18n.getUILanguage() === "ja" ? <AcademicGuidesJa /> : <AcademicGuidesEn />}
          </ButtonGroup>
        </Stack>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <></>
  );
};

export default Sgsot;
