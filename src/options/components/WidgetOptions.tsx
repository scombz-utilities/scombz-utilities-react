import { Box, Typography, IconButton, ButtonGroup, Button, Paper } from "@mui/material";
import { MdArrowDownward, MdArrowUpward, MdDelete } from "react-icons/md";
import { CustomContainerParent } from "./CustomContainerParent";
import { CustomRemovableList } from "./CustomRemovableList";
import { CustomSelect } from "./CustomSelect";
import { CustomSwitch } from "./CustomSwitch";
import { CustomTextField } from "./CustomTextField";

import type { Widget } from "~contents/types/widget";
import type { Saves, Settings } from "~settings";

const widgets: Widget[] = ["Calender", "UserMemo", "Links", "Bus"];

type UsingWidgetProps = {
  name: Widget;
  displayName: string;
  deleteWidget: (name: Widget) => void;
  moveUp: (name: Widget) => void;
  moveDown: (name: Widget) => void;
};
const UsingWidget = (props: UsingWidgetProps) => {
  const { name, displayName, deleteWidget, moveUp, moveDown } = props;
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        border: "1px solid #ccc",
        p: 0.5,
        borderRadius: 1,
        backgroundColor: "#fff",
        height: "45px",
      }}
    >
      <ButtonGroup orientation="vertical">
        <Button variant="outlined" size="small" onClick={() => moveUp(name)}>
          <MdArrowUpward />
        </Button>
        <Button variant="outlined" size="small" onClick={() => moveDown(name)}>
          <MdArrowDownward />
        </Button>
      </ButtonGroup>
      <Typography>{displayName}</Typography>
      <IconButton size="small" color="error" sx={{ marginLeft: "auto" }} onClick={() => deleteWidget(name)}>
        <MdDelete />
      </IconButton>
    </Box>
  );
};

type UnUsingWidgetProps = {
  name: Widget;
  displayName: string;
  addWidget: (name: Widget) => void;
};
const UnUsingWidget = (props: UnUsingWidgetProps) => {
  const { name, displayName, addWidget } = props;
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        border: "1px solid #ccc",
        py: 0.5,
        px: 2,
        borderRadius: 1,
        backgroundColor: "#fff",
        height: "45px",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#eee",
        },
      }}
      onClick={() => addWidget(name)}
    >
      <Typography>{displayName}</Typography>
    </Box>
  );
};

type CustomWidgetSortProps = {
  saves: Saves;
  setSettings: (key: keyof Settings, value: unknown) => void;
};
export const CustomWidgetSort = (props: CustomWidgetSortProps) => {
  const { saves, setSettings } = props;
  return (
    <CustomContainerParent
      label={chrome.i18n.getMessage("optionTitleWidgetOrder")}
      id="widgetOrder"
      caption={chrome.i18n.getMessage("optionDescriptionWidgetOrder")}
    >
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Paper
          elevation={5}
          sx={{
            backgroundColor: "#eee",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              borderBottom: "1px solid #ccc",
              width: "300px",
              p: 0.8,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" fontSize="1.1rem">
              {chrome.i18n.getMessage("optionWidgetOrderEnabled")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, py: 1, px: 0.5 }}>
            {saves.settings.widgetOrder.map((name) => (
              <UsingWidget
                key={name}
                name={name}
                displayName={name}
                deleteWidget={(name) => {
                  const newOrder = saves.settings.widgetOrder.filter((n) => n !== name);
                  setSettings("widgetOrder", newOrder);
                }}
                moveUp={(name) => {
                  const idx = saves.settings.widgetOrder.indexOf(name);
                  const newOrder = saves.settings.widgetOrder.filter((n) => n !== name);
                  newOrder.splice(idx - 1, 0, name);
                  setSettings("widgetOrder", newOrder);
                }}
                moveDown={(name) => {
                  const idx = saves.settings.widgetOrder.indexOf(name);
                  const newOrder = saves.settings.widgetOrder.filter((n) => n !== name);
                  newOrder.splice(idx + 1, 0, name);
                  setSettings("widgetOrder", newOrder);
                }}
              />
            ))}
          </Box>
        </Paper>
        <Paper
          elevation={5}
          sx={{
            backgroundColor: "#eee",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              borderBottom: "1px solid #ccc",
              width: "300px",
              p: 0.8,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" fontSize="1.1rem">
              {chrome.i18n.getMessage("optionWidgetOrderDisabled")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              py: 1,
              px: 0.5,
            }}
          >
            {widgets
              .filter((name) => !saves.settings.widgetOrder.includes(name))
              .map((name) => (
                <UnUsingWidget
                  key={name}
                  name={name}
                  displayName={name}
                  addWidget={(name) => {
                    const newOrder = [...saves.settings.widgetOrder, name];
                    setSettings("widgetOrder", newOrder);
                  }}
                />
              ))}
          </Box>
        </Paper>
      </Box>
    </CustomContainerParent>
  );
};

type Props = {
  saves: Saves;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: (key: keyof Settings, value: any) => void;
};
export const WidgetOptions = (props: Props) => {
  const { saves, setSettings } = props;

  return (
    <Box>
      <Typography variant="h5">ウィジェット設定</Typography>
      <Box p={1}>
        <Typography variant="body2" sx={{ color: "#666" }}>
          ScombZでサイドメニューを開いた時に右側に表示されるウィジェットの設定を行います。
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          基本ウィジェットである「時間割LMS」と「課題一覧」に加え、「カレンダー」「メモ」「リンク集」「学バス時刻表」の4つのカスタムウィジェットを追加できます。
          カスタムウィジェットは表示の有無や順番を自由に設定できます。
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1} p={1}>
        <Box mb={8}>
          <Typography variant="h6">ウィジェット基本設定</Typography>
          <CustomSwitch
            label="時間割表示"
            caption={`サイドメニュー展開時に、右のスペースに簡易的な時間割を表示します。
                      この時間割はLMS以外の画面でも展開できるため、科目ページに直接アクセスできます。`}
            id="useSubTimeTable"
            value={saves.settings.useSubTimeTable}
            onChange={(_e, checked) => setSettings("useSubTimeTable", checked)}
          />
          <CustomSwitch
            label="課題表示"
            caption={`サイドメニュー展開時に、右のスペースに課題一覧を表示します。
                      表示される課題一覧は約15分ごとに更新されます。`}
            id="useTaskList"
            value={saves.settings.useTaskList}
            onChange={(_e, checked) => setSettings("useTaskList", checked)}
          />
          <CustomSwitch
            label="2カラムレイアウトを有効化"
            caption={`並び替え可能なウィジェットを2列に並べて表示します。`}
            id="columnCount"
            value={saves.settings.columnCount === 2}
            onChange={(_e, checked) => setSettings("columnCount", checked ? 2 : 1)}
          />
          <CustomWidgetSort saves={saves} setSettings={setSettings} />
        </Box>
        <Box my={1}>
          <Typography variant="h6">ウィジェット詳細設定</Typography>
          <CustomSwitch
            label="時間割 教室表示"
            caption={`メニュー横ウィジェットの時間割に、常に各科目の教室情報を表示します。
                        なお、日別表示の際はこの項目にかかわらず教室情報が表示されます。`}
            id="displayClassroom"
            value={saves.settings.displayClassroom}
            onChange={(_e, checked) => setSettings("displayClassroom", checked)}
          />
          <CustomSwitch
            label="時間割 授業時間表示"
            caption={`メニュー横ウィジェットの時間割に、各時限の開始及び終了時刻を表示します。
                        なお、日別表示の際はこの項目にかかわらず時限情報が表示されます。`}
            id="displayTime"
            value={saves.settings.displayTime}
            onChange={(_e, checked) => setSettings("displayTime", checked)}
          />
          <CustomSelect
            label="時間割 今日の日付・時刻表示"
            caption={`メニュー横ウィジェットの時間割の上部に、今日の日付もしくは時刻を表示します。 時刻は秒単位(HH:mm:ss)で表示されます。`}
            id="timeTableTopDate"
            value={saves.settings.timeTableTopDate.toString()}
            options={[
              { value: "date", label: "日付" },
              { value: "time", label: "時刻（秒単位）" },
              { value: "false", label: "非表示" },
            ]}
            onChange={(e, _) => setSettings("timeTableTopDate", e.target.value === "false" ? false : e.target.value)}
          />
          <CustomSwitch
            label="時間割 現在の授業を目立たせる"
            caption={`LMSページおよびメニュー横ウィジェットの時間割で、現在の授業時間を目立たせます。`}
            id="highlightToday"
            value={saves.settings.highlightToday}
            onChange={(_e, checked) => setSettings("highlightToday", checked)}
          />

          <CustomSwitch
            label="課題一覧 残り時間で強調表示"
            caption={`メニュー横ウィジェットの課題一覧で、提出期限に近いものを色をつけて目立たせます。`}
            id="highlightTask"
            value={saves.settings.highlightTask}
            onChange={(_e, checked) => setSettings("highlightTask", checked)}
          />
          <CustomSelect
            label="課題一覧 期限表示モード"
            caption="メニュー横ウィジェットの課題一覧で、提出期限の表示形式を選択します。"
            options={[
              { value: "relative", label: "相対表示（残り時間）" },
              { value: "absolute", label: "絶対表示（提出期限時刻）" },
            ]}
            id="deadlineMode"
            value={saves.settings.deadlineMode}
            onChange={(e, _) => setSettings("deadlineMode", e.target.value)}
          />
          <CustomTextField
            label="課題一覧 提出期限表示フォーマット"
            caption="メニュー横ウィジェットの課題一覧で、提出期限の表示形式が絶対表示の時の表示フォーマットを変更します。 yyyy:年 MM:月 E:曜日 dd:日 HH:時 mm:分"
            id="deadlineFormat"
            value={saves.settings.deadlineFormat}
            onChange={(e) => setSettings("deadlineFormat", e.target.value)}
          />
          <CustomTextField
            label="課題一覧 表示件数"
            type="number"
            caption="メニュー横ウィジェットの課題一覧で、1ページ内に表示する課題の最大件数を設定します。 課題の数がこれを超えた場合であっても、ページネーションにより全ての課題を確認できます。"
            id="taskListRowsPerPage"
            value={saves.settings.taskListRowsPerPage.toString()}
            onChange={(e) => setSettings("taskListRowsPerPage", parseInt(e.target.value, 10))}
          />
          <CustomRemovableList
            label="リンク集 リンク削除"
            caption="サイドメニューにリンク集を追加できます。リンク集は好きに追加可能です。"
            id="originalLinks"
            options={saves.settings.originalLinks.map((link) => link.title + " - " + link.url)}
            onChange={(idx) => {
              const newLinks = saves.settings.originalLinks.filter((_, i) => i !== idx);
              setSettings("originalLinks", newLinks);
            }}
            reset={() => setSettings("originalLinks", [])}
          />
        </Box>
      </Box>
    </Box>
  );
};
