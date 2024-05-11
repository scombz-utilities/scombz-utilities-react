import { Box, Tab, Tabs } from "@mui/material";
import React, { useMemo, useState } from "react";
import { ListCourse } from "./ListCourse";
import type { Task } from "~contents/types/task";
import type { TimeTableData } from "~contents/types/timetable";

type MultiPageTimeTableProps = {
  courses?: TimeTableData[];
  tasks?: Task[];
  shows: TabTypes[];
};

const tabDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
type TabDays = (typeof tabDays)[number];

const tabMiscs = ["tasks"] as const;
type TabMiscs = (typeof tabMiscs)[number];

type TabTypes = TabDays | TabMiscs;

type WeeklyTimeTableData = {
  [K in TabDays]: TimeTableData[];
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <>{children}</>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

const tabName: {
  [x: string]: {
    [K in TabTypes]: string;
  };
} = {
  ja: {
    sunday: "日",
    monday: "月",
    tuesday: "火",
    wednesday: "水",
    thursday: "木",
    friday: "金",
    saturday: "土",
    tasks: "課題",
  },
  en: {
    sunday: "Sun",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    tasks: "Tasks",
  },
};

export const MultiPageTimeTable = (props: MultiPageTimeTableProps) => {
  const { courses, shows } = props;

  const [value, setValue] = useState<number>(
    shows.includes(tabDays[new Date().getDay()]) ? shows.findIndex((item) => item === tabDays[new Date().getDay()]) : 0,
  );

  const weeklyTimeTableData: WeeklyTimeTableData = useMemo(() => {
    const data: WeeklyTimeTableData = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    };
    for (const day of tabDays) data[day] = courses.filter((course) => tabDays[course.day] === day);
    return data;
  }, [courses]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%", py: 1 }}>
        <Box sx={{}}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            sx={{
              minHeight: 24,
              height: 24,
            }}
            aria-label="tabs"
          >
            {shows.map((day, index) => (
              <Tab
                label={tabName[chrome.i18n.getUILanguage() === "ja" ? "ja" : "en"][day]}
                {...a11yProps(index)}
                key={index}
                sx={{
                  p: 0,
                  minWidth: "unset",
                  minHeight: 24,
                  height: 24,
                  fontSize: "small",
                  borderBottom: 1,
                  borderColor: "divider",
                  transition:
                    "border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                  ":not(.Mui-selected):not(:active):hover": {
                    color: "primary.main",
                    borderColor: "primary.main",
                  },
                  textTransform: "none",
                }}
              />
            ))}
          </Tabs>
        </Box>
        {shows.map((day, index) => (
          <TabPanel value={value} index={index} key={index}>
            <ListCourse courses={weeklyTimeTableData[day]} key={index} />
          </TabPanel>
        ))}
      </Box>
    </>
  );
};
