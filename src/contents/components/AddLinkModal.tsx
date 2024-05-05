import { TextField, Box, Button } from "@mui/material";
import { useState } from "react";
import { Modal } from "./Modal";
import type { Saves } from "~settings";
import { defaultSaves } from "~settings";

const template = [
  { title: "シラバス", url: "http://syllabus.sic.shibaura-it.ac.jp/index.html.ja" },
  { title: "S*gsot", url: "https://sgsot.sic.shibaura-it.ac.jp" },
  { title: "AMI", url: "https://ami.sic.shibaura-it.ac.jp/" },
  { title: "大宮バス時刻表", url: "http://bus.shibaura-it.ac.jp/" },
  { title: "スーパー英語", url: "https://supereigo2.sic.shibaura-it.ac.jp/sso/" },
  { title: "施設予約システム", url: "https://station.sic.shibaura-it.ac.jp/facilityreservation/schedule.html" },
  { title: "旧Scomb", url: "https://scomb.shibaura-it.ac.jp" },
];

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onClose: ({ title, url }: { title: string; url: string }) => void;
};

export const AddLinkModal = (props: Props) => {
  const { isOpen: open, setIsOpen, onClose = () => {} } = props;

  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const submit = () => {
    if (!url) {
      alert("URLを入力してください");
      return;
    }
    if (!title) {
      setTitle(url);
    }
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      currentData.settings.originalLinks.push({ title, url });
      chrome.storage.local.set(currentData);
    });
    onClose({ title, url });
    setIsOpen(false);
    setTitle("");
    setUrl("");
  };

  return (
    <Modal title="リンク追加" isOpen={open} setIsOpen={setIsOpen} onClose={onClose}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, padding: 1 }}>
        <TextField
          label="タイトル"
          size="small"
          placeholder="ScombZ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="URL"
          size="small"
          placeholder="https://scombz.shibaura-it.ac.jp"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap", justifyContent: "center" }}>
          {template.map((item) => (
            <Button
              size="small"
              key={item.title}
              variant="outlined"
              sx={{ textTransform: "none" }}
              onClick={() => {
                setTitle(item.title);
                setUrl(item.url);
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>
        <Button variant="contained" color="primary" onClick={submit}>
          追加
        </Button>
      </Box>
    </Modal>
  );
};
