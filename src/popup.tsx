import { Box, Button, Typography } from "@mui/material";

const openOptions = () => {
  chrome.runtime.openOptionsPage();
};

const IndexPopup = () => {
  return (
    <Box minWidth={120} textAlign="center" m={2}>
      <Typography variant="h5">My Utilities</Typography>
      <Box my={1}>
        <Button variant="contained" onClick={openOptions}>
          {" "}
          Options
        </Button>
      </Box>
    </Box>
  );
};

export default IndexPopup;
