import {
  Box,
  Typography,
  IconButton,
  Table,
  TableRow,
  Paper,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  Button,
} from "@mui/material";
import React, { useId } from "react";
import { MdDelete } from "react-icons/md";
import { CustomContainerParent } from "./CustomContainerParent";

type Props = {
  label: string;
  caption: string;
  optionId?: string;
  options: string[];
  onChange: (removedIndex: number) => void;
  reset: () => void;
};

export const CustomRemovableList = (props: Props) => {
  const { label, caption, optionId = "", options, onChange, reset } = props;
  const id = useId();
  return (
    <CustomContainerParent label={label} caption={caption} optionId={optionId} htmlFor={id}>
      <Box display="flex" gap={1} flexDirection="column" width={450}>
        <Box display="flex" width="100%" justifyContent="flex-end">
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => {
              confirm("全ての項目を削除しますか？") && reset();
            }}
          >
            全て削除
          </Button>
        </Box>
        <TableContainer>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>科目名</TableCell>
                  <TableCell align="right">削除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {options.map((option, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="caption">{option}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => onChange(index)}>
                        <MdDelete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TableContainer>
      </Box>
    </CustomContainerParent>
  );
};
