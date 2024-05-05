import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Box, ThemeProvider } from "@mui/material";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";
import { Links } from "./components/Links";
import { TaskList } from "./components/TaskList";
import { TimeTable } from "./components/TimeTable";
import { UserMemo } from "./components/UserMemo";
import { useWindowSize } from "./util/functions";
import { defaultSaves } from "./util/settings";
import type { Saves } from "./util/settings";
import theme from "~/theme";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement,
});

export const getStyle = () => styleElement;

const MenuWidget = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [useSubTimeTable, setUseSubTimeTable] = useState<boolean>(true);
  const [useTaskList, setUseTaskList] = useState<boolean>(true);
  const [useUserMemo, setUseUserMemo] = useState<boolean>(true);
  const [styleSideMenu, setStyleSideMenu] = useState<boolean>(true);

  useEffect(() => {
    const sideMenu = document.getElementById("sidemenu") as HTMLElement;
    setIsMenuOpen(!sideMenu?.classList?.contains("sidemenu-close"));
    const openMenuButton = document.getElementById("sidemenuOpen") as HTMLElement;
    const closeMenuButton = document.getElementById("sidemenuClose") as HTMLElement;
    openMenuButton?.addEventListener("click", () => {
      setIsMenuOpen(true);
    });
    closeMenuButton?.addEventListener("click", () => {
      setIsMenuOpen(false);
    });
    chrome.storage.local.get(defaultSaves, (items: Saves) => {
      setUseSubTimeTable(items.settings.useSubTimeTable);
      setUseTaskList(items.settings.useTaskList);
      setUseUserMemo(items.settings.useUserMemo);
      setStyleSideMenu(items.settings.styleSideMenu);
    });
    setTimeout(() => {
      document.getElementById("sidemenuOpen")?.click();
    }, 300);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, height] = useWindowSize();

  return document.getElementById("sidemenu") && document.getElementById("sidemenuClose") && styleSideMenu ? (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <Box
          onClick={() => {
            document.getElementById("sidemenuClose")?.click();
          }}
          sx={{
            display: isMenuOpen ? "block" : "none",
            position: "fixed",
            top: 0,
            left: 300,
            width: "calc(100% - 300px)",
            height: "100%",
          }}
        >
          {useSubTimeTable && <TimeTable width={width} />}
          {useTaskList && <TaskList width={width} />}
          {useUserMemo && <UserMemo width={width} />}
          <Links width={width} />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <></>
  );
};

export default MenuWidget;
