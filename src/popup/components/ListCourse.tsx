import { List } from "@mui/material";
import { useMemo } from "react";
import { ListItemCourse } from "./ListItemCourse";
import type { TimeTableData } from "~contents/types/timetable";

type ListCourseProps = {
  courses: TimeTableData[];
  intensiveCourses: TimeTableData[];
  lastPeriod: number;
};

export const ListCourse = (props: ListCourseProps) => {
  const { courses, intensiveCourses, lastPeriod } = props;

  const timeTableData = useMemo(() => {
    return Array.from({ length: lastPeriod }, (_, i) => courses.filter((course) => course.time === i + 1));
  }, [courses, lastPeriod]);

  const height = useMemo(() => {
    let h = 0;
    [...timeTableData.slice(0, lastPeriod)].forEach((d) => {
      h += d.length > 1 ? d.length * 30 : 48;
    });
    if (intensiveCourses.length > 0) {
      h += intensiveCourses.length > 1 ? intensiveCourses.length * 30 : 48 + 2;
    }
    return h;
  }, [courses, intensiveCourses, lastPeriod]);

  return (
    <>
      <List dense sx={{ py: 0, maxHeight: 380, overflowY: "auto", borderBottom: 1, borderColor: "divider" }}>
        {timeTableData.map((d, index) => (
          <ListItemCourse
            courses={d}
            time={index + 1}
            key={index}
            noDivider={index === lastPeriod - 1 + (intensiveCourses.length > 0 ? 1 : 0)}
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
