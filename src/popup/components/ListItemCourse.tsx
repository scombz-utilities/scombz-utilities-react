import { Box, Divider, ListItem, ListItemButton, ListItemText, Stack, Tooltip, Typography } from "@mui/material";
import type { TimeTableData } from "~contents/types/timetable";

type ListItemCourseProps = {
  courses: TimeTableData[];
  time: number;
  noDivider?: boolean;
  isScrollBarShown?: boolean;
  intensive?: boolean;
};

const terms = ["9:00~10:40", "10:50~12:30", "13:20~15:00", "15:10~16:50", "17:00~18:40", "18:50~20:30", "20:40~22:20"];

export const ListItemCourse = (props: ListItemCourseProps) => {
  const { courses, time, noDivider, isScrollBarShown, intensive } = props;

  return (
    <>
      {intensive && (
        <Box mt={0.25}>
          <Divider />
        </Box>
      )}
      <ListItem disablePadding sx={{ alignItems: "stretch" }}>
        <ListItemButton
          disableGutters
          sx={{ alignItems: "stretch", p: 0, minHeight: 48 }}
          tabIndex={-1}
          disabled={courses.length == 0}
        >
          <Stack sx={{ width: 70, pl: 1.25 }}>
            <ListItemText
              primary={
                intensive
                  ? chrome.i18n.getMessage("popupTimetableIntensiveCourse")
                  : time + chrome.i18n.getMessage("timetablePeriodSubscription")
              }
              secondary={intensive ? "" : terms[time - 1]}
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
                  width: isScrollBarShown ? 252 : 268,
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
                <Typography noWrap={true} sx={{ textAlign: "left" }} pr={0.5}>
                  <Typography
                    component="span"
                    noWrap={true}
                    sx={{
                      fontSize: "small",
                      display: "inline-block",
                      overflow: "clip",
                      maxWidth: isScrollBarShown ? "13em" : "14em",
                    }}
                  >
                    {course.name}
                  </Typography>
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
      {!noDivider && <Divider />}
    </>
  );
};
