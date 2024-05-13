import { Switch } from "@mui/material";
import React, { useId } from "react";
import type { ChangeEvent } from "react";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  label: string;
  caption: string;
  optionId?: string;
  value: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export const CustomSwitch = (props: Props) => {
  const { label, caption, optionId = "", value, onChange } = props;
  const id = useId();

  return (
    <CustomContainerParent label={label} caption={caption} optionId={optionId} htmlFor={id}>
      <Switch checked={value} onChange={onChange} id={id} />
    </CustomContainerParent>
  );
};
