import { Divider, ListItem, ListItemButton, ListItemText, Stack, Tooltip, Typography } from "@mui/material";
import type { TimeTableData } from "~contents/types/timetable";

type ListItemCourseProps = {
  courses: TimeTableData[];
  time: number;
};

const terms = ["9:00~10:40", "10:50~12:30", "13:20~15:00", "15:10~16:50", "17:00~18:40", "18:50~20:30", "20:40~22:20"];

export const ListItemCourse = (props: ListItemCourseProps) => {
  const { courses, time } = props;

  return (
    <>
      <ListItem disablePadding sx={{ alignItems: "stretch" }}>
        <ListItemButton disableGutters sx={{ alignItems: "stretch", p: 0, minHeight: 48 }} tabIndex={-1}>
          <Stack sx={{ width: 66, pl: 1.25 }}>
            <ListItemText
              primary={time + "限"}
              secondary={terms[time - 1]}
              primaryTypographyProps={{ fontSize: "small" }}
              secondaryTypographyProps={{ fontSize: "x-small" }}
              sx={{ flex: "0 0 auto", my: "auto" }}
            />
          </Stack>
          <Stack direction="column" flexGrow={1}>
            {courses.map((course, index) => (
              <ListItemButton
                disableRipple
                disableTouchRipple
                disableGutters
                sx={{
                  pl: 1,
                  width: 286,
                  minHeight: 30,
                  position: "relative",
                  ":where(:hover > *):not(:hover):not(:active), :where(:focus-within > *):not(:focus)": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    zIndex: 1,
                  },
                  ":after": {
                    content: '""',
                    position: "absolute",
                    width: 76,
                    height: "100%",
                    left: -76,
                  },
                  ":hover, :focus": {
                    backgroundColor: "unset",
                  },
                }}
                onClick={() => {
                  if (course.id) {
                    chrome.tabs.create({
                      url: `https://scombz.shibaura-it.ac.jp/lms/course?idnumber=${course.id}`,
                    });
                  }
                }}
                key={index}
              >
                <Typography noWrap={true} sx={{ fontSize: "small", textAlign: "left" }}>
                  {course.name}
                  {course.classroom ? (
                    <Typography component="span" sx={{ ml: 1, fontSize: "small", color: "GrayText" }}>
                      <span> - </span>
                      <Tooltip title={course.classroom} placement="top">
                        <span>{course.classroom}</span>
                      </Tooltip>
                    </Typography>
                  ) : (
                    <></>
                  )}
                </Typography>
              </ListItemButton>
            ))}
          </Stack>
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
};
