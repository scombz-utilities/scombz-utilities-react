import { Box } from "@mui/material";

type Props = {
  i18nTitle: string;
  description?: string;
  children: React.ReactNode;
};

export const OptionGroup = (props: Props) => {
  const { i18nTitle, description, children } = props;
  return (
    <Box sx={{ my: 3, backgroundColor: "inherit" }}>
      <h3>{chrome.i18n.getMessage(i18nTitle) || i18nTitle}</h3>
      <p>{description}</p>
      <Box sx={{ display: "felx", flexDirection: "column", gap: 1 }}>{children}</Box>
    </Box>
  );
};
