import { Switch } from "@mui/material";
import React from "react";
import type { ChangeEvent } from "react";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  label: string;
  caption: string;
  id?: string;
  value: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};
export const CustomSwitch = (props: Props) => {
  const { label, caption, id = "", value, onChange } = props;
  return (
    <CustomContainerParent label={label} caption={caption} id={id}>
      <Switch checked={value} onChange={onChange} />
    </CustomContainerParent>
  );
};
