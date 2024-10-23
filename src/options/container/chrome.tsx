import {
  InfoOutlined,
  ManageHistoryOutlined,
  PaletteOutlined,
  SettingsOutlined,
  SettingsSuggestOutlined,
  ViewQuiltOutlined,
  WidgetsOutlined,
} from "@mui/icons-material";
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
  CircularProgress,
} from "@mui/material";
import { indigo, grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { TbLayersSubtract } from "react-icons/tb";

import { AdvancedOptions } from "~/options/components/pages/AdvancedOptions";
import { BasicOptions } from "~/options/components/pages/BasicOptions";
import { CustomCSS } from "~/options/components/pages/CustomCSS";
import { DataOperation } from "~/options/components/pages/DataOperation";
import { Information } from "~/options/components/pages/Information";
import { LayoutOptions } from "~/options/components/pages/LayoutOptions";
import { WidgetOptions } from "~/options/components/pages/WidgetOptions";
import theme, { darkTheme } from "~/theme";
import { PopupOptions } from "~options/components/pages/PopupOptions";
import { defaultSaves } from "~settings";
import type { Saves } from "~settings";

import "./chrome.css";

const OptionsIndexChrome = () => {
  const [currentTab, setCurrentTab] = useState(new URLSearchParams(window.location.search).get("tab") || "basic");
  const [currentLocalStorage, setCurrentLocalStorage] = useState<Saves>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
    setIsDarkMode(newLocalStorage.settings.darkMode);
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
      setIsDarkMode(currentData.settings.darkMode);
    });
  }, []);

  const menus: { value: string; label: string; icon?: JSX.Element }[] = [
    { value: "basic", label: chrome.i18n.getMessage("basicOptions"), icon: <SettingsSuggestOutlined /> },
    { value: "widget", label: chrome.i18n.getMessage("widgetOptions"), icon: <WidgetsOutlined /> },
    { value: "layout", label: chrome.i18n.getMessage("layoutOptions"), icon: <ViewQuiltOutlined /> },
    { value: "popup", label: chrome.i18n.getMessage("popupOptions"), icon: <TbLayersSubtract size={24} /> },
    { value: "advanced", label: chrome.i18n.getMessage("advancedOptions"), icon: <SettingsOutlined /> },
    { value: "customcss", label: chrome.i18n.getMessage("customCSS"), icon: <PaletteOutlined /> },
    { value: "data", label: chrome.i18n.getMessage("manageOptions"), icon: <ManageHistoryOutlined /> },
    { value: "info", label: chrome.i18n.getMessage("info"), icon: <InfoOutlined /> },
  ];

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
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
      <Stack
        direction="row"
        spacing={1}
        sx={{
          backgroundColor: isDarkMode ? "#1F1F27" : "#fff",
          color: isDarkMode ? "#CCC" : undefined,
        }}
      >
        <Box
          gap="1rem"
          py="1rem"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "inherit",
            borderRightColor: grey[300],
            borderRightWidth: "1px",
            borderRightStyle: "solid",
          }}
        >
          <Box textAlign="center" mb={2}>
            <img
              src={chrome.runtime.getURL("assets/scombz_utilities.svg")}
              alt="ScombZ Utilities"
              style={{
                width: "50%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "block",
                filter: "invert(1) grayscale(60%) hue-rotate(180deg)",
              }}
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
                  backgroundColor: currentTab === menu.value ? indigo[500] : "transparent",
                  color: currentTab === menu.value ? "white" : "inherit",
                  transition: "all 0.3s",
                  ":hover": {
                    backgroundColor: currentTab === menu.value ? indigo[700] : isDarkMode ? "#36363B" : grey[100],
                    color: currentTab === menu.value ? "white" : "inherit",
                  },
                }}
              >
                <ListItemButton>
                  {menu.icon && (
                    <ListItemIcon
                      sx={{
                        color: currentTab === menu.value ? "white" : "inherit",
                        transition: "all 0.3s",
                      }}
                    >
                      {menu.icon}
                    </ListItemIcon>
                  )}
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
            overflowY: "auto",
            width: "calc(100% - 250px - 2rem)",
            padding: "1rem",
            backgroundColor: "inherit",
          }}
        >
          {currentLocalStorage === null ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "inherit",
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              {(currentTab === "basic" || currentTab === null) && (
                <BasicOptions saves={currentLocalStorage} setSettings={setSettings} />
              )}
              {currentTab === "widget" && <WidgetOptions saves={currentLocalStorage} setSettings={setSettings} />}
              {currentTab === "layout" && <LayoutOptions saves={currentLocalStorage} setSettings={setSettings} />}
              {currentTab === "popup" && <PopupOptions saves={currentLocalStorage} setSettings={setSettings} />}
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
            </>
          )}
        </Box>
      </Stack>
    </ThemeProvider>
  );
};

export default OptionsIndexChrome;
