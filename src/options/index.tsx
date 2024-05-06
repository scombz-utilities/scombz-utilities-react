import { Box, Button, Typography, Snackbar, Alert, ThemeProvider, Tabs, Tab, Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AdvancedOptions } from "./components/AdvancedOptions";
import { BasicOptions } from "./components/BasicOptions";
import { CustomCSS } from "./components/CustomCSS";
import { DataOperation } from "./components/DataOperation";
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
            <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="基本設定" />
              <Tab label="ウィジェット設定" />
              <Tab label="詳細設定" />
              <Tab label="カスタムCSS" />
              <Tab label="インポート・エクスポート・初期化" />
              <Tab label="情報" />
            </Tabs>
          </Box>

          <Box px={2} py={3}>
            {tabIndex === 0 && <BasicOptions saves={saves} setSettings={setSettings} />}
            {tabIndex === 1 && <WidgetOptions saves={saves} setSettings={setSettings} />}
            {tabIndex === 2 && <AdvancedOptions saves={saves} setSettings={setSettings} />}
            {tabIndex === 3 && (
              <CustomCSS value={saves.settings.customCSS} onChange={(value) => setSettings("customCSS", value)} />
            )}
            {tabIndex === 4 && <DataOperation saves={saves} setSaves={setSaves} />}
            {tabIndex === 5 && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h5">情報</Typography>
                <Typography variant="body1">
                  この拡張機能は、ScombZのユーザビリティの向上を目的としたオープンソースプロジェクトです。
                </Typography>
                <Box>
                  <Typography variant="h6" mb={0.5}>
                    バージョン情報
                  </Typography>
                  <Typography variant="body1">ScombZ Utilities v{chrome.runtime.getManifest().version}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" mb={0.5}>
                    バグ報告・要望
                  </Typography>
                  <Typography variant="body1">以下のいずれかの方法でお知らせください。</Typography>

                  <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeahBs8kcBB2dVmVA54KIIOxa4DKUE8v4a1E30ncawd9W4vjg/viewform">
                    <Typography variant="body1">Google Form</Typography>
                  </Link>
                  <Link href="https://github.com/yudai1204/scombz-utilities-react/issues">
                    <Typography variant="body1">GitHub Issues</Typography>
                  </Link>
                  <Link href="https://twitter.com/ScombZ_utl">
                    <Typography variant="body1">Twitter</Typography>
                  </Link>
                </Box>
                <Box>
                  <Typography variant="h6" mb={0.5}>
                    リンク
                  </Typography>
                  <Link href="https://scombz-utilities.com">
                    <Typography variant="body1">公式サイト</Typography>
                  </Link>
                  <Link href="https://chromewebstore.google.com/detail/scombz-utilities/iejnanaabfgocfjbnmhkfheghbkanibj?hl=ja">
                    <Typography variant="body1">Chrome Web Store</Typography>
                  </Link>
                  <Link href="https://github.com/yudai1204/scombz-utilities">
                    <Typography variant="body1">GitHub (~v3.23.3)</Typography>
                  </Link>
                  <Link href="https://github.com/yudai1204/scombz-utilities-react">
                    <Typography variant="body1">GitHub (v4.0.0~)</Typography>
                  </Link>
                </Box>
                <Box>
                  <Typography variant="h6" mb={0.5}>
                    ライセンス
                  </Typography>
                  <Typography variant="body1">MIT License</Typography>
                </Box>
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
