import { Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React from "react";
import type { ReactNode } from "react";
import { CustomContainerParent } from "./CustomContainerParent";

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  caption: string;
  id?: string;
  options: SelectOption[];
  value: string | null;
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
};

export const CustomSelect = (props: Props) => {
  const { label, caption, id = "", options, value, onChange } = props;
  return (
    <CustomContainerParent label={label} caption={caption} id={id}>
      <Select variant="outlined" size="small" sx={{ width: 450 }} value={value || "unselected"} onChange={onChange}>
        {(value === null || value === undefined) && (
          <MenuItem key="none" value="unselected" disabled>
            <em>{chrome.i18n.getMessage("notSelected")}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </CustomContainerParent>
  );
};
