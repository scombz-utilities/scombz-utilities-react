import {
  Box,
  IconButton,
  Typography,
  ButtonGroup,
  Collapse,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Paper,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useState, useEffect } from "react";
import { LuTableProperties } from "react-icons/lu";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import type { Root, Timesheet, Calendar, List } from "../types/bus";
import type { RuntimeMessage } from "~background";
import { defaultSaves, type Saves } from "~settings";

export const Bus = () => {
  const [isBusOpen, setIsBusOpen] = useState(true);
  const [busList, setBusList] = useState<List[]>([]);
  const [displayList, setDisplayList] = useState<List[]>([]);

  const toggleOpen = () => {
    setIsBusOpen(!isBusOpen);
  };

  useEffect(() => {
    const fetchBusData = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      if (currentData.scombzData.lastBusFetchUnixTime + 3600000 * 4 > new Date().getTime()) {
        setBusList(currentData.scombzData.busList);
        return;
      }
      chrome.runtime.sendMessage(
        { action: "getJson", url: "http://bus.shibaura-it.ac.jp/db/bus_data.json" } as RuntimeMessage,
        (response: Root) => {
          const today = new Date();
          const calendarList: Calendar[] = response.calendar;
          const targetCalendar = calendarList.find((calendar) => Number(calendar.month) === today.getMonth() + 1);
          const targetCalendarId = targetCalendar.list.find((d) => Number(d.day) === today.getDate()).ts_id;

          const timeSheetList: Timesheet[] = response.timesheet;
          const targetTimeSheet = timeSheetList.find((timesheet) => timesheet.ts_id === targetCalendarId);
          const targetList = targetTimeSheet ? targetTimeSheet.list : [];
          setBusList(targetList);
          chrome.storage.local.get(defaultSaves, (data: Saves) => {
            chrome.storage.local.set({
              scombzData: {
                ...data.scombzData,
                busList: targetList,
                lastBusFetchUnixTime: new Date().getTime(),
              },
            });
          });
        },
      );
    };
    fetchBusData();
  }, []);

  useEffect(() => {
    const logic = () => {
      const nowTime = new Date();
      setDisplayList(
        busList
          .filter((d) => Number(d.time) === nowTime.getHours() || Number(d.time) === nowTime.getHours() + 1)
          .filter((d) => d.bus_right.num1 || d.bus_right.num2 || d.bus_right.memo1 || d.bus_right.memo2),
      );
    };
    logic();
    const interval = setInterval(logic, 60000);
    return () => clearInterval(interval);
  }, [busList]);

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
          学バス 大宮キャンパス発
        </Typography>
        <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton size="small" href="http://bus.shibaura-it.ac.jp/" target="_blank">
            <LuTableProperties />
          </IconButton>
          <IconButton onClick={toggleOpen} size="small">
            {isBusOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </IconButton>
        </ButtonGroup>
      </Box>
      <Collapse in={isBusOpen} timeout="auto">
        <Paper sx={{ mt: 0.8 }}>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {displayList.length === 0 && (
                  <TableRow>
                    <TableCell>本日の営業は終了しました</TableCell>
                  </TableRow>
                )}
                {displayList.length > 0 &&
                  displayList.map((d, i) => {
                    const numArray = [...d.bus_right.num1.split("."), ...d.bus_right.num2.split(".")].filter((d) => d);
                    const memo = (d.bus_right.memo1 + "\n" + d.bus_right.memo2).trim();
                    const nowMin = new Date().getMinutes();
                    return (
                      <TableRow key={d.time}>
                        <TableCell sx={{ pl: "10px", pr: "0", width: "40px" }}>
                          <Typography fontSize="14px" variant="body1" width="30px" textAlign="right">
                            {d.time}時
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ pr: "8px" }}>
                          <Box display="flex" flexWrap="wrap" gap="8px">
                            {numArray.map((min) => (
                              <Typography
                                key={min}
                                fontSize="14px"
                                variant="body1"
                                sx={{ opacity: i === 0 && Number(min) < nowMin ? 0.5 : 1 }}
                              >
                                {min}
                              </Typography>
                            ))}
                          </Box>
                          <Typography fontSize="14px" variant="body1" color={red[800]}>
                            {memo}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Collapse>
    </Box>
  );
};
