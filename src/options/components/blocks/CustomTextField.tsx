import { Save } from "@mui/icons-material";
import { Button, Stack, TextField, Typography, InputAdornment, IconButton } from "@mui/material";
import { useId, useState, useRef, useEffect } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  i18nLabel: string;
  i18nCaption: string;
  optionId?: string;
  type?: string;
  value: string;
  placeholder?: string;
  unit?: string;
  pattern?: string;
  validateMessage?: string;
  canIgnoreError?: boolean;
  onSaveButtonClick: (value: string) => void;
};

export const CustomTextField = (props: Props) => {
  const {
    i18nLabel,
    i18nCaption,
    optionId = "",
    value,
    type,
    placeholder = "",
    unit,
    pattern,
    validateMessage = "Invalid input",
    canIgnoreError = false,
    onSaveButtonClick,
  } = props;

  const [currentValue, setCurrentValue] = useState<string>(value);
  const [unitPosition, setUnitPosition] = useState<number>(0);
  const [isError, setIsError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const id = useId();

  const inputRef = useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const ref = inputRef.current as HTMLInputElement;
    setIsError(!ref.validity.valid);
    if (!unit) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = getComputedStyle(ref).font;
    const width = context.measureText(currentValue || placeholder).width;
    setUnitPosition(width);
  }, [inputRef, currentValue, unit, placeholder]);

  return (
    <CustomContainerParent
      label={chrome.i18n.getMessage(i18nLabel) || i18nLabel}
      caption={chrome.i18n.getMessage(i18nCaption) || i18nCaption}
      optionId={optionId}
      htmlFor={id}
    >
      <Stack direction="column" gap={0.8}>
        <Stack direction="row" gap={1}>
          <Stack direction="row" gap={1} position="relative">
            <TextField
              variant="outlined"
              size="small"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              sx={{
                width: 450,
                zIndex: 1,
                "& *::-ms-reveal": {
                  display: "none",
                },
              }}
              type={type === "password" ? (showPassword ? "text" : "password") : type}
              id={id}
              placeholder={placeholder}
              inputRef={inputRef}
              error={isError}
              inputProps={{
                pattern,
              }}
              InputProps={{
                endAdornment:
                  type === "password" ? (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              }}
            />
            {unit && (
              <Typography
                variant="body2"
                sx={{
                  position: "absolute",
                  opacity: 0.6,
                  left: unitPosition + 24,
                  top: 10,
                  bottom: 0,
                }}
              >
                {unit}
              </Typography>
            )}
          </Stack>
          {canIgnoreError && isError ? (
            <Button
              startIcon={<Save />}
              color="error"
              variant="contained"
              onClick={() => onSaveButtonClick(currentValue)}
              disabled={value === currentValue}
            >
              {chrome.i18n.getMessage("dialogForceSave")}
            </Button>
          ) : (
            <Button
              startIcon={<Save />}
              variant="contained"
              onClick={() => onSaveButtonClick(currentValue)}
              disabled={value === currentValue || isError}
            >
              {chrome.i18n.getMessage("dialogSave")}
            </Button>
          )}
        </Stack>
        {isError && (
          <Typography variant="caption" color="error" sx={{ ml: 1.5 }}>
            {validateMessage}
          </Typography>
        )}
      </Stack>
    </CustomContainerParent>
  );
};
