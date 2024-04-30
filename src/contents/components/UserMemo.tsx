import { Box, Typography, ButtonGroup, IconButton } from "@mui/material";
import { useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

type Props = {
  width: number;
};
export const UserMemo = (props: Props) => {
  const { width } = props;

  const [isUserMemoOpen, setIsUserMemoOpen] = useState<boolean>(true);

  const toggleOpen = () => {
    setIsUserMemoOpen(!isUserMemoOpen);
  };

  if (width < 540) {
    return <></>;
  }

  return (
    <Box
      maxWidth="1200px"
      m={width > 1540 ? "10px auto" : "10px"}
      onClick={(e) => e.stopPropagation()}
      sx={{
        backgroundColor: "#fff9",
        backdropFilter: "blur(6px)",
        padding: 1,
        borderRadius: 1,
      }}
    >
      <Box mb={0.8} position="relative">
        <Typography variant="h6" sx={{ px: 0.5, textAlign: "left", fontSize: "16px" }}>
          メモ
        </Typography>
        <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={toggleOpen} size="small">
            {isUserMemoOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </IconButton>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
