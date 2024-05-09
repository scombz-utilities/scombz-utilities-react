import { Box, Button, Typography, ThemeProvider } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { MultiPageTimeTable } from "./components/MultiPageTimeTable";
import theme from "~/theme";
import type { Task } from "~contents/types/task";
import { defaultSaves, type Saves } from "~settings";

const days = ["日", "月", "火", "水", "木", "金", "土"];

const openOptions = () => {
  chrome.runtime.openOptionsPage();
};

const IndexPopup = () => {
  const [saves, setSaves] = useState<Saves>(defaultSaves);
  const [tasklist, setTasklist] = useState<Task[]>([]);

  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (items: Saves) => {
      setSaves(items);

      // アンケートは通知対象の科目一覧でフィルタリング
      const notifySubjects = items.settings.notifySurveySubjects.map((sbj) => sbj.name);
      const surveyList = items.scombzData.surveyList.filter((d) => notifySubjects.includes(d.course));

      const mergedTask = [...items.scombzData.tasklist, ...surveyList, ...items.scombzData.originalTasklist]
        .filter((task) => !items.settings.hiddenTaskIdList.includes(task.id)) // 非表示タスクを除外
        .map((task) => {
          // deadlineをDate型で保持 (formatやsortなどで扱いやすくなるため)
          return { ...task, deadlineDate: new Date(task.deadline) };
        });
      mergedTask.sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
      setTasklist(mergedTask);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box width={360} textAlign="center" m={2}>
        <Typography variant="h5">ScombZ Utilities</Typography>

        {/* 授業一覧 */}
        <Box my={1}>
          <Box>
            {/* <Typography variant="h6">TimeTable</Typography>
            <ListCourse courses={saves.scombzData.timetable} /> */}
            <MultiPageTimeTable
              courses={saves.scombzData.timetable}
              shows={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Tasks"]}
            />
          </Box>

          {/* 課題一覧 */}
          <Box>
            <Typography variant="h6">Task</Typography>
            {tasklist.map((task) => (
              <Box key={task.id} sx={{ display: "flex", gap: 2 }}>
                <Typography>{task.title}</Typography>
                <Typography>{format(task.deadlineDate, "MM月dd日mm:ss")}</Typography>
              </Box>
            ))}
          </Box>

          <Button variant="contained" onClick={openOptions}>
            設定を開く
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default IndexPopup;
