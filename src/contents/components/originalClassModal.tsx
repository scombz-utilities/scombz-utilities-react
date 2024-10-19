import { Button, Box, Typography, Grid, Paper, IconButton, ButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";
import { MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";
import { Modal } from "./Modal";
import { CLASS_TIMES } from "~constants";
import type { Task } from "~contents/types/task";
import type { TimeTable } from "~contents/types/timetable";
import { type Saves, defaultSaves } from "~settings";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onClose: (task?: Task) => void;
  isDarkMode: boolean;
};
export const OriginalClassModal = (props: Props) => {
  const { isOpen: open, setIsOpen, onClose = () => {}, isDarkMode } = props;
  const [currentData, setCurrentData] = useState<Saves>(defaultSaves);
  const [hidden, setHidden] = useState<string[]>([]);
  const [originalTimeTable, setOriginalTimeTable] = useState<TimeTable>(null);

  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      setCurrentData(currentData);
      setHidden(currentData.settings.editableTimeTable.hidden);
      setOriginalTimeTable(currentData.settings.editableTimeTable.original);
    });
  }, []);

  const submit = () => {
    chrome.storage.local.set({
      ...currentData,
      settings: {
        ...currentData.settings,
        editableTimeTable: {
          ...currentData.settings.editableTimeTable,
          originalTimeTable,
          hidden,
        },
      },
    });
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
                      .filter((d) => d.time === period && d.day - 1 === day)
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
                                  <MdVisibility />
                                </IconButton>
                              ) : (
                                <IconButton size="small" onClick={() => onToggleHidden(d.id ?? d.name)}>
                                  <MdVisibilityOff />
                                </IconButton>
                              )}
                            </ButtonGroup>
                          </Paper>
                        );
                      })}
                    {/* 手動追加した時間割 */}
                    {currentData.settings.editableTimeTable.original
                      .filter((d) => d.time === period && d.day - 1 === day)
                      ?.map((d) => (
                        <Paper sx={{ p: 0.5, my: 0.5, textAlign: "center" }} variant="outlined">
                          <Typography variant="caption" fontWeight="bold">
                            {d.name}
                          </Typography>
                          <ButtonGroup size="small">
                            <IconButton size="small">
                              <MdDelete />
                            </IconButton>
                          </ButtonGroup>
                        </Paper>
                      ))}
                    {/* 追加ボタン */}
                    <Button variant="outlined" fullWidth size="small">
                      +
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </>
          ))}
        </Grid>
        <Button variant="contained" color="primary" onClick={submit}>
          完了
        </Button>
      </Box>
    </Modal>
  );
};
