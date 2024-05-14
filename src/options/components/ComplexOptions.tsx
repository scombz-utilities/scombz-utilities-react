import { Box, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import { AdvancedOptions } from "./AdvancedOptions";
import { BasicOptions } from "./BasicOptions";
import { CustomCSS } from "./CustomCSS";
import { DataOperation } from "./DataOperation";
import { Information } from "./Information";
import { WidgetOptions } from "./WidgetOptions";
import type { Saves } from "~settings";
type Props = {
  saves: Saves;
  setSettings: (key: string, value: unknown) => void;
  setScombzData: (key: string, value: unknown) => void;
  setSaves: (saves: Saves) => void;
};
export const ComplexOptions = (props: Props) => {
  const { saves, setSettings, setScombzData, setSaves } = props;

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
          <Tab label="基本設定" />
          <Tab label="ウィジェット設定" />
          <Tab label="詳細設定" />
          <Tab label="カスタムCSS" />
          <Tab label="設定の管理" />
          <Tab label="情報" />
        </Tabs>
      </Box>

      <Box px={2} py={3}>
        {tabIndex === 0 && <BasicOptions saves={saves} setSettings={setSettings} />}
        {tabIndex === 1 && <WidgetOptions saves={saves} setSettings={setSettings} />}
        {tabIndex === 2 && <AdvancedOptions saves={saves} setSettings={setSettings} setScombzData={setScombzData} />}
        {tabIndex === 3 && (
          <CustomCSS value={saves.settings.customCSS} onSaveButtonClick={(value) => setSettings("customCSS", value)} />
        )}
        {tabIndex === 4 && <DataOperation saves={saves} setSaves={setSaves} />}
        {tabIndex === 5 && <Information />}
      </Box>
    </>
  );
};
