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
