import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { ListCourse } from "./ListCourse";
import type { Task } from "~contents/types/task";
import type { TimeTableData } from "~contents/types/timetable";

type MultiPageTimeTableProps = {
  courses?: TimeTableData[];
  tasks?: Task[];
  shows: TabTypes[];
};

const tabDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
type TabDays = (typeof tabDays)[number];

const tabMiscs = ["Tasks"] as const;
type TabMiscs = (typeof tabMiscs)[number];

type TabTypes = TabDays | TabMiscs;

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

export const MultiPageTimeTable = (props: MultiPageTimeTableProps) => {
  const { courses } = props;

  const [value, setValue] = useState<number>(1);

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
            {Array.from({ length: 7 }, (_, day) => (
              <Tab
                label={day}
                {...a11yProps(day)}
                key={day}
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
                }}
              />
            ))}
          </Tabs>
        </Box>
        {tabDays.map((day, index) => (
          <TabPanel value={value} index={index}>
            <ListCourse courses={courses.filter((course) => course.day === index)} key={index} />
          </TabPanel>
        ))}
      </Box>
    </>
  );
};
