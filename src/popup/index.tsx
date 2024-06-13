import SettingsIcon from "@mui/icons-material/Settings";
import { Box, ThemeProvider, Grid, Stack, Link, IconButton, Divider } from "@mui/material";
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
      <Box width={376} textAlign="center" mt={1}>
        <Grid>
          <img src={chrome.runtime.getURL("assets/scombz_utilities.svg")} width={240} alt="ScombZ Utilites" />
        </Grid>

        <Box mt={1} mb={2} mx={2}>
          <Box>
            <MultiPageTimeTable
              courses={saves.scombzData.timetable}
              tasks={tasklist}
              days={["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]}
              showTasks
              overflowTasks="auto"
            />
          </Box>
        </Box>

        <Grid
          container
          alignItems="center"
          sx={{
            background: theme.palette.grey[300],
          }}
          width="100vw"
          px={1.5}
          py={0.75}
          m={-1}
        >
          <Grid item xs />
          <Grid item xs={8}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              justifyContent="center"
            >
              <Link
                href="https://scombz.shibaura-it.ac.jp"
                target="_blank"
                rel="noopener"
                color={theme.palette.grey[800]}
              >
                ScombZ
              </Link>
              <Link
                href="https://github.com/scombz-utilities/scombz-utilities-react"
                target="_blank"
                rel="noopener"
                color={theme.palette.grey[800]}
              >
                GitHub
              </Link>
              <Link href="https://scombz-utilities.com" target="_blank" rel="noopener" color={theme.palette.grey[800]}>
                Support
              </Link>
            </Stack>
          </Grid>
          <Grid item xs textAlign="right">
            <IconButton aria-label="options" onClick={openOptions}>
              <SettingsIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default IndexPopup;
