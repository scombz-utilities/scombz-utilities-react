import { Box, IconButton, Typography, ButtonGroup, Collapse, Button } from "@mui/material";
import { deepOrange, indigo } from "@mui/material/colors";
import { lastDayOfMonth, format } from "date-fns";
import ICAL from "ical";
import { useState, useEffect, useMemo } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import type { CalEvent } from "../types/calender";
import { holidays } from "~constants";
import { defaultSaves, type Saves } from "~settings";

const days =
  chrome.i18n.getUILanguage() === "ja"
    ? ["日", "月", "火", "水", "木", "金", "土"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayProps = {
  isToday?: boolean;
  isSunday?: boolean;
  isSaturday?: boolean;
  events?: CalEvent[];
  date?: number;
  onClick?: (date: number) => void;
  isSelected?: boolean;
  holiday?: undefined | string;
};
const Day = (props: DayProps) => {
  const { isToday, isSunday, isSaturday, events, date, onClick, isSelected, holiday } = props;
  return (
    <Box
      bgcolor={isToday ? "#f2c973" : isSelected ? "#dfdfdf" : "#fff"}
      p={0.2}
      sx={{
        cursor: date ? "pointer" : "default",
        opacity: date ? 1 : 0,
        position: "relative",
        "&:hover": { bgcolor: isToday || isSelected ? undefined : "#f2f2f2" },
      }}
      onClick={() => onClick?.(date)}
    >
      {holiday && !holiday.includes("振替休日") && (
        <Typography
          variant="body2"
          fontSize="9px"
          color={deepOrange[700]}
          sx={{ position: "absolute", top: 6, right: 0, width: "calc(100% - 22px)", lineHeight: "9px" }}
        >
          {holiday}
        </Typography>
      )}
      <Typography color={isSunday || holiday ? deepOrange[700] : isSaturday ? indigo[700] : undefined}>
        {date}
      </Typography>
      <Box display="flex" flexDirection="column" gap={0.2}>
        {events
          ?.map((d) => d.summary.replace(/【レポート】/g, ""))
          ?.map((d) => (
            <Typography
              variant="caption"
              fontSize="10px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="wrap"
              display="block"
              lineHeight="11px"
              maxHeight="22px"
            >
              {d}
            </Typography>
          ))}
      </Box>
    </Box>
  );
};

type MyCalenderProps = {
  events: CalEvent[];
};
const MyCalender = (props: MyCalenderProps) => {
  const { events } = props;
  const today = useMemo(() => new Date(), []);
  const [startDay, setStartDay] = useState(new Date(today.getFullYear(), today.getMonth(), 1).getDay());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [targetDay, setTargetDay] = useState<Date>(today);

  const onMonthChange = (diff: number) => {
    if (month === 0 && diff === -1) {
      setYear(year - 1);
      setMonth(11);
      return;
    }
    if (month === 11 && diff === 1) {
      setYear(year + 1);
      setMonth(0);
      return;
    }
    setMonth((prev) => prev + diff);
  };

  useEffect(() => {
    const newDate = new Date(year, month);
    setStartDay(newDate.getDay());
  }, [year, month]);

  const onClick = (date: number) => {
    setTargetDay(new Date(year, month, date));
  };

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" px={1}>
        <Typography variant="h6" fontSize="16px">
          {format(new Date(year, month, 5), chrome.i18n.getMessage("calendarFormatMonth"))}
        </Typography>
        <ButtonGroup>
          <Button variant="text" size="small" color="primary" onClick={() => onMonthChange(-1)}>
            {chrome.i18n.getMessage("calendarPrevMonth")}
          </Button>
          <Button variant="text" size="small" color="primary" onClick={() => onMonthChange(1)}>
            {chrome.i18n.getMessage("calendarNextMonth")}
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 14%)"
        gap={0.2}
        px={0.5}
        py={0.8}
        borderRadius={1}
        maxWidth="100%"
        sx={{
          backgroundColor: "#fff6",
          justifyContent: "center",
        }}
      >
        {/* Head */}
        {Array.from({ length: 7 }, (_, i) => (
          <Box key={i} p={0.5} bgcolor="#eee">
            <Typography>{days[i]}</Typography>
          </Box>
        ))}
        {Array.from({ length: startDay }, (_, i) => (
          <Day key={i} />
        ))}
        {/* Body */}
        {Array.from({ length: lastDayOfMonth(new Date(year, month)).getDate() }, (_, i) => {
          const thisDate = new Date(year, month, i + 1);
          const formatThisDate = format(thisDate, "yyyy-MM-dd");
          return (
            <Day
              key={i}
              date={i + 1}
              events={events.filter((d) => format(d.startDate, "yyyy-MM-dd") === formatThisDate)}
              isToday={today.getDate() === i + 1}
              onClick={onClick}
              isSunday={thisDate.getDay() === 0}
              isSaturday={thisDate.getDay() === 6}
              holiday={holidays.find((d) => d.start === formatThisDate)?.summary}
              isSelected={
                targetDay.getDate() === i + 1 && targetDay.getMonth() === month && targetDay.getFullYear() === year
              }
            />
          );
        })}
      </Box>
      <Box px={1} py={0.5}>
        <Typography fontSize="14px">{format(targetDay, chrome.i18n.getMessage("calendarFormatDay"))}</Typography>
        <Box display="flex" flexDirection="column" gap={0.5}>
          {events
            .filter((d) => format(d.startDate, "yyyy-MM-dd") === format(targetDay, "yyyy-MM-dd"))
            .map((d) => (
              <Box key={d.uid} bgcolor="#eee" p={0.5} display="flex" flexDirection="column">
                <Typography variant="body2">{d.summary}</Typography>
                <Typography variant="body2">{d.description.split("教員名:")[0]}</Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export const Calender = () => {
  const [isCalenderOpen, setIsCalenderOpen] = useState(true);
  const [calenderEvents, setCalenderEvents] = useState<CalEvent[]>([]);
  const toggleOpen = () => setIsCalenderOpen(!isCalenderOpen);

  useEffect(() => {
    const fetching = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      if (currentData.scombzData.lastCalendarFetchUnixTime + 3600000 * 24 > new Date().getTime()) {
        setCalenderEvents(
          currentData.scombzData.scombzCalendar.map((d) => {
            return { ...d, startDate: new Date(d.start), endDate: new Date(d.end) };
          }),
        );
        return;
      }
      try {
        const res = await fetch("https://scombz.shibaura-it.ac.jp/portal/calendar/ics/download");
        const data = await res.text();
        const parsed = ICAL.parseICS(data) as ICAL.Component[];
        const newCalender: CalEvent[] = [];
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        const dateNum = date.getTime();
        // console.log(parsed);
        Object.values(parsed).forEach((v) => {
          const event: CalEvent = {
            description: v?.description,
            start: v?.start ? new Date(v.start).getTime() : null,
            end: v?.end ? new Date(v.end).getTime() : null,
            summary: v?.summary,
            uid: v?.uid,
          };
          if (!event.start || event.start < dateNum) return;
          newCalender.push(event);
        });
        setCalenderEvents(newCalender.map((d) => ({ ...d, startDate: new Date(d.start), endDate: new Date(d.end) })));
        chrome.storage.local.set({
          scombzData: {
            scombzCalendar: newCalender,
            lastCalendarFetchUnixTime: new Date().getTime(),
          },
        });
      } catch (e) {
        console.log("ERROR ON FETCHING", e);
      }
    };
    fetching();
  }, []);

  return (
    <Box
      width="calc(100% - 16px)"
      maxWidth="1200px"
      m="0 auto"
      onClick={(e) => e.stopPropagation()}
      sx={{
        backgroundColor: "#fff9",
        backdropFilter: "blur(6px)",
        padding: 1,
        borderRadius: 1,
      }}
    >
      <Box position="relative">
        <Typography variant="h6" sx={{ px: 0.5, textAlign: "left", fontSize: "16px" }}>
          {chrome.i18n.getMessage("calendar")}
        </Typography>
        <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={toggleOpen} size="small">
            {isCalenderOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </IconButton>
        </ButtonGroup>
      </Box>
      <Collapse in={isCalenderOpen} timeout="auto">
        <MyCalender events={calenderEvents} />
      </Collapse>
    </Box>
  );
};
