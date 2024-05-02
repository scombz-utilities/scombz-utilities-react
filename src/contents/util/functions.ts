import { format } from "date-fns";
import { useLayoutEffect, useState } from "react";
import { CLASS_TIMES } from "~/constants";

export const useWindowSize = (): number[] => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = (): void => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export const getTimetablePosFromTime = (
  time: Date,
): {
  day: number;
  time: number;
} => {
  const minute = Number(format(time, "HHmm"));
  const classTime = CLASS_TIMES.findIndex(
    (times) => minute >= Number(times[0].replace(":", "")) && minute < Number(times[1].replace(":", "")),
  );
  return {
    day: time.getDay(),
    time: classTime + 1,
  };
};

//現在のページの科目名を返してくれる関数
export const getCourseTitle = () => {
  const courseTitle = document
    .querySelector(".course-title-txt")
    .textContent.replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/`/g, "&#x60;");
  const courseTitleItems = /(.+)\s([0-9]{2}[A-Z]{2}[0-9]{6})\s(.+)/.exec(courseTitle);
  return courseTitleItems?.[3]; //これが科目名
};

/**
 * データをクエリパラメータにシリアライズする関数
 */
export const serializeData = (data): string => {
  const params = new URLSearchParams();
  for (const key in data) {
    params.append(key, data[key]);
  }
  return params.toString();
};

/** firefoxかどうか
 *
 */
export const isFirefox = (): boolean => {
  return navigator.userAgent.toLowerCase().includes("firefox");
};
