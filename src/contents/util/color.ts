import { grey, red, pink } from "@mui/material/colors";
import { differenceInHours } from "date-fns";
import type { Task } from "../types/task";

export const getTaskColor = (
  task: Task,
  isDarkMode?: boolean,
): {
  backgroundColor: string;
  color: string;
  fontWeight: number;
} => {
  const deadlineInHours = differenceInHours(new Date(task.deadline), new Date());
  if (isDarkMode) {
    if (deadlineInHours < 6) return { backgroundColor: pink[900], color: red[400], fontWeight: 600 };
    if (deadlineInHours < 12) return { backgroundColor: pink[900], color: red[400], fontWeight: 600 };
    if (deadlineInHours < 24) return { backgroundColor: pink[900], color: red[600], fontWeight: 400 };
    if (deadlineInHours < 72) return { backgroundColor: "inherit", color: red[600], fontWeight: 400 };
    if (deadlineInHours < 24 * 7) return { backgroundColor: "inherit", color: "inherit", fontWeight: 400 };
    return { backgroundColor: "inherit", color: grey[600], fontWeight: 400 };
  } else {
    if (deadlineInHours < 6) return { backgroundColor: red[200], color: red[900], fontWeight: 600 };
    if (deadlineInHours < 12) return { backgroundColor: red[200], color: red[900], fontWeight: 600 };
    if (deadlineInHours < 24) return { backgroundColor: red[100], color: red[900], fontWeight: 600 };
    if (deadlineInHours < 72) return { backgroundColor: "inherit", color: red[900], fontWeight: 400 };
    if (deadlineInHours < 24 * 7) return { backgroundColor: "inherit", color: "inherit", fontWeight: 400 };
    return { backgroundColor: "inherit", color: grey[500], fontWeight: 400 };
  }
};
