import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const OptionGroup = (props: Props) => {
  const { title, description, children } = props;
  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Box sx={{ display: "felx", flexDirection: "column", gap: 1 }}>{children}</Box>
    </Box>
  );
};
