import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormControl,
  Stack,
  Box,
  Typography,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import React from "react";
import { MdVisibility, MdVisibilityOff, MdCloseFullscreen, MdOpenInFull } from "react-icons/md";
import { defaultSaves } from "../util/settings";
import type { Settings } from "../util/settings";
import type { RuntimeMessage } from "~background";

export const openSettings = () => {
  chrome.runtime.sendMessage({ action: "openOption" } as RuntimeMessage);
};

export const SaveDialog = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const idRef = React.useRef<HTMLElement>();
  const passRef = React.useRef<HTMLElement>();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const saveUser = async () => {
    setIsLoading(true);
    const userId = idRef.current?.querySelector("input")?.value;
    const userPass = passRef.current?.querySelector("input")?.value;
    if (userId && userPass && userId.match(/^[A-z]{2}[0-9]{5}(@sic)?$/)) {
      const currentData = await chrome.storage.local.get(defaultSaves);
      const settings = currentData.settings as Settings;
      settings.loginData.username = userId.match(/^[A-z]{2}[0-9]{5}$/) ? userId + "@sic" : userId;
      settings.loginData.password = userPass;
      await chrome.storage.local.set(currentData);
      document.getElementById("userNameInput")?.setAttribute("value", settings.loginData.username);
      document.getElementById("passwordInput")?.setAttribute("value", userPass);
      setInterval(() => {
        document.getElementById("submitButton")?.click();
      }, 500);
    } else {
      setOpenSnackbar(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert severity="error">
          <Typography variant={"subtitle1"}>{chrome.i18n.getMessage("dialogIncorrectPassword")}</Typography>
        </Alert>
      </Snackbar>
      <Stack
        width={420}
        bgcolor={"white"}
        padding={2}
        position={"fixed"}
        bottom={50}
        right={20}
        border={"1px solid #ccc"}
        borderRadius={2}
      >
        {open ? (
          <form>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                justifyContent: "start",
                px: 1,
                position: "relative",
              }}
            >
              <img src={chrome.runtime.getURL("assets/logo.webp")} width={48} height={48} />
              <Box>
                <Typography variant="subtitle2">
                  {chrome.i18n.getMessage("dialogDescription")}
                  <br />
                  {chrome.i18n.getMessage("dialogDescription2")}
                </Typography>
                <Typography color={"gray"} variant="caption">
                  {chrome.i18n.getMessage("dialogDescription3")}
                </Typography>
              </Box>
            </Box>
            <Stack gap={0.5} mb={2}>
              <FormControl sx={{ mt: 1 }} variant="outlined">
                <InputLabel htmlFor="scombz-utilities-username">Username</InputLabel>
                <Input size="small" id="scombz-utilities-username" ref={idRef} type="email" autoComplete="email" />
              </FormControl>
              <FormControl sx={{ mt: 1 }} variant="outlined">
                <InputLabel htmlFor="scombz-utilities-password">Password</InputLabel>
                <Input
                  id="scombz-utilities-password"
                  ref={passRef}
                  type={showPassword ? "text" : "password"}
                  autoComplete="password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Stack>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={closeDialog} id="scombz-utilities-close">
                  <MdCloseFullscreen />
                </IconButton>
                <label htmlFor="scombz-utilities-close">
                  <Typography variant={"subtitle1"} color={"gray"}>
                    {chrome.i18n.getMessage("dialogClose")}
                  </Typography>
                </label>
              </Box>
              <Box
                sx={{
                  mr: 0,
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "start",
                }}
              >
                <Button variant={"outlined"} onClick={openSettings}>
                  {chrome.i18n.getMessage("dialogOpenOptions")}
                </Button>
                <LoadingButton
                  variant={"contained"}
                  color={"primary"}
                  loading={isLoading}
                  onClick={saveUser}
                  type="submit"
                >
                  {chrome.i18n.getMessage("dialogSave")}
                </LoadingButton>
              </Box>
            </Box>
          </form>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => setOpen(true)} id="scombz-utilities-open">
              <MdOpenInFull />
            </IconButton>
            <label htmlFor="scombz-utilities-open">
              <Typography variant={"subtitle1"}>{chrome.i18n.getMessage("dialogClickToOpen")}</Typography>
            </label>
          </Box>
        )}
      </Stack>
    </>
  );
};
