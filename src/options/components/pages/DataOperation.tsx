import { Box, Button, Typography, styled, IconButton, Collapse } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { MdDownload, MdUpload, MdDelete, MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { migrateLogic } from "~backgrounds/migration";
import type { Saves } from "~settings";
import { defaultSaves } from "~settings";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const saveStorage = (newSaves: Saves): Promise<Saves> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      const mergedData = {
        settings: {
          ...currentData.settings,
          ...newSaves.settings,
        },
        scombzData: {
          ...currentData.scombzData,
          ...newSaves.scombzData,
        },
      };
      chrome.storage.local.set(mergedData, () => {
        resolve(mergedData);
      });
    });
  });
};

type Props = {
  saves: Saves;
  setSaves: (saves: Saves) => void;
};

export const DataOperation = (props: Props) => {
  const { saves, setSaves } = props;

  const [isLegacyOpen, setIsLegacyOpen] = useState<boolean>(false);

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result as string) as Saves;
        if (
          data === null ||
          typeof data !== "object" ||
          data?.scombzData === undefined ||
          data?.settings === undefined
        ) {
          throw new Error("Invalid data");
        }
        saveStorage(data).then((_newSaves) => {
          alert("データの読み込みが完了しました。");
          window.location.reload();
        });
      } catch (error) {
        alert("ファイルの読み込みに失敗しました。");
      }
    };
    reader.readAsText(file);
  };

  const exportData = (_e) => {
    const data: Saves = {
      ...saves,
      settings: {
        ...saves.settings,
        loginData: {
          username: "",
          password: "",
        },
      },
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date();
    a.download = `scobz-utilities-data-${format(date, "yyyy-MM-dd-HH-mm")}.json`;
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const resetData = (_e) => {
    if (confirm("本当に初期化しますか？\nこの操作は取り消せません。")) {
      chrome.storage.local.clear(() => {
        window.location.reload();
      });
    }
  };

  const importLegacyData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result as string);
        console.log(data);
        if (data === null || typeof data !== "object") {
          throw new Error("Invalid data");
        }
        const newSaves = migrateLogic(data);
        saveStorage(newSaves).then((newSaves) => {
          setSaves(newSaves);
          alert("データの読み込みが完了しました。");
        });
      } catch (error) {
        alert("ファイルの読み込みに失敗しました。");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Box>
        <Typography variant="h5">{chrome.i18n.getMessage("manageOptions")}</Typography>
        <Box m={1}>
          <Box my={1}>
            <Typography variant="body1">
              JSON形式で、設定やメモを一括で書き出したり、外部から読み込むことができます。
            </Typography>
            <Typography variant="body1">
              パスワード及び学籍番号は出力されませんが、それ以外のものは全て出力されるため注意してください。
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Button variant="contained" color="primary" sx={{ width: 200 }} component="label" startIcon={<MdUpload />}>
              <Box width="100px" textAlign="center">
                {chrome.i18n.getMessage("import")}
              </Box>
              <VisuallyHiddenInput type="file" accept=".json" onChange={importData} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={exportData}
              sx={{ width: 200 }}
              startIcon={<MdDownload />}
            >
              <Box width="100px" textAlign="center">
                {chrome.i18n.getMessage("export")}
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" onClick={() => setIsLegacyOpen(!isLegacyOpen)} sx={{ cursor: "pointer" }}>
          <IconButton>{isLegacyOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}</IconButton>
          ScombZ Utilities v4.0.0未満からのデータ移行
        </Typography>
        <Collapse in={isLegacyOpen}>
          <Box mx={5}>
            <Typography variant="h6">レガシー形式でインポート</Typography>
            <Box my={1}>
              <Typography variant="body1">以前のバージョンでエクスポートしたデータを読み込みます。</Typography>
              <Typography variant="body1">この機能は将来的に削除される予定です。</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: 200 }}
              component="label"
              startIcon={<MdUpload />}
            >
              <Box width="100px" textAlign="center">
                インポート
              </Box>
              <VisuallyHiddenInput type="file" accept=".json" onChange={importLegacyData} />
            </Button>
          </Box>
        </Collapse>
      </Box>
      <Box mt={5}>
        <Typography variant="h5">初期化</Typography>
        <Box m={1}>
          <Box my={1}>
            <Typography variant="body1">全ての設定とデータを初期化します。この操作は取り消せません。</Typography>
            <Typography variant="body1">初期化をする際は、設定をエクスポートしてから行うことを推奨します。</Typography>
          </Box>
          <Button variant="contained" color="error" onClick={resetData} sx={{ width: 200 }} startIcon={<MdDelete />}>
            <Box width="100px" textAlign="center">
              {chrome.i18n.getMessage("reset")}
            </Box>
          </Button>
        </Box>
      </Box>
    </>
  );
};
