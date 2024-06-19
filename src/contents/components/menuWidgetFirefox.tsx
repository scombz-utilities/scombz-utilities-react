import { format as formatDate } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState, useMemo } from "react";
import type { TimeTable as TimeTableType } from "../types/timetable";
import { defaultSaves, type Saves } from "../util/settings";
import * as style from "./firefoxWidgetStyle.module.css";
import { CLASS_TIMES } from "~/constants";

type WidgetContainerProps = {
  children: React.ReactNode;
};
const WidgetContainer = (props: WidgetContainerProps) => {
  const { children } = props;
  return <div className={style.widgetContainer}>{children}</div>;
};

type ClassBoxProps = {
  classDataArray: TimeTableType;
  nowDay: number | null;
  nowClassTime: number;
};
const ClassBox = (props: ClassBoxProps) => {
  const { classDataArray, nowDay, nowClassTime } = props;
  return (
    <div className={style.timetableCell}>
      {classDataArray.map((classData, idx) => (
        <a
          href={`https://scombz.shibaura-it.ac.jp/lms/course?idnumber=${classData.id}`}
          style={{ textDecoration: "none", width: "100%" }}
          key={classData.id + classData.time + idx}
        >
          <div className={style.timetableButton}>
            {nowDay === classData.day && nowClassTime === classData.time && <div className={style.timetableNowClass} />}
            <span className={style.timetableClassroom}>{classData.name}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

type TimeTableProps = {
  timetable: TimeTableType;
  displayTime?: boolean;
  nowDay: number | null;
  nowClassTime: number;
};
const TimeTable = (props: TimeTableProps) => {
  const { timetable, displayTime, nowDay, nowClassTime } = props;

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
    <div
      className={style.timetableBody}
      style={{
        // 一番左のヘッダだけ50px、あとは120px
        gridTemplateColumns: `50px repeat(${weekdays.length}, 1fr)`,
      }}
    >
      <div className={style.timetablePeriod}>{chrome.i18n.getMessage("timetablePeriod")}</div>
      {weekdays.map((day) => (
        <div key={day} className={style.weekdayHeader}>
          {day}
        </div>
      ))}
      {periods.map((period) => (
        <>
          <div key={period} className={style.timetableRowHeader}>
            <span>
              {period}
              {chrome.i18n.getMessage("timetablePeriodSubscription")}
            </span>
            {displayTime &&
              CLASS_TIMES[period - 1].map((time, idx) => (
                <span key={time + idx} className={style.timetablePeriodTime}>
                  {time}
                </span>
              ))}
          </div>
          {weekdays.map((day, index) => (
            <ClassBox
              key={day + index}
              classDataArray={timetable.filter((classData) => classData.day - 1 === index && classData.time === period)}
              nowDay={nowDay}
              nowClassTime={nowClassTime}
            />
          ))}
        </>
      ))}
    </div>
  );
};

const menuWidgetFirefox = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [timetable, setTimetable] = useState<TimeTableType>([]);
  const [today, setToday] = useState<string | false>(false);

  useEffect(() => {
    const sideMenu = document.getElementById("sidemenu") as HTMLElement;
    setIsMenuOpen(!sideMenu?.classList?.contains("sidemenu-close"));
    const openMenuButton = document.getElementById("sidemenuOpen") as HTMLElement;
    const closeMenuButton = document.getElementById("sidemenuClose") as HTMLElement;
    openMenuButton?.addEventListener("click", () => {
      document.body.style.overflow = "hidden";
      setIsMenuOpen(true);
    });
    closeMenuButton?.addEventListener("click", () => {
      document.body.style.overflow = "auto";
      setIsMenuOpen(false);
    });

    if (chrome.i18n.getUILanguage() === "ja") {
      const format = "yyyy年MM月dd日(E)";
      setToday(formatDate(new Date(), format, { locale: ja }));
    } else {
      const format = "EEEE, MMMM dd, yyyy";
      setToday(formatDate(new Date(), format));
    }

    chrome.storage.local.get(defaultSaves, (items: Saves) => {
      setTimetable(items.scombzData.timetable);
    });
  }, []);

  return (
    <div
      className={style.utlContainer}
      style={{ display: isMenuOpen ? "block" : "none" }}
      onClick={() => document.getElementById("sidemenuClose")?.click()}
    >
      <WidgetContainer>
        {today && <h6 className={style.timetableTopDate}>{today}</h6>}
        <TimeTable timetable={timetable} nowDay={null} nowClassTime={0} />
      </WidgetContainer>
    </div>
  );
};

export default menuWidgetFirefox;
