import { Box, Typography } from "@mui/material";
import { Editor } from "./Editor";

type Props = {
  value: string;
  onChange: (value: string) => void;
};
export const CustomCSS = (props: Props) => {
  const { value, onChange } = props;
  return (
    <Box>
      <Typography variant="h5" mb={1}>
        カスタムCSS
      </Typography>
      <Editor value={value} onChange={onChange} />
    </Box>
  );
};
