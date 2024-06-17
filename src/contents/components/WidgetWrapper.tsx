import type { Widget } from "../types/widget";
import { Bus } from "./Bus";
import { Calendar } from "./Calendar";
import { Links } from "./Links";
import { TaskList } from "./TaskList";
import { TimeTable } from "./TimeTable";
import { UserMemo } from "./UserMemo";

type Props = {
  widget: Widget;
  width: number;
};

export const WidgetWrapper = (props: Props) => {
  const { widget, width } = props;
  return (
    <>
      {widget === "TimeTable" && <TimeTable width={width} />}
      {widget === "TaskList" && <TaskList width={width} />}
      {widget === "UserMemo" && <UserMemo />}
      {widget === "Links" && <Links />}
      {widget === "Calendar" && <Calendar />}
      {widget === "Bus" && <Bus />}
    </>
  );
};
