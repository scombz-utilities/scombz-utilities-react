import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  styled,
  ButtonGroup,
  IconButton,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import type { SxProps } from "@mui/system";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import React, { useState, useEffect, useCallback } from "react";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { MdCloseFullscreen, MdOpenInFull, MdAdd } from "react-icons/md";
import type { Subject } from "../types/subject";
import type { Task } from "../types/task";
import { useWindowSize } from "../util/functions";
import { defaultSaves } from "../util/settings";
import type { Saves } from "../util/settings";

const getTaskColor = (
  task: Task,
): {
  backgroundColor: string;
  color: string;
  fontWeight: number;
} => {
  const deadlineInHours = differenceInHours(new Date(task.deadline), new Date());
  if (deadlineInHours < 6) return { backgroundColor: red[200], color: red[900], fontWeight: 600 };
  if (deadlineInHours < 12) return { backgroundColor: red[100], color: red[900], fontWeight: 600 };
  if (deadlineInHours < 24) return { backgroundColor: red[50], color: red[900], fontWeight: 600 };
  if (deadlineInHours < 72) return { backgroundColor: "inherit", color: red[900], fontWeight: 400 };
  if (deadlineInHours < 24 * 7) return { backgroundColor: "inherit", color: "inherit", fontWeight: 400 };
  return { backgroundColor: "inherit", color: grey[500], fontWeight: 400 };
};

const TaskTypography = styled(Typography)(() => ({
  display: "block",
  textWrap: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 400,
  letterSpacing: 0,
}));

type TaskTableCellProps = {
  children: React.ReactNode;
  sx?: SxProps;
  href?: string;
};
const TaskTableCell = (props: TaskTableCellProps) => {
  const { children, sx = {}, href } = props;
  if (href)
    return (
      <TableCell align="left" sx={{ padding: "4px 8px" }}>
        <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
          <TaskTypography
            variant="caption"
            sx={{
              "&:hover": { textDecoration: "underline" },
              borderRadius: 1,
              padding: "1px",
              ...sx,
            }}
          >
            {children}
          </TaskTypography>
        </a>
      </TableCell>
    );
  return (
    <TableCell align="left" sx={{ padding: "4px 8px" }}>
      <TaskTypography variant="caption" sx={sx}>
        {children}
      </TaskTypography>
    </TableCell>
  );
};

const getRelativeTime = (date: Date, now: Date): string => {
  const diff = differenceInMinutes(date, now);
  if (diff < 180) return `残り約${diff}分`;
  if (diff < 1440) return `残り約${Math.floor(diff / 60)}時間`;
  return `残り約${Math.floor(diff / 1440)}日`;
};

export const TaskList = () => {
  const [isTaskListOpen, setIsTaskListOpen] = useState<boolean>(true);
  const [isRelativeTime, setIsRelativeTime] = useState<boolean>(true);
  const [tasklist, setTasklist] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [nowDate, setNowDate] = useState<Date>();
  const [formatStr, setFormatStr] = useState<string>("yyyy/MM/dd HH:mm");
  const [highlightTask, setHighlightTask] = useState<boolean>(true);

  const toggleOpen = useCallback(() => {
    setIsTaskListOpen(!isTaskListOpen);
  }, [isTaskListOpen]);

  const toggleRelativeTime = useCallback(() => {
    setIsRelativeTime(!isRelativeTime);
  }, [isRelativeTime]);

  useEffect(() => {
    const fetchTasklist = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      setSubjects(currentData.settings.notifySurveySubjects);
      setFormatStr(currentData.settings.deadlineFormat);
      setIsRelativeTime(currentData.settings.deadlineMode === "relative");
      setHighlightTask(currentData.settings.highlightTask);

      const normalTaskList = currentData.scombzData.tasklist;

      const notifySurveySubjectsName = currentData.settings.notifySurveySubjects.map((subject) => subject.name);
      const allSurveyList = currentData.scombzData.surveyList;
      const surveyList = allSurveyList.filter((task) => notifySurveySubjectsName.includes(task.course));

      const now = new Date();

      const combinedTaskList = [...normalTaskList, ...surveyList]
        .map((task) => {
          return { ...task, deadlineDate: new Date(task.deadline) };
        })
        .filter((task) => task.deadlineDate >= now);

      combinedTaskList.sort((x, y) => {
        const [a, b] = [x.deadlineDate, y.deadlineDate];
        return a.getTime() - b.getTime();
      });

      setTasklist(combinedTaskList);
    };
    fetchTasklist();
    setNowDate(new Date());
    setInterval(() => {
      setNowDate(new Date());
    }, 60000);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, height] = useWindowSize();

  if (width < 540) {
    return <></>;
  }

  return (
    <>
      <Box
        maxWidth="1200px"
        m={width > 1540 ? "10px auto" : "10px"}
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: "#fff9",
          backdropFilter: "blur(6px)",
          padding: 1,
          borderRadius: 1,
        }}
      >
        <Box mb={0.8} position="relative">
          <Typography variant="h6" sx={{ px: 0.5, textAlign: "left", fontSize: "16px" }}>
            課題一覧
          </Typography>
          <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
            <IconButton size="small">
              <MdAdd />
            </IconButton>
            <IconButton onClick={toggleRelativeTime} size="small">
              <HiOutlineSwitchHorizontal />
            </IconButton>
            <IconButton onClick={toggleOpen} size="small">
              {isTaskListOpen ? <MdCloseFullscreen /> : <MdOpenInFull />}
            </IconButton>
          </ButtonGroup>
        </Box>
        {isTaskListOpen && (
          <Paper>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {width > 880 && <TaskTableCell>科目</TaskTableCell>}
                    <TaskTableCell>課題名</TaskTableCell>
                    <TaskTableCell>
                      <Box onClick={toggleRelativeTime} sx={{ cursor: "pointer" }}>
                        期限
                      </Box>
                    </TaskTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasklist.length === 0 && (
                    <TableRow>
                      <TaskTableCell sx={{ width: "100%" }}>課題はありません</TaskTableCell>
                    </TableRow>
                  )}
                  {tasklist.map((task) => {
                    const courseUrl = subjects.find((subject) => subject.name === task.course)?.url;
                    const colors = highlightTask ? getTaskColor(task) : {};
                    return (
                      <TableRow
                        key={task.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          maxWidth: "100%",
                          ...colors,
                        }}
                      >
                        {width > 880 && (
                          <TaskTableCell sx={{ ...colors, maxWidth: "110px" }} href={courseUrl}>
                            {task.course}
                          </TaskTableCell>
                        )}
                        <TaskTableCell
                          sx={{ ...colors, maxWidth: width > 880 ? "calc(100vw - 610px)" : "calc(100vw - 480px)" }}
                          href={task.link}
                        >
                          {task.title}
                        </TaskTableCell>
                        <TaskTableCell sx={{ ...colors, width: "110px" }}>
                          <Box onClick={toggleRelativeTime}>
                            {isRelativeTime
                              ? getRelativeTime(task.deadlineDate, nowDate)
                              : format(task.deadlineDate, formatStr)}
                          </Box>
                        </TaskTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </>
  );
};
