import { InputLabel, Stack, FormHelperText, Typography } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  caption: string;
  htmlFor?: string;
  optionId?: string;
  children: React.ReactNode;
};

export const CustomContainerParent = (props: Props) => {
  const { label, caption, htmlFor, optionId, children } = props;

  return (
    <Stack gap={1} py={2} borderBottom="1px solid #ccc">
      <Stack sx={{ flexDirection: "row", alignItems: "flex-end", gap: 1 }}>
        <InputLabel htmlFor={htmlFor}>{label}</InputLabel>
        <Typography variant="caption" color="grey.500">
          {optionId}
        </Typography>
      </Stack>
      <FormHelperText>{caption}</FormHelperText>
      {children}
    </Stack>
  );
};
