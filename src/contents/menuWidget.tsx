import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Box, ThemeProvider } from "@mui/material";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useMemo, useState } from "react";
import { WidgetWrapper } from "./components/WidgetWrapper";
import type { Widget } from "./types/widget";
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
  const [styleSideMenu, setStyleSideMenu] = useState<boolean>(true);

  const [useSubTimeTable, setUseSubTimeTable] = useState<boolean>(true);
  const [useTaskList, setUseTaskList] = useState<boolean>(true);

  const [widgetOrder, setWidgetOrder] = useState<Widget[]>([]);
  const [columnCount, setColumnCount] = useState<number>(2);

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
      setStyleSideMenu(items.settings.styleSideMenu);
      setUseSubTimeTable(items.settings.useSubTimeTable);
      setUseTaskList(items.settings.useTaskList);
      setWidgetOrder(items.settings.widgetOrder);
      setColumnCount(items.settings.columnCount);
    });
  }, []);

  const useCalender = useMemo(() => widgetOrder.includes("Calender"), [widgetOrder]);

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
          {width >= 540 && (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "10px", padding: "10px" }}>
              {/* 時間割とタスクはフルサイズじゃないとバグる */}
              {useSubTimeTable && <WidgetWrapper widget="TimeTable" width={width} />}
              {useTaskList && <WidgetWrapper widget="TaskList" width={width} />}
              {/* カレンダーがある時は縦幅を占有するのでカレンダーだけ1列にする */}
              {columnCount === 2 && useCalender && (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  <WidgetWrapper widget="Calender" width={width} />
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "10px" }}>
                    {widgetOrder
                      .filter((widgetName) => widgetName !== "Calender")
                      .map((widgetName) => (
                        <WidgetWrapper key={widgetName} widget={widgetName} width={width} />
                      ))}
                  </Box>
                </Box>
              )}
              {/* カレンダーがない時、1列の時はそのまま並べる */}
              {columnCount === 2 && !useCalender && (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {widgetOrder.map((widgetName) => (
                    <WidgetWrapper key={widgetName} widget={widgetName} width={width} />
                  ))}
                </Box>
              )}
              {columnCount === 1 && (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "10px" }}>
                  {widgetOrder.map((widgetName) => (
                    <WidgetWrapper key={widgetName} widget={widgetName} width={width} />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <></>
  );
};

export default MenuWidget;
