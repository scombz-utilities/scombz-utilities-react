import { Button, Box, TextField } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { AutoComplete } from "./AutoComplete";
import { Modal } from "./Modal";
import type { RuntimeMessage } from "~background";
import type { Task } from "~contents/types/task";
import type { Saves } from "~settings";
import { defaultSaves } from "~settings";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onClose: (task?: Task) => void;
  course?: string;
  courseURL?: string;
};
export const OriginalTaskModal = (props: Props) => {
  const { isOpen: open, setIsOpen, onClose = () => {}, course = "", courseURL = "" } = props;
  const [subjects, setSubjects] = useState<string[]>([]);

  const [taskName, setTaskName] = useState<string>("");
  const [taskURL, setTaskURL] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>(course);
  const [subjectURL, setSubjectURL] = useState<string>(courseURL);
  const [taskDate, setTaskDate] = useState<string>("");
  const [taskTime, setTaskTime] = useState<string>("00:00");

  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      const subjectArray = currentData.scombzData.timetable.map((d) => d.name);
      const subjectSet = new Set(subjectArray);
      setSubjects(Array.from(subjectSet));
    });
  }, []);

  const onChangeSubject = useCallback(
    (value: string) => {
      setSubjectName(value);
      const subject = subjects.find((s) => s === value);
      if (!subject) return;
      chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
        const subjectData = currentData.scombzData.timetable.find((d) => d.name === subject);
        if (subjectData) {
          setSubjectURL("https://scombz.shibaura-it.ac.jp/lms/course?idnumber=" + subjectData.id);
        }
      });
    },
    [subjects],
  );

  const submit = () => {
    if (!taskName || !taskDate || !subjectName) {
      alert(chrome.i18n.getMessage("TaskAddAlert"));
      return;
    }
    const task: Task = {
      kind: "originalTask",
      course: subjectName,
      title: taskName,
      link: taskURL,
      deadline: taskDate + (taskTime ? " " + taskTime : ""),
      id: new Date().getTime().toString(),
      courseURL: subjectURL,
    };
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      currentData.scombzData.originalTasklist.push(task);
      chrome.storage.local.set(currentData, () => {
        setIsOpen(false);
        onClose({ ...task, deadlineDate: new Date(task.deadline) } as Task);
        alert(chrome.i18n.getMessage("TaskAdded"));
        setTimeout(() => {
          chrome.runtime.sendMessage({ action: "updateBadgeText" } as RuntimeMessage);
          setSubjectName("");
          setSubjectURL("");
          setTaskName("");
          setTaskURL("");
          setTaskDate("");
          setTaskTime("00:00");
        }, 500);
      });
    });
  };

  return (
    <Modal title={chrome.i18n.getMessage("OriginalTaskAdd")} isOpen={open} setIsOpen={setIsOpen} onClose={onClose}>
      <Box display="flex" flexDirection="column" px={1} sx={{ gap: 1 }}>
        <AutoComplete
          defaultValue={subjectName}
          options={subjects}
          onChange={onChangeSubject}
          label={chrome.i18n.getMessage("taskListSubject")}
          required
        />
        <TextField
          label={`${chrome.i18n.getMessage("taskListSubject")} URL`}
          variant="outlined"
          size="small"
          fullWidth
          value={subjectURL}
          onChange={(e) => setSubjectURL(e.target.value)}
        />
        <TextField
          label={chrome.i18n.getMessage("taskListTaskName")}
          variant="outlined"
          size="small"
          fullWidth
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <TextField
          label={chrome.i18n.getMessage("OriginalTaskURL")}
          variant="outlined"
          size="small"
          fullWidth
          value={taskURL}
          onChange={(e) => setTaskURL(e.target.value)}
        />
        <Box display="flex" gap={1} justifyContent="center">
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            style={{ width: "calc(50% - 5px)", height: 30 }}
            required
          />
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            style={{ width: "calc(50% - 5px)", height: 30 }}
          />
        </Box>
        <Button variant="contained" color="primary" onClick={submit}>
          {chrome.i18n.getMessage("AddTask")}
        </Button>
      </Box>
    </Modal>
  );
};
