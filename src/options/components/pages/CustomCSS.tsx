import { Save } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { Editor } from "../blocks/Editor";

type Props = {
  value: string;
  onSaveButtonClick: (value: string) => void;
};

export const CustomCSS = (props: Props) => {
  const { value, onSaveButtonClick } = props;

  const [currentValue, setCurrentValue] = useState(value);

  return (
    <>
      <h2>{chrome.i18n.getMessage("customCSS")}</h2>
      <Editor value={currentValue} onChange={setCurrentValue} />
      <Box sx={{ textAlign: "right", mt: 1 }}>
        <Button
          startIcon={<Save />}
          variant="contained"
          onClick={() => onSaveButtonClick(currentValue)}
          disabled={value === currentValue}
        >
          {chrome.i18n.getMessage("dialogSave")}
        </Button>
      </Box>
    </>
  );
};
