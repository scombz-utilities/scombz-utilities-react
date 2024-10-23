import { grey, red } from "@mui/material/colors";
import { format as formatDate, differenceInMinutes, differenceInHours } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState, useMemo, useRef } from "react";
import type { Subject } from "../types/subject";
import type { Task } from "../types/task";
import type { TimeTable as TimeTableType } from "../types/timetable";
import { defaultSaves, type Saves } from "../util/settings";
import * as style from "./firefoxWidgetStyle.module.css";
import { CLASS_TIMES } from "~/constants";
import { fetchTasks } from "~contents/tasks";

type WidgetContainerProps = {
  children: React.ReactNode;
};
const WidgetContainer = (props: WidgetContainerProps) => {
  const { children } = props;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <div className={style.widgetContainer} onClick={handleClick}>
      {children}
    </div>
  );
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

  const specialClassData = useMemo(() => timetable.filter((classData) => classData.day === -1), [timetable]);

  return (
    <>
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
                classDataArray={timetable.filter(
                  (classData) => classData.day - 1 === index && classData.time === period,
                )}
                nowDay={nowDay}
                nowClassTime={nowClassTime}
              />
            ))}
          </>
        ))}
      </div>
      {/* 曜日不定授業 */}
      {specialClassData.length > 0 && (
        <div
          className={style.timetableBody}
          style={{
            marginTop: "10px",
          }}
        >
          <p className={style.intensiveCourses}>{chrome.i18n.getMessage("timetableIntensiveCourse")}</p>
          <ClassBox classDataArray={specialClassData} nowDay={nowDay} nowClassTime={nowClassTime} />
        </div>
      )}
    </>
  );
};

const getRelativeTime = (date: Date, now: Date): string => {
  const diff = differenceInMinutes(date, now);
  if (diff < 180)
    return `${chrome.i18n.getMessage("taskListAbout")}${diff}${chrome.i18n.getMessage("taskListMinsLeft")}`;
  if (diff < 1440)
    return `${chrome.i18n.getMessage("taskListAbout")}${Math.floor(diff / 60)}${chrome.i18n.getMessage("taskListHoursLeft")}`;
  return `${chrome.i18n.getMessage("taskListAbout")}${Math.floor(diff / 1440)}${chrome.i18n.getMessage("taskListDaysLeft")}`;
};

const getTaskColor = (
  task: Task,
): {
  backgroundColor: string;
  color: string;
  fontWeight: number;
} => {
  const deadlineInHours = differenceInHours(new Date(task.deadline), new Date());
  if (deadlineInHours < 6) return { backgroundColor: red[200], color: red[900], fontWeight: 600 };
  if (deadlineInHours < 12) return { backgroundColor: red[200], color: red[900], fontWeight: 600 };
  if (deadlineInHours < 24) return { backgroundColor: red[100], color: red[900], fontWeight: 600 };
  if (deadlineInHours < 72) return { backgroundColor: "inherit", color: red[900], fontWeight: 400 };
  if (deadlineInHours < 24 * 7) return { backgroundColor: "inherit", color: "inherit", fontWeight: 400 };
  return { backgroundColor: "inherit", color: grey[500], fontWeight: 400 };
};

type TaskListProps = {
  isRelativeTime: boolean;
  tasklist: Task[];
  subjects: Subject[];
  lastUpdate: Date;
  fetchTasklistFromStorage: () => void;
};
const TaskList = (props: TaskListProps) => {
  const { isRelativeTime, subjects, tasklist, lastUpdate, fetchTasklistFromStorage } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reloadTasklist = () => {
    const fetching = async () => {
      try {
        await fetchTasks(true);
        await fetchTasklistFromStorage();
      } catch (e) {
        console.error(e);
        alert("An Error Occurred: " + e?.message ?? e);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) return;
    setIsLoading(true);

    fetching();
  };

  return (
    <div className={style.taskListContainer}>
      <h6 className={style.widgetTitle}>
        {chrome.i18n.getMessage("taskList")}
        <span className={style.lastUpdate}>
          ({chrome.i18n.getMessage("taskListLastUpdate")}: {formatDate(lastUpdate, "MM/dd hh:mm", { locale: ja })})
        </span>
      </h6>
      <div className={style.taskListGrid}>
        <div className={`${style.taskListCourse} ${style.taskListHeader}`}>
          {chrome.i18n.getMessage("taskListSubject")}
        </div>
        <div className={`${style.taskListTitle} ${style.taskListHeader}`}>
          {chrome.i18n.getMessage("taskListTaskName")}
        </div>
        <div className={`${style.taskListDeadline} ${style.taskListHeader}`}>
          {chrome.i18n.getMessage("taskListDeadline")}
        </div>
        {tasklist.length === 0 ? (
          <>
            {isLoading ? (
              <div className={style.taskListNoTask}>Loading...</div>
            ) : (
              <>
                <div className={style.taskListNoTask}>{chrome.i18n.getMessage("taskListNoTask")}</div>
                <button onClick={reloadTasklist} className={style.taskListReloadButton}>
                  {chrome.i18n.getMessage("reloadTaskList")}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {tasklist.map((task) => {
              const courseUrl = subjects.find((subject) => subject.name === task.course)?.url;
              return (
                <>
                  <div className={style.taskListCourse} style={getTaskColor(task)}>
                    <a href={task.courseURL || courseUrl || ""} className={style.taskListLink}>
                      {task.course}
                    </a>
                  </div>
                  <div className={style.taskListTitle} style={getTaskColor(task)}>
                    <a href={task.link} className={style.taskListLink}>
                      {task.title}
                    </a>
                  </div>
                  <div className={style.taskListDeadline} style={getTaskColor(task)}>
                    {isRelativeTime
                      ? getRelativeTime(task.deadlineDate, new Date())
                      : formatDate(task.deadlineDate, "yyyy/MM/dd HH:mm", { locale: ja })}
                  </div>
                </>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

type UserMemoProps = {
  addMemo: (memo: string) => void;
  memos: string[];
};
const UserMemo = (props: UserMemoProps) => {
  const { addMemo, memos } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={style.userMemoContainer}>
      <h6 className={style.widgetTitle}>{chrome.i18n.getMessage("notepad")}</h6>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const memo = inputRef.current?.value ?? "";
          if (memo.trim() === "") return;
          addMemo(memo);
          inputRef.current!.value = "";
        }}
      >
        <div className={style.userMemoBox}>
          {memos.map((memo, idx) => (
            <div key={idx} className={style.userMemoRow}>
              <div
                className={style.userMemoText}
                dangerouslySetInnerHTML={{ __html: memo.replace(/(https?:\/\/\S+)/g, "<a href='$1'>$1</a>") }}
              />
            </div>
          ))}
          <div className={style.userMemoRow}>
            <input
              type="text"
              className={style.userMemoInput}
              placeholder={chrome.i18n.getMessage("notepadAdd")}
              ref={inputRef}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const menuWidgetFirefox = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [timetable, setTimetable] = useState<TimeTableType>([]);
  const [today, setToday] = useState<string | false>(false);

  const [isRelativeTime, setIsRelativeTime] = useState<boolean>(true);
  const [tasklist, setTasklist] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const [memos, setMemos] = useState<string[]>([]);

  const fetchTasklistFromStorage = async () => {
    const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
    setTimetable(currentData.scombzData.timetable);
    setSubjects(currentData.settings.notifySurveySubjects);
    setIsRelativeTime(currentData.settings.deadlineMode === "relative");
    setLastUpdate(new Date(currentData.scombzData.lastTaskFetchUnixTime ?? 0));
    setMemos(currentData.scombzData.sideMenuMemo);

    const normalTaskList = currentData.scombzData.tasklist;

    const notifySurveySubjectsName = currentData.settings.notifySurveySubjects.map((subject) => subject.name);
    const allSurveyList = currentData.scombzData.surveyList;
    const isDisplayAllSurvey = currentData.settings.displayAllSurvey;
    const surveyList = isDisplayAllSurvey
      ? allSurveyList
      : allSurveyList.filter((task) => notifySurveySubjectsName.includes(task.course));

    const originalTasklist = currentData.scombzData.originalTasklist;

    const now = new Date();

    const combinedTaskList = [...normalTaskList, ...surveyList, ...originalTasklist]
      .map((task) => {
        return { ...task, deadlineDate: new Date(task.deadline) };
      })
      .filter((task) => task.deadlineDate >= now)
      .filter((task) => !currentData.settings.hiddenTaskIdList.includes(task.id));

    combinedTaskList.sort((x, y) => {
      const [a, b] = [x.deadlineDate, y.deadlineDate];
      return a.getTime() - b.getTime();
    });

    setTasklist(combinedTaskList);
    return;
  };

  const addMemo = (memo: string) => {
    setMemos([...memos, memo]);
    chrome.storage.local.get(defaultSaves, (data: Saves) => {
      data.scombzData.sideMenuMemo = [...data.scombzData.sideMenuMemo, memo];
      chrome.storage.local.set(data);
    });
  };

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
    fetchTasklistFromStorage();
  }, []);

  return (
    <div
      className={style.utlContainer}
      style={{ display: isMenuOpen ? "block" : "none" }}
      onClick={() => document.getElementById("sidemenuClose")?.click()}
    >
      <WidgetContainer>
        {today && (
          <h6 className={style.widgetTitle} style={{ textAlign: "center" }}>
            {today}
          </h6>
        )}
        <TimeTable timetable={timetable} nowDay={null} nowClassTime={0} />
      </WidgetContainer>
      <WidgetContainer>
        <TaskList {...{ isRelativeTime, tasklist, subjects, lastUpdate, fetchTasklistFromStorage }} />
      </WidgetContainer>
      <WidgetContainer>
        <UserMemo addMemo={addMemo} memos={memos} />
      </WidgetContainer>
    </div>
  );
};

export default menuWidgetFirefox;
