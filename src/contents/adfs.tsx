import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect } from "react";
import { SaveDialog } from "./components/SaveDialog";
import { adfsLogic } from "./util/adfsLogic";
import theme from "~/theme";

export const config: PlasmoCSConfig = {
  matches: ["https://adfs.sic.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement,
});

export const getStyle = () => styleElement;

const Adfs = () => {
  useEffect(() => {
    adfsLogic();
  }, []);

  return document.getElementById("userNameInput") && document.getElementById("passwordInput") ? (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <SaveDialog />
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <></>
  );
};

export default Adfs;
