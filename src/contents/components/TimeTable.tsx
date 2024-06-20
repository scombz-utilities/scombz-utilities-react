import { LoadingButton } from "@mui/lab";
import { Box, Typography, Paper, IconButton, ButtonGroup, Collapse } from "@mui/material";
import { format as formatDate } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useState, useEffect, useMemo } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineCalendarViewWeek,
  MdOutlineCalendarViewDay,
} from "react-icons/md";
import type { TimeTable as TimeTableType } from "../types/timetable";
import { getTimetablePosFromTime } from "../util/functions";
import { defaultSaves } from "../util/settings";
import type { Saves } from "../util/settings";
import { CLASS_TIMES } from "~/constants";
import { fetchLMS } from "~contents/util/getLMS";

type ClassBoxProps = {
  classDataArray: TimeTableType;
  direction?: "column" | "row";
  border?: boolean;
  displayTeacher?: boolean;
  displayClassroom?: boolean;
  classroomWidth?: string;
  nowDay: number | null;
  nowClassTime: number;
  wrapCaption?: boolean;
  isDarkMode?: boolean;
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
    wrapCaption = false,
    isDarkMode = false,
  } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        gap: "3px",
        border: border ? `1px solid ${isDarkMode ? "#777" : "#bbb"}` : "none",
        p: "2px",
      }}
    >
      {classDataArray.map((classData, idx) => (
        <a
          href={`https://scombz.shibaura-it.ac.jp/lms/course?idnumber=${classData.id}`}
          style={{ textDecoration: "none", width: "100%" }}
          key={classData.id + classData.time + idx}
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
                border: `1px solid ${isDarkMode ? "#bbd" : "#000"}`,
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
                  backgroundColor: "rgb(91, 237, 146)",
                  opacity: 0.3,
                }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                lineHeight: 1.3,
                letterSpacing: 0,
                display: "inline-block",
                color: isDarkMode ? "#ccc" : "inherit",
              }}
            >
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
                  minWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: wrapCaption ? "wrap" : "nowrap",
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
  isDarkMode?: boolean;
};
const WideTimeTable = (props: TimeTableProps) => {
  const { timetable, displayClassroom, displayTime, nowDay, nowClassTime, isDarkMode } = props;

  const hasSaturday = useMemo(() => timetable?.some((day) => day.day === 6), [timetable]);
  const lastPeriod = useMemo(() => timetable?.reduce((acc, cur) => (cur.time > acc ? cur.time : acc), 0), [timetable]);

  const weekdays = useMemo(() => {
    const WeekdayBase =
      chrome.i18n.getUILanguage() === "ja"
        ? ["月", "火", "水", "木", "金", "土"]
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return hasSaturday ? WeekdayBase : WeekdayBase.slice(0, 5);
  }, [hasSaturday]);
  const periods = useMemo(() => [1, 2, 3, 4, 5, 6, 7].slice(0, Math.max(lastPeriod, 4)), [lastPeriod]);

  return (
    <Box
      display="grid"
      width="calc(100% - 4px)"
      // 一番左のヘッダだけ50px、あとは120px
      gridTemplateColumns={`50px repeat(${weekdays.length}, 1fr)`}
      sx={{
        columnGap: "2px",
        rowGap: "5px",
        backgroundColor: isDarkMode ? "#44444499" : "#EEF7F799",
        padding: "2px",
        borderRadius: 0.5,
      }}
    >
      <Box textAlign="center" sx={{ background: isDarkMode ? "#5a3c3c" : "#eda49c" }}>
        <Typography variant="caption">{chrome.i18n.getMessage("timetablePeriod")}</Typography>
      </Box>
      {weekdays.map((day) => (
        <Box key={day} textAlign="center" sx={{ background: isDarkMode ? "#4f3d21" : "#f0d6a0" }}>
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
            sx={{ background: isDarkMode ? "#5a3c3c" : "#eda49c" }}
          >
            <Typography variant="caption">
              {period}
              {chrome.i18n.getMessage("timetablePeriodSubscription")}
            </Typography>
            {displayTime &&
              CLASS_TIMES[period - 1].map((time, idx) => (
                <Typography
                  key={time + idx}
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
              isDarkMode={isDarkMode}
            />
          ))}
        </>
      ))}
    </Box>
  );
};

const NarrowTimeTable = (props: TimeTableProps) => {
  const { timetable, nowDay, nowClassTime, isDarkMode } = props;
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
      sx={{ backgroundColor: isDarkMode ? "#44444499" : "#EEF7F799", borderRadius: 0.5, px: 1.5, py: 1 }}
    >
      {timeTableData.length === 0 && (
        <Typography variant="caption">{chrome.i18n.getMessage("timetableNoClassToday")}</Typography>
      )}
      {timeTableData.map((classDataArray, index) => (
        <Box
          key={classDataArray[0].time}
          sx={{
            display: "flex",
            flexDirection: "column",
            borderTop: index > 0 ? `1px solid ${isDarkMode ? "#555" : "#bbb"}` : "none",
          }}
        >
          <Box textAlign="center">
            <Typography variant="caption">
              {classDataArray[0].time}
              {chrome.i18n.getMessage("timetablePeriodSubscription")}
            </Typography>
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
            wrapCaption
            isDarkMode={isDarkMode}
          />
        </Box>
      ))}
    </Box>
  );
};

type Props = {
  width: number;
};
export const TimeTable = (props: Props) => {
  const { width } = props;
  const [timetable, setTimetable] = useState<TimeTableType>([]);
  const [displayClassroom, setDisplayClassroom] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<boolean>(true);
  const [highlightToday, setHighlightToday] = useState<boolean>(true);
  const [today, setToday] = useState<string | false>(false);
  const [isLoadingTimeTable, setIsLoadingTimeTable] = useState<boolean>(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [timeTableTopDate, setTimeTableTopDate] = useState<typeof defaultSaves.settings.timeTableTopDate>("date");

  const [isTimeTableOpen, setIsTimeTableOpen] = useState<boolean>(true);
  const toggleTimeTable = () => {
    setIsTimeTableOpen(!isTimeTableOpen);
  };

  const [isWideTimeTable, setIsWideTimeTable] = useState<boolean>(true);
  const toggleWideTimeTable = () => {
    setIsWideTimeTable(!isWideTimeTable);
    const save = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      currentData.settings.forceNarrowTimeTable = isWideTimeTable;
      chrome.storage.local.set(currentData);
    };
    save();
  };

  const setTimeTableTopString = (lang: string, formatType: "date" | "time") => {
    if (lang === "ja") {
      const format = formatType === "date" ? "yyyy年MM月dd日(E)" : "M月d日(E) HH:mm:ss";
      setToday(formatDate(new Date(), format, { locale: ja }));
    } else {
      const format = formatType === "date" ? "EEEE, MMMM dd, yyyy" : "EEE, MMM d h:mm:ss a";
      setToday(formatDate(new Date(), format));
    }
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      if (currentData.settings.timeTableTopDate) {
        setTimeTableTopString(chrome.i18n.getUILanguage(), currentData.settings.timeTableTopDate);
        setTimeout(() => {
          setTimeTableTopDate(currentData.settings.timeTableTopDate);
        }, 1000 - new Date().getMilliseconds());
      }
      setIsWideTimeTable(!currentData.settings.forceNarrowTimeTable);
      setTimetable(currentData.scombzData.timetable);
      setDisplayClassroom(currentData.settings.displayClassroom);
      setDisplayTime(currentData.settings.displayTime);
      setHighlightToday(currentData.settings.highlightToday);
      setIsDarkMode(currentData.settings.darkMode);
    };
    fetchTimetable();
  }, []);

  useEffect(() => {
    if (timeTableTopDate !== "time") return;
    const interval = setInterval(() => {
      setTimeTableTopString(chrome.i18n.getUILanguage(), timeTableTopDate);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeTableTopDate]);

  const loadLMS = () => {
    setIsLoadingTimeTable(true);
    fetchLMS().then((timetable) => {
      setTimetable(timetable);
      setIsLoadingTimeTable(false);
    });
  };

  const { day: nowDay, time: nowClassTime } = useMemo(
    () => (highlightToday ? getTimetablePosFromTime(new Date()) : { day: null, time: null }),
    [highlightToday],
  );

  const specialClassData = useMemo(() => timetable.filter((classData) => classData.day === -1), [timetable]);

  return (
    <>
      <Box
        width="calc(100% - 20px)"
        minHeight="30px"
        m="0 auto"
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: isDarkMode ? "#333840cc" : "#ddda",
          backdropFilter: "blur(6px)",
          padding: 1,
          borderRadius: 1,
          color: isDarkMode ? "#ccccce" : "inherit",
        }}
      >
        <Box mb={0.8} position="relative">
          {today && (
            <Typography variant="h6" sx={{ textAlign: "center", fontSize: "16px" }}>
              {today}
            </Typography>
          )}
          <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
            {width > 880 && (
              <IconButton onClick={toggleWideTimeTable} size="small">
                {isWideTimeTable ? <MdOutlineCalendarViewDay /> : <MdOutlineCalendarViewWeek />}
              </IconButton>
            )}
            <IconButton onClick={toggleTimeTable} size="small">
              {isTimeTableOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </IconButton>
          </ButtonGroup>
        </Box>

        <Collapse in={isTimeTableOpen} timeout="auto">
          {/* 時間割がない場合は取得ボタンを設置 */}
          {timetable.length === 0 ? (
            <Box sx={{ textAlign: "center" }}>
              <Box mt={1}>
                <LoadingButton variant="outlined" onClick={loadLMS} loading={isLoadingTimeTable}>
                  {chrome.i18n.getMessage("loadLMS")}
                </LoadingButton>
              </Box>
            </Box>
          ) : (
            <>
              {/* 通常時間割 */}
              {width > 880 && isWideTimeTable ? (
                <WideTimeTable
                  timetable={timetable}
                  displayClassroom={displayClassroom}
                  displayTime={displayTime && timetable.length > 0}
                  nowDay={nowDay}
                  nowClassTime={nowClassTime}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <NarrowTimeTable
                  timetable={timetable}
                  nowDay={nowDay}
                  nowClassTime={nowClassTime}
                  isDarkMode={isDarkMode}
                />
              )}
              {/* 曜日不定授業 */}
              {specialClassData.length > 0 && (
                <Box
                  mt={1}
                  display="flex"
                  flexDirection="column"
                  sx={{ backgroundColor: isDarkMode ? "#44444499" : "#EEF7F799", borderRadius: 0.5, px: 1.5, py: 1 }}
                >
                  <Typography variant="caption" sx={{ px: 1, textAlign: width > 880 ? "left" : "center" }}>
                    {chrome.i18n.getMessage("timetableIntensiveCourse")}
                  </Typography>
                  <ClassBox
                    classDataArray={specialClassData}
                    direction={width > 880 ? "row" : "column"}
                    nowDay={nowDay}
                    nowClassTime={nowClassTime}
                    isDarkMode={isDarkMode}
                  />
                </Box>
              )}
            </>
          )}
        </Collapse>
      </Box>
    </>
  );
};
