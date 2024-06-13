import { Divider, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import type { Task } from "~contents/types/task";

type ListItemTaskProps = {
  task: Task;
  noDivider?: boolean;
  isScrollBarShown?: boolean;
};

const getTaskColor = (
  task: Task,
): {
  backgroundColor: string;
  color: string;
  fontWeight: number;
} => {
  const deadlineInHours = differenceInHours(new Date(task.deadline), new Date());
  if (deadlineInHours < 6) return { backgroundColor: red[200], color: red[700], fontWeight: 600 };
  if (deadlineInHours < 12) return { backgroundColor: red[200], color: red[700], fontWeight: 600 };
  if (deadlineInHours < 24) return { backgroundColor: red[100], color: red[700], fontWeight: 600 };
  if (deadlineInHours < 72) return { backgroundColor: "inherit", color: red[700], fontWeight: 400 };
  if (deadlineInHours < 24 * 7) return { backgroundColor: "inherit", color: "inherit", fontWeight: 400 };
  return { backgroundColor: "inherit", color: grey[500], fontWeight: 400 };
};

const getRelativeTime = (date: Date, now: Date): string => {
  const diff = differenceInMinutes(date, now);
  if (diff < 180)
    return `${chrome.i18n.getMessage("taskListAbout")}${diff}${chrome.i18n.getMessage("taskListMinsLeft")}`;
  if (diff < 1440)
    return `${chrome.i18n.getMessage("taskListAbout")}${Math.floor(diff / 60)}${chrome.i18n.getMessage("taskListHoursLeft")}`;
  return `${chrome.i18n.getMessage("taskListAbout")}${Math.floor(diff / 1440)}${chrome.i18n.getMessage("taskListDaysLeft")}`;
};

export const ListItemTask = (props: ListItemTaskProps) => {
  const { task, noDivider, isScrollBarShown } = props;

  const handleClick = () => {
    if (task.link) {
      chrome.tabs.create({
        url: task.link,
      });
    }
  };

  const taskColor = getTaskColor(task);

  return (
    <>
      <ListItem disablePadding sx={{ alignItems: "stretch", backgroundColor: taskColor.backgroundColor }}>
        <ListItemButton onClick={handleClick} sx={{ alignItems: "stretch", p: 0, minHeight: 48 }}>
          <Stack>
            <ListItemText
              primary={
                <>
                  <Stack direction="row">
                    <Typography
                      noWrap
                      sx={{ width: 100, fontSize: "small", color: taskColor.color, fontWeight: taskColor.fontWeight }}
                    >
                      {task.course}
                    </Typography>
                    <Typography
                      noWrap
                      sx={{
                        ml: 1,
                        width: isScrollBarShown ? 204 : 214,
                        fontSize: "small",
                        color: taskColor.color,
                        fontWeight: taskColor.fontWeight,
                      }}
                    >
                      {task.title}
                    </Typography>
                  </Stack>
                </>
              }
              secondary={
                <Stack direction="row" gap={1}>
                  <span>{getRelativeTime(new Date(task.deadline), new Date())}</span>
                  <span>{format(new Date(task.deadline), "yyyy/MM/dd HH:mm:ss")}</span>
                </Stack>
              }
              secondaryTypographyProps={{
                fontSize: "x-small",
                color: taskColor.color,
                fontWeight: taskColor.fontWeight,
              }}
              sx={{ flex: "0 0 auto", my: "auto", pl: 1.25 }}
            />
          </Stack>
        </ListItemButton>
      </ListItem>
      {!noDivider && <Divider />}
    </>
  );
};
