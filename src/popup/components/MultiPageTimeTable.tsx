import { Box, Chip, Stack, Tab, Tabs } from "@mui/material";
import { differenceInHours } from "date-fns";
import React, { useMemo, useState } from "react";
import { ListCourse } from "./ListCourse";
import { ListTask } from "./ListTask";
import type { Task } from "~contents/types/task";
import type { TimeTableData } from "~contents/types/timetable";

type MultiPageTimeTableProps = {
  courses?: TimeTableData[];
  tasks?: Task[];
  days: TabDays[];
  showTasks?: boolean;
  overflowTasks?: "auto" | "hidden" | "scroll";
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

const getTaskTabColor = (
  tasks: Task[],
): {
  chip: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  tab: string;
  indicator: string;
} => {
  if (tasks.length > 0 && differenceInHours(new Date(tasks[0].deadline), new Date()) < 24)
    return {
      chip: "error",
      tab: "error.main",
      indicator: "error.main",
    };
  return {
    chip: "default",
    tab: "primary.main",
    indicator: "primary.main",
  };
};

export const MultiPageTimeTable = (props: MultiPageTimeTableProps) => {
  const { courses, days, tasks = [], showTasks = false, overflowTasks = "hidden" } = props;

  const [value, setValue] = useState<number>(
    days.includes(tabDays[new Date().getDay()]) ? days.findIndex((item) => item === tabDays[new Date().getDay()]) : 0,
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

  const intensiveCourses: TimeTableData[] = useMemo(() => {
    return courses.filter((course) => course.day === -1);
  }, [courses]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const taskTabColor = getTaskTabColor(tasks);

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
              "& .MuiTabs-indicator": {
                backgroundColor: value === days.length && taskTabColor.indicator,
              },
              "& .tab-tasks.Mui-selected": {
                color: taskTabColor.tab,
              },
            }}
            aria-label="tabs"
          >
            {days.map((day, index) => (
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
            {showTasks && (
              <Tab
                label={
                  <>
                    <Stack direction="row" sx={{ width: "max-content" }}>
                      {tabName[chrome.i18n.getUILanguage() === "ja" ? "ja" : "en"]["tasks"]}
                      <Chip
                        label={tasks.length}
                        color={taskTabColor.chip}
                        sx={{
                          height: "17px",
                          ml: 0.75,
                          mt: -0.125,
                          lineHeight: "inherit",
                          ".MuiChip-label": {
                            px: 0.75,
                            mt: 0.25,
                          },
                        }}
                      />
                    </Stack>
                  </>
                }
                {...a11yProps(days.length)}
                className="tab-tasks"
                key={days.length}
                sx={{
                  ml: 1,
                  p: 0,
                  minWidth: "max-content",
                  minHeight: 24,
                  height: 24,
                  fontSize: "small",
                  borderBottom: 1,
                  borderColor: "divider",
                  transition:
                    "border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                  ":not(.Mui-selected):not(:active):hover": {
                    color: taskTabColor.tab,
                    borderColor: taskTabColor.tab,
                  },
                  textTransform: "none",
                }}
              />
            )}
          </Tabs>
        </Box>
        {days.map((day, index) => (
          <TabPanel value={value} index={index} key={index}>
            <ListCourse courses={weeklyTimeTableData[day]} key={index} intensiveCourses={intensiveCourses} />
          </TabPanel>
        ))}
        {showTasks && (
          <TabPanel value={value} index={days.length} key={days.length}>
            <ListTask tasks={tasks} overflowTasks={overflowTasks} key={days.length} />
          </TabPanel>
        )}
      </Box>
    </>
  );
};
