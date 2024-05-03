import { Box, Button, Typography, ThemeProvider } from "@mui/material";
import theme from "~/theme";

const openOptions = () => {
  chrome.runtime.openOptionsPage();
};

const IndexPopup = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box minWidth={150} textAlign="center" m={2}>
        <Typography variant="h6">ScombZ Utilities</Typography>
        <Box my={1}>
          <Button variant="contained" onClick={openOptions}>
            Options
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default IndexPopup;
