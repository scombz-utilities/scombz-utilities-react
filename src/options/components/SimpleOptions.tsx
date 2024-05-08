import { Box, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import { DataOperation } from "./DataOperation";
import { Information } from "./Information";
import { RecommendedOptions } from "./RecommendedOptions";
import type { Saves } from "~settings";

type Props = {
  saves: Saves;
  setSettings: (key: string, value: unknown) => void;
  setSaves: (saves: Saves) => void;
};
export const SimpleOptions = (props: Props) => {
  const { saves, setSettings, setSaves } = props;

  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1,
          backgroundColor: "#fffa",
          backdropFilter: "blur(3px)",
        }}
      >
        <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label={chrome.i18n.getMessage("RecommendedOptions")} />
          <Tab label={chrome.i18n.getMessage("IOReset")} />
          <Tab label="情報" />
        </Tabs>
      </Box>

      <Box px={2} py={3}>
        {tabIndex === 0 && <RecommendedOptions saves={saves} setSettings={setSettings} />}
        {tabIndex === 1 && <DataOperation saves={saves} setSaves={setSaves} />}
        {tabIndex === 2 && <Information />}
      </Box>
    </>
  );
};
