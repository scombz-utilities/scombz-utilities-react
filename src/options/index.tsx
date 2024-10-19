const OptionIndex = () => {
  if (process.env.PLASMO_BROWSER === "firefox") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const OptionsIndexFirefox = require("./container/firefox").default;
    return <OptionsIndexFirefox />;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const OptionsIndexChrome = require("./container/chrome").default;
    return <OptionsIndexChrome />;
  }
};

export default OptionIndex;
