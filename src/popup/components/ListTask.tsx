import { List } from "@mui/material";
import { ListItemTask } from "./ListItemTask";
import type { Task } from "~contents/types/task";

type ListCourseProps = {
  tasks: Task[];
  overflowTasks?: "auto" | "hidden" | "scroll";
};

const maxItems = 7;

export const ListTask = (props: ListCourseProps) => {
  const { tasks, overflowTasks = "auto" } = props;

  console.log(overflowTasks);

  const slicedTasks = overflowTasks === "hidden" ? tasks.slice(0, maxItems) : tasks;

  return (
    <>
      <List
        dense
        sx={{
          py: 0,
          maxHeight: 380,
          overflowX: "hidden",
          overflowY: overflowTasks,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {slicedTasks.map((d, index) => (
          <ListItemTask
            task={d}
            key={index}
            noDivider={index === slicedTasks.length - 1}
            isScrollBarShown={
              (overflowTasks === "auto" && slicedTasks.length > maxItems) || overflowTasks === "scroll" ? true : false
            }
          />
        ))}
      </List>
    </>
  );
};
