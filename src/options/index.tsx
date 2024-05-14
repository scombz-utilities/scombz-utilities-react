import { Alert, Box, Button, Snackbar, ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ComplexOptions } from "./components/ComplexOptions";
import { SimpleOptions } from "./components/SimpleOptions";
import theme from "~/theme";
import { defaultSaves } from "~settings";
import type { Saves } from "~settings";
import "./index.css";

const OptionsIndex = () => {
  const [isSimple, setIsSimple] = useState<boolean>(true);
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

          {isSimple ? (
            <SimpleOptions setSettings={setSettings} saves={currentLocalStorage} setSaves={setCurrentLocalStorage} />
          ) : (
            <ComplexOptions
              setSettings={setSettings}
              saves={currentLocalStorage}
              setScombzData={setScombzData}
              setSaves={setCurrentLocalStorage}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OptionsIndex;
