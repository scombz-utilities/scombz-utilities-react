import { Box, Button, Tooltip } from "@mui/material";
import { format } from "date-fns";
import { useCallback } from "react";
import { fetchTasks } from "~contents/tasks";
import type { Task } from "~contents/types/task";
import theme from "~theme";

type TasksBottomProps = {
  tasks: Task[];
  overflowTasks?: "auto" | "hidden";
  lastTaskFetchUnixTime: number;
  loadFromSaves: () => void;
  isFetching: boolean;
  setIsFetching: (value: boolean) => void;
  setOverflowTasksMode: (value: "auto" | "hidden") => void;
};

const maxTasks = 7;

export const TasksBottom = (props: TasksBottomProps) => {
  const {
    tasks,
    overflowTasks,
    lastTaskFetchUnixTime,
    loadFromSaves,
    isFetching,
    setIsFetching,
    setOverflowTasksMode,
  } = props;

  const handleRefresh = useCallback(() => {
    const fetching = async () => {
      try {
        await fetchTasks(true);
        loadFromSaves();
      } catch (e) {
        console.error(e);
        alert("An error occurred:" + e?.message ?? e);
      } finally {
        setIsFetching(false);
      }
    };

    // FirefoxだとCORSの関係上popupからのfetchが使えないので代わりに課題一覧を開く
    if (process.env.PLASMO_BROWSER === "firefox") {
      window.open("https://scombz.shibaura-it.ac.jp/lms/task", "_blank");
      window.close();
      return;
    }

    if (isFetching) return;
    setIsFetching(true);

    fetching();
  }, []);

  return (
    <Box display="flex" justifyContent="space-between" color={theme.palette.grey[600]}>
      <Box>
        {overflowTasks === "hidden" && !isFetching && tasks.length > maxTasks && (
          <Tooltip title={chrome.i18n.getMessage("showAll")}>
            <Button variant="text" size="small" color="inherit" onClick={() => setOverflowTasksMode("auto")}>
              {chrome.i18n.getMessage("andNMore", (tasks.length - maxTasks).toString())}
            </Button>
          </Tooltip>
        )}
      </Box>
      <Tooltip
        title={
          process.env.PLASMO_BROWSER === "firefox"
            ? chrome.i18n.getMessage("popupOpenTasksPage")
            : chrome.i18n.getMessage("reloadTaskList")
        }
      >
        <Button variant="text" size="small" color="inherit" disabled={isFetching} onClick={handleRefresh}>
          {chrome.i18n.getMessage("taskListLastUpdate")}: {format(new Date(lastTaskFetchUnixTime), "yyyy/MM/dd HH:mm")}
        </Button>
      </Tooltip>
    </Box>
  );
};
