import { Box, Typography, Paper } from "@mui/material";

import React, { useState, useEffect, useMemo } from "react";
import type { TimeTable as TimeTableType } from "../types/timetable";
import { useWindowSize } from "../util/functions";
import { defaultSaves } from "../util/settings";
import type { Saves } from "../util/settings";

type ClassBoxProps = {
  classDataArray: TimeTableType;
  direction?: "column" | "row";
  border?: boolean;
  displayTeacher?: boolean;
  displayClassroom?: boolean;
  classroomWidth?: string;
};
const ClassBox = (props: ClassBoxProps) => {
  const {
    classDataArray,
    direction = "column",
    border = false,
    displayTeacher = false,
    displayClassroom = false,
    classroomWidth,
  } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        gap: "3px",
        border: border ? "1px solid #ccc" : "none",
        p: "2px",
      }}
    >
      {classDataArray.map((classData) => (
        <a
          href={`https://scombz.shibaura-it.ac.jp/lms/course?idnumber=${classData.id}`}
          style={{ textDecoration: "none", width: "100%" }}
          key={classData.id + classData.time}
        >
          <Paper
            variant="elevation"
            elevation={3}
            sx={{
              textAlign: "center",
              padding: "4px",
              paddingBottom: "3px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "36px",
              overflow: "hidden",
              gap: "3px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <Typography variant="caption" sx={{ lineHeight: 1.3, letterSpacing: 0, display: "inline-block" }}>
              {classData.name}
            </Typography>
            {displayTeacher && classData.teacher && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    lineHeight: 1,
                    letterSpacing: 0,
                    display: "block",
                    fontSize: 10,
                    whiteSpace: "nowrap",
                    color: "gray",
                  }}
                >
                  {classData.teacher.join(", ").replace(/\s+/g, " ")}
                </Typography>
              </Box>
            )}
            {displayClassroom && classData.classroom && (
              <Typography
                variant="caption"
                sx={{
                  lineHeight: 1,
                  letterSpacing: 0,
                  display: "block",
                  fontSize: 10,
                  maxWidth: classroomWidth || "calc( 15vw - 50px )",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "gray",
                }}
              >
                {classData.classroom.replace(/,/g, ", ")}
              </Typography>
            )}
          </Paper>
        </a>
      ))}
    </Box>
  );
};

type TimeTableProps = {
  timetable: TimeTableType;
  displayClassroom?: boolean;
};
const WideTimeTable = (props: TimeTableProps) => {
  const { timetable, displayClassroom } = props;

  const hasSaturday = useMemo(() => timetable?.some((day) => day.day === 6), [timetable]);
  const lastPeriod = useMemo(() => timetable?.reduce((acc, cur) => (cur.time > acc ? cur.time : acc), 0), [timetable]);

  const weekdays = useMemo(
    () => (hasSaturday ? ["月", "火", "水", "木", "金", "土"] : ["月", "火", "水", "木", "金"]),
    [hasSaturday],
  );
  const periods = useMemo(() => [1, 2, 3, 4, 5, 6, 7].slice(0, Math.max(lastPeriod, 4)), [lastPeriod]);

  return (
    <Box
      display="grid"
      width="calc(100% - 4px)"
      // 一番左のヘッダだけ50px、あとは120px
      gridTemplateColumns={`50px repeat(${weekdays.length}, 1fr)`}
      sx={{ columnGap: "2px", rowGap: "5px", backgroundColor: "#EEF7F799", padding: "2px", borderRadius: 0.5 }}
    >
      <Box textAlign="center" sx={{ background: "#eda49c" }}>
        時限
      </Box>
      {weekdays.map((day) => (
        <Box key={day} textAlign="center" sx={{ background: "#f0d6a0" }}>
          {day}
        </Box>
      ))}
      {periods.map((period) => (
        <>
          <Box key={period} display="flex" alignItems="center" justifyContent="center" sx={{ background: "#eda49c" }}>
            {period}
          </Box>
          {weekdays.map((day, index) => (
            <ClassBox
              border
              key={day + index}
              displayClassroom={displayClassroom}
              classDataArray={timetable.filter((classData) => classData.day - 1 === index && classData.time === period)}
            />
          ))}
        </>
      ))}
    </Box>
  );
};

const NarrowTimeTable = (props: TimeTableProps) => {
  const { timetable } = props;
  const dayOfToday = useMemo(() => new Date().getDay(), []);
  const filteredTimetable = useMemo(() => timetable.filter((classData) => classData.day === dayOfToday), []);
  const timeTableData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => filteredTimetable.filter((classData) => classData.time === i + 1)).filter(
        (classDataArray) => classDataArray.length > 0,
      ),
    [filteredTimetable],
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1.5}
      sx={{ backgroundColor: "#EEF7F799", borderRadius: 0.5, px: 1.5, py: 1 }}
    >
      {timeTableData.length === 0 && <Typography variant="caption">本日の授業はありません</Typography>}
      {timeTableData.map((classDataArray) => (
        <Box key={classDataArray[0].time} sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption" sx={{ textAlign: "center" }}>
            {classDataArray[0].time}限
          </Typography>
          <ClassBox
            classDataArray={classDataArray}
            direction="row"
            displayClassroom
            classroomWidth="min(280px, calc(100vw - 400px))"
          />
        </Box>
      ))}
      {}
    </Box>
  );
};

export const TimeTable = () => {
  const [timetable, setTimetable] = useState<TimeTableType>([]);
  const [displayClassroom, setDisplayClassroom] = useState<boolean>(false);

  useEffect(() => {
    const fetchTimetable = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      setTimetable(currentData.timetable);
      setDisplayClassroom(currentData.settings.displayClassroom);
    };
    fetchTimetable();
  }, []);

  const specialClassData = useMemo(() => timetable.filter((classData) => classData.day === -1), [timetable]);
  console.log(specialClassData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, height] = useWindowSize();

  if (timetable.length === 0 || width < 540) {
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
        }}
      >
        {width > 880 ? (
          <WideTimeTable timetable={timetable} displayClassroom={displayClassroom} />
        ) : (
          <NarrowTimeTable timetable={timetable} />
        )}
        {specialClassData.length > 0 && (
          <Box
            mt={1}
            display="flex"
            flexDirection="column"
            sx={{ backgroundColor: "#EEF7F799", borderRadius: 0.5, px: 1.5, py: 1 }}
          >
            <Typography variant="caption" sx={{ px: 1, textAlign: width > 880 ? "left" : "center" }}>
              その他の授業
            </Typography>
            <ClassBox classDataArray={specialClassData} direction={width > 880 ? "row" : "column"} />
          </Box>
        )}
      </Box>
    </>
  );
};
