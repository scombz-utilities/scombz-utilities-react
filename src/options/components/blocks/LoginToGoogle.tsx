import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { CustomContainerParent } from "./CustomContainerParent";
import type { Saves } from "~settings";

type Props = {
  saves: Saves;
  onChange: (value: object) => void;
};

export const LoginToGoogle = (props: Props) => {
  const { saves, onChange } = props;

  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [isOpenLogout, setIsOpenLogout] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isChrome = useMemo(() => {
    // 環境変数で判定
    if (process.env.PLASMO_BROWSER !== "chrome") return false;
    // UAで判定
    const ua = window.navigator.userAgent.toLowerCase();
    const chrome = ua.indexOf("chrome") !== -1 && ua.indexOf("edge") === -1;
    // @ts-ignore braveはwindow.navigatorに存在する
    const brave = window.navigator.brave?.isBrave();
    const arc = getComputedStyle(document.documentElement)?.getPropertyValue("--arc-palette-title");
    return chrome && !brave && !arc;
  }, []);

  const handleCloseLogin = useCallback(() => {
    setIsOpenLogin(false);
  }, [setIsOpenLogin]);

  const handleCloseLogout = useCallback(() => {
    setIsOpenLogout(false);
  }, [setIsOpenLogout]);

  const handleOpenLogin = useCallback(() => {
    setIsOpenLogin(true);
  }, [setIsOpenLogin]);

  const handleOpenLogout = useCallback(() => {
    setIsOpenLogout(true);
  }, [setIsOpenLogout]);

  return (
    <CustomContainerParent
      label="Google Classroom連携"
      caption="学番アカウントでログインすることで、Google Classroomの課題をScombZ上に表示します。"
      // optionId=""
    >
      <Dialog open={isOpenLogin} onClose={handleCloseLogin}>
        <DialogTitle>学番アカウントでログインしてください。</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Google Classroomの課題を取得するためには、
            <span style={{ fontWeight: "bold" }}>学番アドレスでログイン</span>する必要があります。
          </DialogContentText>
          <DialogContentText>※Google Chrome以外のブラウザでは正常に動作しない場合があります。</DialogContentText>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={() => {
              setIsLoading(true);
              chrome.runtime.sendMessage({ action: "getClasses" }, (response) => {
                setIsLoading(false);
                if (response?.profile?.email) {
                  onChange({
                    isSignedIn: true,
                    email: response.profile.email,
                  });
                }
                if (response?.error) {
                  alert("ログインに失敗しました。");
                }
                handleCloseLogin();
              });
            }}
          >
            ログイン
          </LoadingButton>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpenLogout} onClose={handleCloseLogout}>
        <DialogTitle>ブラウザからログアウトされます</DialogTitle>
        <DialogContent>
          <DialogContentText>ブラウザからログアウトされます。</DialogContentText>
          <DialogContentText>ブラウザのGoogleアカウントには、再度ログインすることができます。</DialogContentText>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              chrome.runtime.sendMessage({ action: "logoutGoogle" });
              onChange({
                isSignedIn: false,
                email: "",
              });
              handleCloseLogout();
            }}
          >
            ログアウト
          </Button>
        </DialogContent>
      </Dialog>

      <Box>
        {isChrome ? (
          <>
            <Box>
              {saves.settings.googleClassroom.isSignedIn
                ? `連携済み: ${saves.settings.googleClassroom.email}`
                : "未連携"}
            </Box>
            <Box>
              {saves.settings.googleClassroom.isSignedIn &&
                !saves.settings.googleClassroom.email?.endsWith("@shibaura-it.ac.jp") && (
                  <Box sx={{ color: "red" }}>
                    現在大学のものではないメールアドレスでログインしています。大学アカウントと連携させるためには、再度ログインし直してください。
                  </Box>
                )}
            </Box>
            {saves.settings.googleClassroom.isSignedIn ? (
              <Button variant="contained" onClick={handleOpenLogout} color="error">
                ログアウト
              </Button>
            ) : (
              <Button variant="contained" onClick={handleOpenLogin}>
                連携する
              </Button>
            )}
            {/* <Button onClick={() => chrome.runtime.sendMessage({ action: "getClasses" })}>テスト</Button> */}
          </>
        ) : (
          <Box>このブラウザではGoogle Classroom連携は利用できません。Google Chromeを利用してください。</Box>
        )}
      </Box>
    </CustomContainerParent>
  );
};
