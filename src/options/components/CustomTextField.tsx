import { TextField } from "@mui/material";
import { useId } from "react";
import type { ChangeEvent } from "react";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  i18nLabel: string;
  i18nCaption: string;
  optionId?: string;
  type?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const CustomTextField = (props: Props) => {
  const { i18nLabel, i18nCaption, optionId = "", value, type, onChange } = props;

  const id = useId();

  return (
    <CustomContainerParent
      label={chrome.i18n.getMessage(i18nLabel) || i18nLabel}
      caption={chrome.i18n.getMessage(i18nCaption) || i18nCaption}
      optionId={optionId}
      htmlFor={id}
    >
      <TextField
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        sx={{ width: 450 }}
        type={type}
        id={id}
      />
    </CustomContainerParent>
  );
};
