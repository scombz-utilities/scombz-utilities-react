import { Box } from "@mui/material";

import React, { useState, useEffect } from "react";
import type { Task } from "../types/task";
import { useWindowSize } from "../util/functions";
import { defaultSaves } from "../util/settings";
import type { Saves } from "../util/settings";

export const TaskList = () => {
  const [tasklist, setTasklist] = useState<Task[]>([]);
  useEffect(() => {
    const fetchTasklist = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      setTasklist(currentData.tasklist);
    };
    fetchTasklist();
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
          backgroundColor: "#fff7",
          backdropFilter: "blur(6px)",
          padding: 1,
          borderRadius: 1,
        }}
      >
        TASKLIST
        {tasklist.map((task) => (
          <div>{task.title}</div>
        ))}
      </Box>
    </>
  );
};
