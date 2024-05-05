import {
  Box,
  Typography,
  ButtonGroup,
  IconButton,
  Collapse,
  Paper,
  Table,
  TableCell,
  TableRow,
  TableContainer,
  TableBody,
  InputBase,
} from "@mui/material";
import markdownit from "markdown-it";
import { useState, useEffect } from "react";
import { MdAdd, MdDelete, MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { MAX_MEMO_COUNT } from "~constants";
import type { Saves } from "~contents/util/settings";
import { defaultSaves } from "~contents/util/settings";

type UserMemoRowProps = {
  memo: string;
  onDelete: () => void;
};
const UserMemoRow = (props: UserMemoRowProps) => {
  const { memo, onDelete } = props;
  const replacedMemo = memo.replace(/(^|\s)https?:\/\/\S+(\s|$)/g, "[$&]($&)");
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        maxWidth: "100%",
      }}
    >
      <TableCell sx={{ maxWidth: "10px", overflow: "hidden", textOverflow: "ellipsis" }}>
        <div
          className="scombz-utilities-menu-widget-markdown"
          dangerouslySetInnerHTML={{ __html: markdownit().render(replacedMemo) }}
        />
      </TableCell>
      <TableCell align="right" sx={{ width: "15px", padding: 0, pr: 0.3 }}>
        <IconButton size="small" onClick={onDelete}>
          <MdDelete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

type NewUserMemoRowProps = {
  addMemo: (memo: string) => void;
};
const NewUserMemoRow = (props: NewUserMemoRowProps) => {
  const { addMemo } = props;
  const [memo, setMemo] = useState<string>("");
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        maxWidth: "100%",
      }}
    >
      <TableCell sx={{ py: 0.5, pr: 0.5, pl: 1, width: "100%" }}>
        <InputBase
          fullWidth
          size="small"
          sx={{ padding: 0, margin: 0 }}
          inputProps={{ style: { padding: "3px 8px", fontSize: "15px", height: "20px" } }}
          placeholder="メモを追加"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </TableCell>
      <TableCell sx={{ width: "15px", padding: 0, pr: 0.3 }}>
        <IconButton
          type="submit"
          size="small"
          onClick={() => {
            addMemo(memo);
            setMemo("");
          }}
          disabled={memo.trim() === ""}
        >
          <MdAdd />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

type Props = {
  width: number;
};
export const UserMemo = (props: Props) => {
  const { width } = props;

  const [isUserMemoOpen, setIsUserMemoOpen] = useState<boolean>(true);
  const [userMemo, setUserMemo] = useState<string[]>([]);

  useEffect(() => {
    const fetching = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      setUserMemo(currentData.scombzData.sideMenuMemo);
      currentData.scombzData.sideMenuMemo = userMemo;
    };
    fetching();
  }, []);

  useEffect(() => {
    const saving = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      currentData.scombzData.sideMenuMemo = userMemo.slice(0, MAX_MEMO_COUNT);
      chrome.storage.local.set(currentData);
    };
    saving();
  }, [userMemo]);

  const deleteMemo = (index: number, memo: string) => () => {
    if (window.confirm(`『${memo}』を削除しますか？`)) {
      setUserMemo(userMemo.filter((_, i) => i !== index));
    }
  };

  const toggleOpen = () => {
    setIsUserMemoOpen(!isUserMemoOpen);
  };

  if (width < 540) {
    return <></>;
  }

  return (
    <Box
      maxWidth="1200px"
      m={width > 1540 ? "0 auto" : "0"}
      onClick={(e) => e.stopPropagation()}
      sx={{
        backgroundColor: "#fff9",
        backdropFilter: "blur(6px)",
        padding: 1,
        borderRadius: 1,
      }}
    >
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `.scombz-utilities-menu-widget-markdown * {margin: 0;padding: 0;}`,
        }}
      />
      <Box position="relative">
        <Typography variant="h6" sx={{ px: 0.5, textAlign: "left", fontSize: "16px" }}>
          メモ
        </Typography>
        <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={toggleOpen} size="small">
            {isUserMemoOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </IconButton>
        </ButtonGroup>
      </Box>
      <Collapse in={isUserMemoOpen} timeout="auto">
        <Paper sx={{ mt: 0.8 }}>
          <form onSubmit={(e) => e.preventDefault()}>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {userMemo.map((memo, index) => (
                    <UserMemoRow key={index} memo={memo} onDelete={deleteMemo(index, memo)} />
                  ))}
                  <NewUserMemoRow
                    addMemo={(memo) => {
                      setUserMemo([...userMemo, memo]);
                    }}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </form>
        </Paper>
      </Collapse>
    </Box>
  );
};
