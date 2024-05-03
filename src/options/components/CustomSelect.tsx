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
      <Select variant="outlined" size="small" sx={{ width: 450 }} value={value} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </CustomContainerParent>
  );
};
