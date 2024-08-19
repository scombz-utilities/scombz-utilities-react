import { differenceInMinutes } from "date-fns";

export const getRelativeTime = (date: Date, now: Date): string => {
  const diff = differenceInMinutes(date, now);
  if (diff < 180)
    return `${chrome.i18n.getMessage("taskListAbout")}${diff}${chrome.i18n.getMessage("taskListMinsLeft")}`;
  if (diff < 1440)
    return `${chrome.i18n.getMessage("taskListAbout")}${Math.floor(diff / 60)}${chrome.i18n.getMessage("taskListHoursLeft")}`;
  return `${chrome.i18n.getMessage("taskListAbout")}${Math.floor(diff / 1440)}${chrome.i18n.getMessage("taskListDaysLeft")}`;
};
