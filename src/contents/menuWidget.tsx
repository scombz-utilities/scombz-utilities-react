import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import styleText from "data-text:./components/firefoxWidgetStyle.module.css";
import type { PlasmoCSConfig } from "plasmo";
import { isFirefox } from "./util/functions";

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

export const getStyle = () => {
  if (isFirefox()) {
    const style = document.createElement("style");
    style.textContent = styleText;
    return style;
  } else {
    return styleElement;
  }
};

const MenuWidget = () => {
  if (isFirefox()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const MenuWidgetFirefox = require("./components/menuWidgetFirefox").default;
    return (
      <CacheProvider value={styleCache}>
        <MenuWidgetFirefox />
      </CacheProvider>
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const MenuWidgetChrome = require("./components/menuWidgetChrome").default;
    return (
      <CacheProvider value={styleCache}>
        <MenuWidgetChrome />
      </CacheProvider>
    );
  }
};

export default MenuWidget;
