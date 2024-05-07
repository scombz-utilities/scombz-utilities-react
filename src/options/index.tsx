import { Box, Button, Snackbar, Alert, ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ComplexOptions } from "./components/ComplexOptions";
import { SimpleOptions } from "./components/SimpleOptions";
import theme from "~/theme";
import { defaultSaves } from "~settings";
import type { Saves } from "~settings";
import "./index.css";

const OptionsIndex = () => {
  const [isSimple, setIsSimple] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [saves, setSaves] = useState<Saves>(defaultSaves);

  const setSettings = (key: string, value: unknown) => {
    setSaves({
      ...saves,
      settings: {
        ...saves.settings,
        [key]: value,
      },
    });
  };

  const setScombzData = (key: string, value: unknown) => {
    setSaves({
      ...saves,
      scombzData: {
        ...saves.scombzData,
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

          {isSimple ? (
            <SimpleOptions setSettings={setSettings} saves={saves} setSaves={setSaves} />
          ) : (
            <ComplexOptions setSettings={setSettings} saves={saves} setScombzData={setScombzData} setSaves={setSaves} />
          )}

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
            <Box position="relative" width="100%" display="flex" alignItems="center" justifyContent="center">
              <Box position="absolute" left={30} top={0} ml={1}>
                <Button
                  sx={{
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#f4f4f4",
                    },
                  }}
                  variant="outlined"
                  onClick={() => {
                    setIsSimple(!isSimple);
                  }}
                >
                  {isSimple ? "詳細設定へ" : "かんたん設定へ"}
                </Button>
              </Box>
              <Button variant="contained" sx={{ width: 250 }} onClick={save}>
                保存
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OptionsIndex;
