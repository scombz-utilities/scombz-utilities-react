import { Save } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import { useId, useState } from "react";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  i18nLabel: string;
  i18nCaption: string;
  optionId?: string;
  type?: string;
  value: string;
  onSaveButtonClick: (value: string) => void;
};

export const CustomTextField = (props: Props) => {
  const { i18nLabel, i18nCaption, optionId = "", value, type, onSaveButtonClick } = props;

  const [currentValue, setCurrentValue] = useState(value);
  const id = useId();

  return (
    <CustomContainerParent
      label={chrome.i18n.getMessage(i18nLabel) || i18nLabel}
      caption={chrome.i18n.getMessage(i18nCaption) || i18nCaption}
      optionId={optionId}
      htmlFor={id}
    >
      <Stack direction="row" gap={1}>
        <TextField
          variant="outlined"
          size="small"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          sx={{ width: 450 }}
          type={type}
          id={id}
        />
        <Button
          startIcon={<Save />}
          variant="contained"
          onClick={() => onSaveButtonClick(currentValue)}
          disabled={value === currentValue}
        >
          {chrome.i18n.getMessage("dialogSave")}
        </Button>
      </Stack>
    </CustomContainerParent>
  );
};
