import { List } from "@mui/material";
import { useMemo } from "react";
import { ListItemCourse } from "./ListItemCourse";
import type { TimeTableData } from "~contents/types/timetable";

type ListCourseProps = {
  courses: TimeTableData[];
  intensiveCourses: TimeTableData[];
};

export const ListCourse = (props: ListCourseProps) => {
  const { courses, intensiveCourses } = props;

  const maxHours = 7;

  const timeTableData = useMemo(() => {
    return Array.from({ length: maxHours }, (_, i) => courses.filter((course) => course.time === i + 1));
  }, [courses, maxHours]);

  const height = useMemo(() => {
    let h = 0;
    [...timeTableData.slice(0, maxHours)].forEach((d) => {
      h += d.length > 1 ? d.length * 30 : 48;
    });
    if (intensiveCourses.length > 0) {
      h += intensiveCourses.length > 1 ? intensiveCourses.length * 30 : 48 + 2;
    }
    return h;
  }, [courses, intensiveCourses, maxHours]);

  return (
    <>
      <List dense sx={{ py: 0, maxHeight: 380, overflowY: "auto", borderBottom: 1, borderColor: "divider" }}>
        {timeTableData.map((d, index) => (
          <ListItemCourse
            courses={d}
            time={index + 1}
            key={index}
            noDivider={index === maxHours - 1 + (intensiveCourses.length > 0 ? 1 : 0)}
            isScrollBarShown={height > 380}
          />
        ))}
        {intensiveCourses.length > 0 && (
          <ListItemCourse
            intensive
            courses={intensiveCourses}
            time={-1}
            key={99}
            noDivider={true}
            isScrollBarShown={height > 380}
          />
        )}
      </List>
    </>
  );
};
