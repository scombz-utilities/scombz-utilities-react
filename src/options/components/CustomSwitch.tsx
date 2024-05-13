import { Switch } from "@mui/material";
import React, { useId } from "react";
import type { ChangeEvent } from "react";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  i18nLabel: string;
  i18nCaption: string;
  optionId?: string;
  value: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export const CustomSwitch = (props: Props) => {
  const { i18nLabel, i18nCaption, optionId = "", value, onChange } = props;
  const id = useId();

  return (
    <CustomContainerParent
      label={chrome.i18n.getMessage(i18nLabel) || i18nLabel}
      caption={chrome.i18n.getMessage(i18nCaption) || i18nCaption}
      optionId={optionId}
      htmlFor={id}
    >
      <Switch checked={value} onChange={onChange} id={id} />
    </CustomContainerParent>
  );
};
