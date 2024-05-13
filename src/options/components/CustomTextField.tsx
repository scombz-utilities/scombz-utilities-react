import { Box, TextField, IconButton } from "@mui/material";
import { useId, useState } from "react";
import type { ChangeEvent } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  label: string;
  caption: string;
  optionId?: string;
  type?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const CustomTextField = (props: Props) => {
  const { label, caption, optionId = "", value, onChange } = props;
  const [showPassword, setShowPassword] = useState(false);

  const width = 450;

  const id = useId();
  console.log([label, id]);

  const toggleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <CustomContainerParent label={label} caption={caption} optionId={optionId} htmlFor={id}>
      <Box position="relative" sx={{ width }}>
        <TextField
          variant="outlined"
          size="small"
          value={value}
          onChange={onChange}
          sx={{ width }}
          type={showPassword ? "text" : "password"}
          id={id}
        />
        <IconButton onClick={toggleShowPassword} sx={{ position: "absolute", right: 0, top: 0 }}>
          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
        </IconButton>
      </Box>
    </CustomContainerParent>
  );
};
