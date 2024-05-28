import { Box, Button, Typography, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { MultiPageTimeTable } from "./components/MultiPageTimeTable";
import theme from "~/theme";
import type { Task } from "~contents/types/task";
import { defaultSaves, type Saves } from "~settings";

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

        <Box my={1}>
          <Box>
            <MultiPageTimeTable
              courses={saves.scombzData.timetable}
              tasks={tasklist}
              days={["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]}
              showTasks
              overflowTasks="auto"
            />
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
