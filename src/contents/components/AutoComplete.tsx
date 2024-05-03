import { Box, Typography, TextField, Paper, List, ListItem } from "@mui/material";
import React, { useState, useMemo } from "react";

// MUIのAutoCompleteがバグるので、自前で作成

type Props = {
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  label?: string;
};
export const AutoComplete = (props: Props) => {
  const { options, onChange, placeholder = "", label = "", required = false } = props;
  const [value, setValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const onInput = async (value: string) => {
    setValue(value);
    onChange(value);
  };

  const suggestOptions = useMemo(() => {
    if (value === "") return options;
    return options.filter((option) => option.includes(value));
  }, [value, options]);

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        required={required}
        label={label}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        fullWidth
        onChange={(e) => onInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 300)}
        value={value}
      />
      {isFocused && suggestOptions.length > 0 && (
        <Box sx={{ position: "absolute", top: "100%", left: 0, width: "100%", zIndex: 1000 }}>
          <Paper variant="outlined">
            <List sx={{ maxHeight: 240, overflow: "auto" }}>
              {suggestOptions.map((option) => (
                <ListItem
                  sx={{ cursor: "pointer", userSelect: "none", "&:hover": { backgroundColor: "#eee" } }}
                  onClick={(e) => {
                    e.preventDefault();
                    onInput(option);
                    setIsFocused(false);
                  }}
                >
                  <Typography>{option}</Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
};
