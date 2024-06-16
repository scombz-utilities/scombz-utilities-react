import SettingsIcon from "@mui/icons-material/Settings";
import { Box, ThemeProvider, Grid, Stack, Link, IconButton, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [loaded, setLoaded] = useState<boolean>(false);
  const [overflowTasksMode, setOverflowTasksMode] = useState<"auto" | "hidden" | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const loadFromSaves = () => {
    chrome.storage.local.get(defaultSaves, (items: Saves) => {
      setSaves(items);

      const now = new Date().getTime();

      // アンケートは通知対象の科目一覧でフィルタリング
      const notifySubjects = items.settings.notifySurveySubjects.map((sbj) => sbj.name);
      const surveyList = items.scombzData.surveyList.filter((d) => notifySubjects.includes(d.course));

      const mergedTask = [...items.scombzData.tasklist, ...surveyList, ...items.scombzData.originalTasklist]
        .filter((task) => !items.settings.hiddenTaskIdList.includes(task.id)) // 非表示タスクを除外
        .filter((task) => Date.parse(task.deadline) >= now)
        .filter(
          (task) =>
            !items.settings.popupHideFutureTasks ||
            (Date.parse(task.deadline) - now) / 86400000 < items.settings.popupHideFutureTasksRange,
        )
        .map((task) => {
          // deadlineをDate型で保持 (formatやsortなどで扱いやすくなるため)
          return { ...task, deadlineDate: new Date(task.deadline) };
        });
      mergedTask.sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
      setTasklist(mergedTask);

      if (!overflowTasksMode) setOverflowTasksMode(items.settings.popupOverflowMode);

      setLoaded(true);
    });
  };

  useEffect(() => {
    loadFromSaves();
  }, []);

  // 時間割内の要素数の変化によって一瞬表示がちらつくのを防止するため
  if (!loaded) return <></>;

  return (
    <ThemeProvider theme={theme}>
      <Box
        width={376}
        maxWidth={376}
        overflow={process.env.PLASMO_BROWSER === "firefox" && "hidden"}
        textAlign="center"
        mt={process.env.PLASMO_BROWSER !== "firefox" && 1}
      >
        <Grid>
          <img
            src={chrome.runtime.getURL("assets/scombz_utilities.svg")}
            width={process.env.PLASMO_BROWSER === "firefox" ? 200 : 240}
            alt="ScombZ Utilites"
          />
        </Grid>

        <Box
          mt={process.env.PLASMO_BROWSER === "firefox" ? 0.5 : 1}
          mb={process.env.PLASMO_BROWSER === "firefox" ? 0.5 : 2}
          mx={2}
        >
          <Box>
            <MultiPageTimeTable
              courses={saves.scombzData.timetable}
              tasks={tasklist}
              showTasks={saves.settings.popupTasksTab}
              overflowTasks={overflowTasksMode}
              setOverflowTasksMode={setOverflowTasksMode}
              isFetching={isFetching}
              setIsFetching={setIsFetching}
              loadFromSaves={loadFromSaves}
              lastTaskFetchUnixTime={saves.scombzData.lastTaskFetchUnixTime}
            />
          </Box>
        </Box>

        <Grid
          container
          alignItems="center"
          sx={{
            background: theme.palette.grey[300],
          }}
          width={process.env.PLASMO_BROWSER === "firefox" ? "100%" : "100vw"}
          px={1.5}
          py={0.5}
          m={process.env.PLASMO_BROWSER !== "firefox" && -1}
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
            <IconButton aria-label="options" onClick={openOptions} size="small">
              <SettingsIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default IndexPopup;
