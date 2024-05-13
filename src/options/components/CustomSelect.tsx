import { Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React, { useId } from "react";
import type { ReactNode } from "react";
import { CustomContainerParent } from "./CustomContainerParent";

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  caption: string;
  optionId?: string;
  options: SelectOption[];
  value: string | null;
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
};

export const CustomSelect = (props: Props) => {
  const { label, caption, optionId = "", options, value, onChange } = props;
  const id = useId();

  return (
    <CustomContainerParent label={label} caption={caption} optionId={optionId} htmlFor={id}>
      <Select
        variant="outlined"
        size="small"
        sx={{ width: 450 }}
        value={value || "unselected"}
        onChange={onChange}
        id={id}
      >
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
