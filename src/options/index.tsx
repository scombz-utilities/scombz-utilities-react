import { Box, Button, Typography, TextField, ThemeProvider, Select, MenuItem } from "@mui/material";
import { useEffect } from "react";
import theme from "~/theme";

const OptionsIndex = () => {
  useEffect(() => {}, []);

  return (
    <ThemeProvider theme={theme}>
      <Box p={2}>
        <Typography variant="h4">Option</Typography>
        <Box display="flex" flexDirection="column" gap={1} p={1}>
          <Box>
            <Typography variant="body2">学部</Typography>
            <Select variant="outlined" size="small" sx={{ width: 300 }}>
              <MenuItem value="din">大学院</MenuItem>
              <MenuItem value="ko1">工学部</MenuItem>
              <MenuItem value="sys">システム理工学部</MenuItem>
              <MenuItem value="dsn">デザイン工学部</MenuItem>
              <MenuItem value="arc">建築学部</MenuItem>
            </Select>
          </Box>
          <Box>
            <Typography variant="body2">学籍番号</Typography>
            <TextField variant="outlined" size="small" placeholder="XX00000" sx={{ width: 300 }} />
          </Box>
        </Box>
        <Box m={1}>
          <Button variant="contained" sx={{ width: 120 }}>
            保存
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OptionsIndex;
