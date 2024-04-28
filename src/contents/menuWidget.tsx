import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Box } from "@mui/material";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";
import { TaskList } from "./components/TaskList";
import { TimeTable } from "./components/TimeTable";

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
  }, []);

  return document.getElementById("sidemenu") && document.getElementById("sidemenuClose") ? (
    <CacheProvider value={styleCache}>
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
        <TimeTable />
        <TaskList />
      </Box>
    </CacheProvider>
  ) : (
    <></>
  );
};

export default MenuWidget;
