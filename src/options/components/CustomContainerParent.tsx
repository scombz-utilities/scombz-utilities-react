import { InputLabel, Stack, FormHelperText } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  caption: string;
  htmlFor: string;
  optionId?: string;
  children: React.ReactNode;
};

export const CustomContainerParent = (props: Props) => {
  const { label, caption, htmlFor, children } = props;

  return (
    <Stack gap={1} py={2} borderBottom="1px solid #ccc">
      <InputLabel htmlFor={htmlFor}>{label}</InputLabel>
      <FormHelperText>{caption}</FormHelperText>
      {children}
    </Stack>
  );
};
