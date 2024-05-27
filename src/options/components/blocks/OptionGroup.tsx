import { Box, Typography } from "@mui/material";

type Props = {
  i18nTitle: string;
  description?: string;
  children: React.ReactNode;
};

export const OptionGroup = (props: Props) => {
  const { i18nTitle, description, children } = props;
  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6">{chrome.i18n.getMessage(i18nTitle) || i18nTitle}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Box sx={{ display: "felx", flexDirection: "column", gap: 1 }}>{children}</Box>
    </Box>
  );
};
