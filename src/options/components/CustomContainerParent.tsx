import { Box, Typography, InputLabel } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  caption: string;
  id?: string;
  children: React.ReactNode;
};
export const CustomContainerParent = (props: Props) => {
  const { label, caption, id = "", children } = props;
  return (
    <Box borderTop="1px solid #ccc" marginBottom={2} paddingTop={2.5}>
      <Box display="flex" alignItems="flex-end" gap={1}>
        <InputLabel>{label}</InputLabel>
        <Typography variant="caption" color="grey">
          {id}
        </Typography>
      </Box>
      <Box ml={0.1}>
        <Typography variant="caption" color="grey">
          {caption
            .replace(/\s+/g, " ")
            .split(" ")
            .map((text, index) => (
              <Typography key={index} variant="caption" color="grey" display="block">
                {text}
              </Typography>
            ))}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};
