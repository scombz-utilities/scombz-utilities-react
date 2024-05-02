import { Button } from "@mui/material";
import type { RuntimeMessage } from "~background";

export const OpenOptionButton = () => {
  const openSettings = () => chrome.runtime.sendMessage({ action: "openOption" } as RuntimeMessage);
  return (
    <Button
      variant="contained"
      size="large"
      onClick={openSettings}
      sx={{ display: "block", position: "fixed", bottom: 20, right: 20 }}
    >
      ScombZ Utilities設定を開く
    </Button>
  );
};
