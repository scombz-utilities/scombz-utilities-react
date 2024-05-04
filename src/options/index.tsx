import { Box, Button, Typography, Snackbar, Alert, ThemeProvider, Tabs, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AdvancedOptions } from "./components/AdvancedOptions";
import { BasicOptions } from "./components/BasicOptions";
import { CustomCSS } from "./components/CustomCSS";
import { WidgetOptions } from "./components/WidgetOptions";
import theme from "~/theme";
import { defaultSaves } from "~settings";
import type { Saves } from "~settings";
import "./index.css";

const OptionsIndex = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [saves, setSaves] = useState<Saves>(defaultSaves);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setSettings = (key: string, value: any) => {
    setSaves({
      ...saves,
      settings: {
        ...saves.settings,
        [key]: value,
      },
    });
  };

  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      setSaves(currentData);
    });
  }, []);

  const save = () => {
    chrome.storage.local.set(saves, () => {
      console.log("Saved");
      setSnackbarOpen(true);
    });
  };

  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box p={0}>
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
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="基本設定" />
              <Tab label="ウィジェット設定" />
              <Tab label="詳細設定" />
              <Tab label="カスタムCSS" />
              <Tab label="初期化" />
              <Tab label="バージョン情報" />
            </Tabs>
          </Box>

          <Box px={2} py={3}>
            {tabIndex === 0 && <BasicOptions saves={saves} setSettings={setSettings} />}
            {tabIndex === 1 && <WidgetOptions saves={saves} setSettings={setSettings} />}
            {tabIndex === 2 && <AdvancedOptions saves={saves} setSettings={setSettings} />}
            {tabIndex === 3 && (
              <CustomCSS value={saves.settings.customCSS} onChange={(value) => setSettings("customCSS", value)} />
            )}
            {tabIndex === 4 && (
              <Box>
                <Typography variant="h5">初期化</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (confirm("本当に初期化しますか？\nこの操作は取り消せません。")) {
                      chrome.storage.local.clear(() => {
                        window.location.reload();
                      });
                    }
                  }}
                >
                  初期化
                </Button>
              </Box>
            )}
            {tabIndex === 5 && (
              <Box>
                <Typography variant="h5">バージョン情報</Typography>
                <Typography variant="body1">ScombZ Utilities v{chrome.runtime.getManifest().version}</Typography>
              </Box>
            )}
          </Box>

          <Box
            m={1}
            position="fixed"
            sx={{
              bottom: 0,
              right: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fffa",
              backdropFilter: "blur(3px)",
              boxShadow: "0 0 6px #0003",
              margin: 0,
              padding: 1,
            }}
          >
            <Button variant="contained" sx={{ width: 250 }} onClick={save}>
              保存
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OptionsIndex;
