import { Alert, Box, Snackbar, Tab, Tabs, ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AdvancedOptions } from "./components/AdvancedOptions";
import { BasicOptions } from "./components/BasicOptions";
import { CustomCSS } from "./components/CustomCSS";
import { DataOperation } from "./components/DataOperation";
import { Information } from "./components/Information";
import { WidgetOptions } from "./components/WidgetOptions";
import theme from "~/theme";
import { defaultSaves } from "~settings";
import type { Saves } from "~settings";

const OptionsIndex = () => {
  const [currentLocalStorage, setCurrentLocalStorage] = useState<Saves>(defaultSaves);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const setSettings = async (key: string, value: unknown) => {
    const newLocalStorage = {
      ...currentLocalStorage,
      settings: {
        ...currentLocalStorage.settings,
        [key]: value,
      },
    };
    setCurrentLocalStorage(newLocalStorage);
    await chrome.storage.local.set(newLocalStorage);
    setSnackbarOpen(true);
  };

  const setScombzData = async (key: string, value: unknown) => {
    const newLocalStorage = {
      ...currentLocalStorage,
      scombzData: {
        ...currentLocalStorage.scombzData,
        [key]: value,
      },
    };
    setCurrentLocalStorage(newLocalStorage);
    await chrome.storage.local.set(newLocalStorage);
  };

  const currentTab = new URLSearchParams(window.location.search).get("tab");

  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      setCurrentLocalStorage(currentData);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "300px", py: 1 }}
        >
          設定を保存しました
        </Alert>
      </Snackbar>
      <Box p={0} maxWidth={1000} margin="0 auto">
        <Box pt={2} pb={5} mx={0}>
          <Box textAlign="center" mb={2}>
            <img
              src={chrome.runtime.getURL("assets/scombz_utilities.svg")}
              alt="ScombZ Utilities"
              style={{ width: "50%", maxWidth: "250px", margin: "0 auto", display: "block" }}
            />
          </Box>

          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              position: "sticky",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 1,
              backgroundColor: "#fffa",
              backdropFilter: "blur(3px)",
            }}
          >
            <Tabs variant="scrollable" scrollButtons="auto" value={currentTab || "basic"}>
              <Tab component="a" value="basic" href="/options.html?tab=basic" label="基本設定" />
              <Tab component="a" value="widget" href="/options.html?tab=widget" label="ウィジェット設定" />
              <Tab component="a" value="advanced" href="/options.html?tab=advanced" label="詳細設定" />
              <Tab component="a" value="customcss" href="/options.html?tab=customcss" label="カスタムCSS" />
              <Tab component="a" value="data" href="/options.html?tab=data" label={chrome.i18n.getMessage("IOReset")} />
              <Tab component="a" value="info" href="/options.html?tab=info" label="情報" />
            </Tabs>
          </Box>

          <Box py={3}>
            {(currentTab === "basic" || currentTab === null) && (
              <BasicOptions saves={currentLocalStorage} setSettings={setSettings} />
            )}
            {currentTab === "widget" && <WidgetOptions saves={currentLocalStorage} setSettings={setSettings} />}
            {currentTab === "advanced" && (
              <AdvancedOptions saves={currentLocalStorage} setSettings={setSettings} setScombzData={setScombzData} />
            )}
            {currentTab === "customcss" && (
              <CustomCSS
                value={currentLocalStorage.settings.customCSS}
                onSaveButtonClick={(value) => setSettings("customCSS", value)}
              />
            )}
            {currentTab === "data" && <DataOperation saves={currentLocalStorage} setSaves={setCurrentLocalStorage} />}
            {currentTab === "info" && <Information />}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OptionsIndex;
