import { Box, Typography, InputLabel } from "@mui/material";
import grey from "@mui/material/colors/grey";
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
        <InputLabel sx={{ color: grey[700] }}>{label}</InputLabel>
        <Typography variant="caption" color={grey[500]}>
          {id}
        </Typography>
      </Box>
      <Box ml={0.1}>
        <Typography variant="caption">
          {caption
            .replace(/\s+/g, " ")
            .split(" ")
            .map((text, index) => (
              <Typography key={index} variant="body2" color={grey[700]} display="block">
                {text}
              </Typography>
            ))}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};
