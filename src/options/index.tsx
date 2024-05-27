import {
  Alert,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  ThemeProvider,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { AdvancedOptions } from "./components/AdvancedOptions";
import { BasicOptions } from "./components/BasicOptions";
import { CustomCSS } from "./components/CustomCSS";
import { DataOperation } from "./components/DataOperation";
import { Information } from "./components/Information";
import { LayoutOptions } from "./components/LayoutOptions";
import { WidgetOptions } from "./components/WidgetOptions";
import theme from "~/theme";
import { defaultSaves } from "~settings";
import type { Saves } from "~settings";

import "./index.css";

const OptionsIndex = () => {
  const [currentTab, setCurrentTab] = useState(new URLSearchParams(window.location.search).get("tab") || "basic");
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

  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      setCurrentLocalStorage(currentData);
    });
  }, []);

  const menus: { value: string; label: string; icon?: JSX.Element }[] = [
    { value: "basic", label: chrome.i18n.getMessage("basicOptions") },
    { value: "widget", label: chrome.i18n.getMessage("widgetOptions") },
    { value: "layout", label: chrome.i18n.getMessage("layoutOptions") },
    { value: "advanced", label: chrome.i18n.getMessage("advancedOptions") },
    { value: "customcss", label: chrome.i18n.getMessage("customCSS") },
    { value: "data", label: chrome.i18n.getMessage("manageOptions") },
    { value: "info", label: chrome.i18n.getMessage("info") },
  ];

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
      <Stack direction="row" spacing={1}>
        <Box
          gap="1rem"
          py="1rem"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "white",
            borderRightColor: grey[300],
            borderRightWidth: "1px",
            borderRightStyle: "solid",
          }}
        >
          <Box textAlign="center" mb={2}>
            <img
              src={chrome.runtime.getURL("assets/scombz_utilities.svg")}
              alt="ScombZ Utilities"
              style={{ width: "50%", maxWidth: "250px", margin: "0 auto", display: "block" }}
            />
          </Box>
          <List>
            {menus.map((menu) => (
              <ListItem
                disablePadding
                key={menu.value}
                onClick={() => {
                  setCurrentTab(menu.value);
                  history.pushState(null, "", `?tab=${menu.value}`);
                }}
                sx={{
                  backgroundColor: currentTab === menu.value ? blue[500] : "transparent",
                  color: currentTab === menu.value ? "white" : "black",
                  transition: "all 0.3s",
                  ":hover": {
                    backgroundColor: currentTab === menu.value ? blue[700] : grey[100],
                    color: currentTab === menu.value ? "white" : "black",
                  },
                }}
              >
                <ListItemButton>
                  {menu.icon && <ListItemIcon>{menu.icon}</ListItemIcon>}
                  <ListItemText>{menu.label}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box
          py={3}
          width="100%"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "calc(100% - 250px - 2rem)",
            padding: "1rem",
          }}
        >
          {(currentTab === "basic" || currentTab === null) && (
            <BasicOptions saves={currentLocalStorage} setSettings={setSettings} />
          )}
          {currentTab === "widget" && <WidgetOptions saves={currentLocalStorage} setSettings={setSettings} />}
          {currentTab === "layout" && <LayoutOptions saves={currentLocalStorage} setSettings={setSettings} />}
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
      </Stack>
    </ThemeProvider>
  );
};

export default OptionsIndex;
