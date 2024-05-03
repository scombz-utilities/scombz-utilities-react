import { Box, TextField, IconButton } from "@mui/material";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  label: string;
  caption: string;
  id?: string;
  type?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const CustomTextField = (props: Props) => {
  const { label, caption, id = "", value, onChange, type = "text" } = props;
  const [showPassword, setShowPassword] = useState(false);

  const width = 450;

  const toggleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <CustomContainerParent label={label} caption={caption} id={id}>
      <Box position="relative" sx={{ width }}>
        {type === "password" ? (
          <>
            <TextField
              variant="outlined"
              size="small"
              value={value}
              onChange={onChange}
              sx={{ width }}
              type={showPassword ? "text" : "password"}
            />
            <IconButton onClick={toggleShowPassword} sx={{ position: "absolute", right: 0, top: 0 }}>
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </IconButton>
          </>
        ) : (
          <TextField variant="outlined" size="small" value={value} onChange={onChange} sx={{ width }} type={type} />
        )}
      </Box>
    </CustomContainerParent>
  );
};
