import { LoadingButton } from "@mui/lab";
import { Button, Box, Typography, Grid, Paper, IconButton, ButtonGroup, Card, TextField, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";
import { Modal } from "./Modal";
import { CLASS_TIMES } from "~constants";
import type { TimeTable, TimeTableData } from "~contents/types/timetable";
import { fetchLMS } from "~contents/util/getLMS";
import { type Saves, defaultSaves } from "~settings";

type AddCourseModalProps = {
  isOpen: boolean;
  onSubmit: (newCourse: TimeTableData) => void;
  close: () => void;
  selectedDay: number;
  selectedPeriod: number;
};
const AddCourseModal = (props: AddCourseModalProps) => {
  const { selectedDay, selectedPeriod, isOpen, close, onSubmit } = props;
  const weekdays =
    chrome.i18n.getUILanguage() === "ja"
      ? ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"]
      : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [newTimeTableData, setNewTimeTableData] = useState<TimeTableData>({
    name: "",
    url: "",
    teacher: [],
    classroom: "",
    day: 0,
    time: 0,
    id: "",
  });

  const handleSubmit = () => {
    onSubmit({ ...newTimeTableData, day: selectedDay + 1, time: selectedPeriod + 1, id: crypto.randomUUID() });
    close();
  };

  return (
    <>
      {isOpen && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1000,
            width: "100%",
            height: "100vh",
            backgroundColor: "#000a",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={close}
        >
          <Card
            sx={{
              width: 640,
              padding: 4,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              時間割を編集
            </Typography>
            <Stack direction="column" spacing={1}>
              <Typography>
                {selectedDay < 0
                  ? chrome.i18n.getMessage("timetableIntensiveCourse")
                  : `${weekdays[selectedDay]} ${selectedPeriod + 1}限`}
              </Typography>
              <TextField
                label="科目名"
                variant="outlined"
                size="small"
                fullWidth
                required
                onChange={(e) => setNewTimeTableData({ ...newTimeTableData, name: e.target.value })}
              />
              <TextField
                label="URL"
                variant="outlined"
                size="small"
                fullWidth
                required
                onChange={(e) => setNewTimeTableData({ ...newTimeTableData, url: e.target.value })}
              />
              <TextField
                label="教室"
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => setNewTimeTableData({ ...newTimeTableData, classroom: e.target.value })}
              />
              <TextField
                label="教員"
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => setNewTimeTableData({ ...newTimeTableData, teacher: [e.target.value] })}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                追加
              </Button>
            </Stack>
          </Card>
        </Box>
      )}
    </>
  );
};

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onClose: () => void;
};
export const OriginalClassModal = (props: Props) => {
  const { isOpen: open, setIsOpen, onClose = () => {} } = props;
  const [currentData, setCurrentData] = useState<Saves>(defaultSaves);
  const [hidden, setHidden] = useState<string[]>([]);
  const [originalTimeTable, setOriginalTimeTable] = useState<TimeTable>([]);

  const [isOpenAddCourseModal, setIsOpenAddCourseModal] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);

  const [isLoadingTimeTable, setIsLoadingTimeTable] = useState<boolean>(false);

  const loadLMS = () => {
    setIsLoadingTimeTable(true);
    fetchLMS().then((timetable) => {
      setIsLoadingTimeTable(false);
      setCurrentData((prev) => ({ ...prev, scombzData: { ...prev.scombzData, timetable } }));
    });
  };

  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      setCurrentData(currentData);
      setHidden(currentData.settings.editableTimeTable.hidden);
      setOriginalTimeTable(currentData.settings.editableTimeTable.original);
    });
  }, []);

  const submit = () => {
    chrome.storage.local.set(
      {
        ...currentData,
        settings: {
          ...currentData.settings,
          editableTimeTable: {
            ...currentData.settings.editableTimeTable,
            original: originalTimeTable,
            hidden,
          },
        },
      },
      () => {
        onClose();
        setIsOpen(false);
      },
    );
  };

  const onToggleHidden = (id: string) => {
    const hiddenArray = [...hidden];
    const idx = hiddenArray.findIndex((x) => x === id);
    if (idx === -1) {
      hiddenArray.push(id);
    } else {
      hiddenArray.splice(idx, 1);
    }
    setHidden(hiddenArray);
  };

  const weekdays =
    chrome.i18n.getUILanguage() === "ja"
      ? ["月", "火", "水", "木", "金", "土"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Modal title="時間割編集" isOpen={open} setIsOpen={setIsOpen} onClose={onClose} width={960}>
      <Box display="flex" flexDirection="column" px={1} mb={2} sx={{ gap: 1 }}>
        <Typography variant="caption">
          時間割表の表示を自由に編集できます。自動取得した科目は、目のアイコンをクリックすることで表示/非表示を切り替えることができます。
          また、+ボタンから手動で科目を追加することもできます。
        </Typography>
        <LoadingButton variant="outlined" onClick={loadLMS} loading={isLoadingTimeTable} size="small">
          {chrome.i18n.getMessage("loadLMS")}
        </LoadingButton>
      </Box>

      <AddCourseModal
        isOpen={isOpenAddCourseModal}
        close={() => setIsOpenAddCourseModal(false)}
        selectedDay={selectedDay}
        selectedPeriod={selectedPeriod}
        onSubmit={(newCourse) => {
          setOriginalTimeTable((prev) => [...prev, newCourse]);
        }}
      />
      <Box display="flex" flexDirection="column" px={1} sx={{ gap: 1 }}>
        <Grid container spacing={1} columns={13}>
          {/* タイトル */}
          <Grid item xs={1} />
          {weekdays.map((day) => (
            <Grid item xs={2} display="flex" alignItems="center" justifyContent="center">
              {day}
            </Grid>
          ))}
          {/* ボディ */}
          {CLASS_TIMES.map((_, period) => (
            <>
              <Grid item xs={1} display="flex" alignItems="center" justifyContent="center">
                <Typography variant="caption">
                  {period + 1}
                  {chrome.i18n.getMessage("timetablePeriodSubscription")}
                </Typography>
              </Grid>
              {weekdays.map((__, day) => (
                <Grid item xs={2} display="flex" flexDirection="column" alignItems="stretch">
                  <Paper sx={{ p: 0.5, flexGrow: 1 }}>
                    {/* 自動取得された時間割 */}
                    {currentData.scombzData.timetable
                      .filter((d) => d.time === period + 1 && d.day - 1 === day)
                      ?.map((d) => {
                        const isHidden = hidden.some((x) => x === d.id ?? d.name) || false;
                        return (
                          <Paper
                            sx={{ p: 0.5, my: 0.5, textAlign: "center" }}
                            variant="outlined"
                            key={d.id ?? d.name + d.time}
                          >
                            <Typography
                              variant="caption"
                              fontWeight="bold"
                              sx={{ opacity: isHidden ? 0.6 : 1, textDecoration: isHidden ? "line-through" : "none" }}
                            >
                              {d.name}
                            </Typography>
                            <ButtonGroup size="small">
                              {isHidden ? (
                                <IconButton size="small" onClick={() => onToggleHidden(d.id ?? d.name)}>
                                  <MdVisibilityOff />
                                </IconButton>
                              ) : (
                                <IconButton size="small" onClick={() => onToggleHidden(d.id ?? d.name)}>
                                  <MdVisibility />
                                </IconButton>
                              )}
                            </ButtonGroup>
                          </Paper>
                        );
                      })}
                    {/* 手動追加した時間割 */}
                    {originalTimeTable
                      .filter((d) => d.time === period + 1 && d.day - 1 === day)
                      ?.map((d) => (
                        <Paper sx={{ p: 0.5, my: 0.5, textAlign: "center" }} variant="outlined">
                          <Typography variant="caption" fontWeight="bold">
                            {d.name}
                          </Typography>
                          <ButtonGroup size="small">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setOriginalTimeTable((prev) => prev.filter((x) => x.id !== d.id));
                              }}
                            >
                              <MdDelete />
                            </IconButton>
                          </ButtonGroup>
                        </Paper>
                      ))}
                    {/* 追加ボタン */}
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      onClick={() => {
                        setSelectedDay(day);
                        setSelectedPeriod(period);
                        setIsOpenAddCourseModal(true);
                      }}
                    >
                      +
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </>
          ))}
          <Grid item xs={1}>
            <Typography variant="caption">{chrome.i18n.getMessage("timetableIntensiveCourse")}</Typography>
          </Grid>
          <Grid item xs={12}>
            {/* 自動取得された時間割 */}
            {currentData.scombzData.timetable
              .filter((d) => d.day === -1)
              .map((d) => {
                const isHidden = hidden.some((x) => x === d.id ?? d.name) || false;
                return (
                  <Paper sx={{ p: 0.5, my: 0.5, textAlign: "center" }} variant="outlined" key={d.id ?? d.name + d.time}>
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ opacity: isHidden ? 0.6 : 1, textDecoration: isHidden ? "line-through" : "none" }}
                    >
                      {d.name}
                    </Typography>
                    <ButtonGroup size="small">
                      {isHidden ? (
                        <IconButton size="small" onClick={() => onToggleHidden(d.id ?? d.name)}>
                          <MdVisibilityOff />
                        </IconButton>
                      ) : (
                        <IconButton size="small" onClick={() => onToggleHidden(d.id ?? d.name)}>
                          <MdVisibility />
                        </IconButton>
                      )}
                    </ButtonGroup>
                  </Paper>
                );
              })}
            {/* 手動追加した時間割 */}
            {originalTimeTable
              .filter((d) => d.day === -1)
              .map((d) => (
                <Paper sx={{ p: 0.5, my: 0.5, textAlign: "center" }} variant="outlined">
                  <Typography variant="caption" fontWeight="bold">
                    {d.name}
                  </Typography>
                  <ButtonGroup size="small">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setOriginalTimeTable((prev) => prev.filter((x) => x.id !== d.id));
                      }}
                    >
                      <MdDelete />
                    </IconButton>
                  </ButtonGroup>
                </Paper>
              ))}
            {/* 追加ボタン */}
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() => {
                setSelectedDay(-2);
                setSelectedPeriod(-2);
                setIsOpenAddCourseModal(true);
              }}
            >
              +
            </Button>
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" onClick={submit}>
          完了
        </Button>
      </Box>
    </Modal>
  );
};
