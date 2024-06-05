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

  const [widgetPosition, setWidgetPosition] = useState<"center" | "left" | "right">("center");
  const [widgetWidth, setWidgetWidth] = useState<number>(100);
  const [widgetMaxWidth, setWidgetMaxWidth] = useState<number>(1200);
  const [zoom, setWidgetZoom] = useState<number>(1);

  useEffect(() => {
    const sideMenu = document.getElementById("sidemenu") as HTMLElement;
    setIsMenuOpen(!sideMenu?.classList?.contains("sidemenu-close"));
    const openMenuButton = document.getElementById("sidemenuOpen") as HTMLElement;
    const closeMenuButton = document.getElementById("sidemenuClose") as HTMLElement;
    openMenuButton?.addEventListener("click", () => {
      document.body.style.overflow = "hidden";
      setIsMenuOpen(true);
    });
    closeMenuButton?.addEventListener("click", () => {
      document.body.style.overflow = "auto";
      setIsMenuOpen(false);
    });
    chrome.storage.local.get(defaultSaves, (items: Saves) => {
      setStyleSideMenu(items.settings.styleSideMenu);
      setUseSubTimeTable(items.settings.useSubTimeTable);
      setUseTaskList(items.settings.useTaskList);
      setWidgetOrder(items.settings.widgetOrder);
      setColumnCount(items.settings.columnCount);
      setWidgetPosition(items.settings.widgetPosition);
      setWidgetWidth(items.settings.widgetWidth);
      setWidgetMaxWidth(items.settings.widgetMaxWidth);
      setWidgetZoom(items.settings.widgetZoom);
    });
  }, []);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        document.getElementById("sidemenuClose")?.click();
      }
    };
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [isMenuOpen]);

  const useCalender = useMemo(() => widgetOrder.includes("Calender"), [widgetOrder]);

  const width = useWindowSize()[0] / zoom;

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
            "@media (max-width: 480px)": {
              left: 280,
              width: "calc(100% - 280px)",
            },
            transition: "all 300ms 0s ease",
            height: "100%",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {width >= 540 && (
            <Box
              sx={{
                my: "0",
                mr: widgetPosition === "right" ? "0" : "auto",
                ml: widgetPosition === "left" ? "0" : "auto",
                maxWidth: `${widgetMaxWidth}px`,
                width: `${(widgetWidth / zoom).toFixed(1)}%`,
                transformOrigin: `top ${widgetPosition}`,
                transform: zoom !== 1 ? `scale(${zoom})` : "none",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(1, 1fr)",
                  gap: "10px",
                  padding: "10px",
                  alignItems: "center",
                }}
              >
                {/* 時間割とタスクはフルサイズじゃないとバグる */}
                {useSubTimeTable && <WidgetWrapper widget="TimeTable" width={width} />}
                {useTaskList && <WidgetWrapper widget="TaskList" width={width} />}
                {/* カレンダーがある時は縦幅を占有するのでカレンダーだけ1列にする */}
                {columnCount === 2 && useCalender && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${width > 1100 && widgetOrder.length > 1 ? 2 : 1}, 1fr)`,
                      gap: "10px",
                      px: "2px",
                    }}
                  >
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "10px" }}>
                      {widgetOrder
                        .filter((widgetName) => widgetName !== "Calender")
                        .map((widgetName) => (
                          <WidgetWrapper key={widgetName} widget={widgetName} width={width} />
                        ))}
                    </Box>
                    <WidgetWrapper widget="Calender" width={width} />
                  </Box>
                )}
                {/* カレンダーがない時、1列の時はそのまま並べる */}
                {columnCount === 2 && !useCalender && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${widgetOrder.length > 1 ? 2 : 1}, 1fr)`,
                      gap: "10px",
                      px: "2px",
                    }}
                  >
                    {widgetOrder.map((widgetName) => (
                      <WidgetWrapper key={widgetName} widget={widgetName} width={width} />
                    ))}
                  </Box>
                )}
                {columnCount === 1 && (
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "10px", px: "2px" }}>
                    {widgetOrder.map((widgetName) => (
                      <WidgetWrapper key={widgetName} widget={widgetName} width={width} />
                    ))}
                  </Box>
                )}
              </Box>
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
