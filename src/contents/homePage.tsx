import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import type { PlasmoCSConfig } from "plasmo";
import { OpenOptionButton } from "./components/OpenOptionButton";
import theme from "~/theme";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz-utilities.com/*"],
  run_at: "document_end",
};

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement,
});

export const getStyle = () => styleElement;

const HomePage = () => {
  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <OpenOptionButton />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default HomePage;
