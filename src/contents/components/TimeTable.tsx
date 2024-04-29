import { Box, Typography, Paper, IconButton, ButtonGroup } from "@mui/material";
import { format as formatDate } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useState, useEffect, useMemo } from "react";
import { MdCloseFullscreen, MdOpenInFull, MdOutlineCalendarViewWeek, MdOutlineCalendarViewDay } from "react-icons/md";
import type { TimeTable as TimeTableType } from "../types/timetable";
import { useWindowSize, getTimetablePosFromTime } from "../util/functions";
import { defaultSaves } from "../util/settings";
import type { Saves } from "../util/settings";
import { CLASS_TIMES } from "~/constants";

type ClassBoxProps = {
  classDataArray: TimeTableType;
  direction?: "column" | "row";
  border?: boolean;
  displayTeacher?: boolean;
  displayClassroom?: boolean;
  classroomWidth?: string;
  nowDay: number | null;
  nowClassTime: number;
};
const ClassBox = (props: ClassBoxProps) => {
  const {
    classDataArray,
    direction = "column",
    border = false,
    displayTeacher = false,
    displayClassroom = false,
    classroomWidth,
    nowDay,
    nowClassTime,
  } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        gap: "3px",
        border: border ? "1px solid #bbb" : "none",
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "36px",
              overflow: "hidden",
              gap: "3px",
              position: "relative",
              boxSizing: "border-box",
              "&:hover": {
                opacity: 0.7,
                border: "1px solid #000",
                padding: "3px",
              },
            }}
          >
            {nowDay === classData.day && nowClassTime === classData.time && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#ff0",
                  opacity: 0.2,
                }}
              />
            )}
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
  displayTime?: boolean;
  displayClassroom?: boolean;
  nowDay: number | null;
  nowClassTime: number;
  today?: string | false;
  hideButtonGroup?: boolean;
};

const WideSelectableTimeTable = (props: TimeTableProps) => {
  const { timetable, displayClassroom, displayTime, nowDay, nowClassTime, today } = props;
  const [isTimeTableOpen, setIsTimeTableOpen] = useState<boolean>(true);
  const [isWideTimeTable, setIsWideTimeTable] = useState<boolean>(true);

  const toggleTimeTable = () => {
    setIsTimeTableOpen(!isTimeTableOpen);
  };

  const toggleWideTimeTable = () => {
    setIsWideTimeTable(!isWideTimeTable);
  };

  return (
    <Box>
      <Box mb={0.8} position="relative">
        {today && (
          <Typography variant="h6" sx={{ textAlign: "center", fontSize: "16px" }}>
            {today}
          </Typography>
        )}
        <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={toggleWideTimeTable} size="small">
            {isWideTimeTable ? <MdOutlineCalendarViewDay /> : <MdOutlineCalendarViewWeek />}
          </IconButton>
          <IconButton onClick={toggleTimeTable} size="small">
            {isTimeTableOpen ? <MdCloseFullscreen /> : <MdOpenInFull />}
          </IconButton>
        </ButtonGroup>
      </Box>
      {isTimeTableOpen && isWideTimeTable && (
        <WideTimeTable
          timetable={timetable}
          displayClassroom={displayClassroom}
          displayTime={displayTime}
          nowDay={nowDay}
          nowClassTime={nowClassTime}
        />
      )}
      {isTimeTableOpen && !isWideTimeTable && (
        <NarrowTimeTable timetable={timetable} nowDay={nowDay} nowClassTime={nowClassTime} hideButtonGroup />
      )}
    </Box>
  );
};

const WideTimeTable = (props: TimeTableProps) => {
  const { timetable, displayClassroom, displayTime, nowDay, nowClassTime } = props;

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
        <Typography variant="caption">時限</Typography>
      </Box>
      {weekdays.map((day) => (
        <Box key={day} textAlign="center" sx={{ background: "#f0d6a0" }}>
          <Typography variant="caption">{day}</Typography>
        </Box>
      ))}
      {periods.map((period) => (
        <>
          <Box
            key={period}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap={0}
            sx={{ background: "#eda49c" }}
          >
            <Typography variant="caption">{period}限</Typography>
            {displayTime &&
              CLASS_TIMES[period - 1].map((time) => (
                <Typography
                  key={time}
                  variant="caption"
                  fontSize="10px"
                  display="block"
                  sx={{ color: "gray", lineHeight: "1.2" }}
                >
                  {time}
                </Typography>
              ))}
          </Box>
          {weekdays.map((day, index) => (
            <ClassBox
              border
              key={day + index}
              displayClassroom={displayClassroom}
              classDataArray={timetable.filter((classData) => classData.day - 1 === index && classData.time === period)}
              nowDay={nowDay}
              nowClassTime={nowClassTime}
            />
          ))}
        </>
      ))}
    </Box>
  );
};

const NarrowTimeTable = (props: TimeTableProps) => {
  const { timetable, nowDay, nowClassTime, today, hideButtonGroup = false } = props;
  const dayOfToday = useMemo(() => new Date().getDay(), []);
  const filteredTimetable = useMemo(() => timetable.filter((classData) => classData.day === dayOfToday), []);
  const timeTableData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => filteredTimetable.filter((classData) => classData.time === i + 1)).filter(
        (classDataArray) => classDataArray.length > 0,
      ),
    [filteredTimetable],
  );

  const [isTimeTableOpen, setIsTimeTableOpen] = useState<boolean>(true);
  const toggleTimeTable = () => {
    setIsTimeTableOpen(!isTimeTableOpen);
  };

  return (
    <>
      {!hideButtonGroup && (
        <Box mb={0.8} position="relative">
          {today && (
            <Typography variant="h6" sx={{ textAlign: "center", fontSize: "16px" }}>
              {today}
            </Typography>
          )}
          <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
            <IconButton onClick={toggleTimeTable} size="small">
              {isTimeTableOpen ? <MdCloseFullscreen /> : <MdOpenInFull />}
            </IconButton>
          </ButtonGroup>
        </Box>
      )}
      {isTimeTableOpen && (
        <Box
          display="flex"
          flexDirection="column"
          gap={1.5}
          sx={{ backgroundColor: "#EEF7F799", borderRadius: 0.5, px: 1.5, py: 1 }}
        >
          {timeTableData.length === 0 && <Typography variant="caption">本日の授業はありません</Typography>}
          {timeTableData.map((classDataArray, index) => (
            <Box
              key={classDataArray[0].time}
              sx={{ display: "flex", flexDirection: "column", borderTop: index > 0 ? "1px solid #bbb" : "none" }}
            >
              <Box textAlign="center">
                <Typography variant="caption">{classDataArray[0].time}限</Typography>
                <Typography variant="caption" sx={{ color: "gray", ml: 1 }}>
                  ({CLASS_TIMES[classDataArray[0].time - 1].join("〜")})
                </Typography>
              </Box>
              <ClassBox
                classDataArray={classDataArray}
                direction="row"
                displayClassroom
                classroomWidth="min(280px, calc(100vw - 400px))"
                nowDay={nowDay}
                nowClassTime={nowClassTime}
              />
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export const TimeTable = () => {
  const [timetable, setTimetable] = useState<TimeTableType>([]);
  const [displayClassroom, setDisplayClassroom] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<boolean>(true);
  const [highlightToday, setHighlightToday] = useState<boolean>(true);
  const [today, setToday] = useState<string | false>(false);

  useEffect(() => {
    const fetchTimetable = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      console.log(currentData.settings);
      if (currentData.settings.displayTodayDate) {
        setToday(formatDate(new Date(), "yyyy年MM月dd日(E)", { locale: ja }));
      }
      setTimetable(currentData.scombzData.timetable);
      setDisplayClassroom(currentData.settings.displayClassroom);
      setDisplayTime(currentData.settings.displayTime);
      setHighlightToday(currentData.settings.highlightToday);
    };
    fetchTimetable();
  }, []);

  const { day: nowDay, time: nowClassTime } = useMemo(
    () => (false ? getTimetablePosFromTime(new Date()) : { day: null, time: null }),
    [highlightToday],
  );

  const specialClassData = useMemo(() => timetable.filter((classData) => classData.day === -1), [timetable]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, height] = useWindowSize();

  if (timetable.length === 0 || width < 540) {
    return <></>;
  }

  return (
    <>
      <Box
        maxWidth="1200px"
        minHeight="30px"
        m={width > 1540 ? "10px auto" : "10px"}
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: "#fff7",
          backdropFilter: "blur(6px)",
          padding: 1,
          borderRadius: 1,
        }}
      >
        {width > 880 ? (
          <WideSelectableTimeTable
            timetable={timetable}
            displayClassroom={displayClassroom}
            displayTime={displayTime}
            nowDay={nowDay}
            nowClassTime={nowClassTime}
            today={today}
          />
        ) : (
          <NarrowTimeTable timetable={timetable} nowDay={nowDay} nowClassTime={nowClassTime} today={today} />
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
            <ClassBox
              classDataArray={specialClassData}
              direction={width > 880 ? "row" : "column"}
              nowDay={nowDay}
              nowClassTime={nowClassTime}
            />
          </Box>
        )}
      </Box>
    </>
  );
};
