import { List } from "@mui/material";
import { useMemo } from "react";
import { ListItemCourse } from "./ListItemCourse";
import type { TimeTableData } from "~contents/types/timetable";

type ListCourseProps = {
  courses: TimeTableData[];
};

export const ListCourse = (props: ListCourseProps) => {
  const { courses } = props;

  const timeTableData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => courses.filter((course) => course.time === i + 1));
  }, [courses]);

  return (
    <>
      <List dense sx={{ py: 0 }}>
        {timeTableData.map((d, index) => (
          <ListItemCourse courses={d} time={index + 1} key={index} />
        ))}
      </List>
    </>
  );
};
