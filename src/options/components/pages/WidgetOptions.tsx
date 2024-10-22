import { Box, Typography, IconButton, ButtonGroup, Button, Paper } from "@mui/material";
import { useMemo } from "react";
import { MdArrowDownward, MdArrowUpward, MdDelete } from "react-icons/md";
import { OptionGroup } from "../blocks/OptionGroup";
import { CustomContainerParent } from "~/options/components/blocks/CustomContainerParent";
import { CustomRemovableList } from "~/options/components/blocks/CustomRemovableList";
import { CustomSelect } from "~/options/components/blocks/CustomSelect";
import { CustomSwitch } from "~/options/components/blocks/CustomSwitch";
import { CustomTextField } from "~/options/components/blocks/CustomTextField";

import type { Widget } from "~contents/types/widget";
import type { Saves, Settings } from "~settings";

const widgets: Widget[] = ["Calendar", "UserMemo", "Links", "Bus"];

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
      optionId="widgetOrder"
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
            <Typography variant="h3" fontSize="1.1rem">
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
            <Typography variant="h3" fontSize="1.1rem">
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
  const hiddenTaskList = useMemo(() => {
    const mergedTaskList = [
      ...saves.scombzData.tasklist,
      ...saves.scombzData.surveyList,
      ...saves.scombzData.originalTasklist,
    ];
    const converted = saves.settings.hiddenTaskIdList.map((id) => mergedTaskList.find((task) => task.id === id) ?? id);
    return converted.map((task) => (typeof task === "string" ? task : `(${task.course})${task.title}`));
  }, [
    saves.scombzData.tasklist,
    saves.scombzData.surveyList,
    saves.scombzData.originalTasklist,
    saves.settings.hiddenTaskIdList,
  ]);

  return (
    <Box>
      <h2>{chrome.i18n.getMessage("widgetOptions")}</h2>
      <p>ScombZでサイドメニューを開いた時に右側に表示されるウィジェットの設定を行います。</p>
      <p>
        基本ウィジェットである「時間割LMS」と「課題一覧」に加え、「カレンダー」「メモ」「リンク集」「学バス時刻表」の4つのカスタムウィジェットを追加できます。
        カスタムウィジェットは表示の有無や順番を自由に設定できます。
      </p>
      <OptionGroup i18nTitle="ウィジェット配置">
        <CustomSelect
          i18nLabel="水平表示位置"
          i18nCaption="画面幅が広い場合に、ウィジェットを左寄せ・中央寄せ・右寄せのいずれにするかを選択します。"
          optionId="widgetPosition"
          value={saves.settings.widgetPosition}
          options={[
            { value: "left", label: "左寄せ" },
            { value: "center", label: "中央寄せ" },
            { value: "right", label: "右寄せ" },
          ]}
          onChange={(e, _) => setSettings("widgetPosition", e.target.value)}
        />
        <CustomTextField
          i18nLabel="ウィジェット幅"
          type="number"
          i18nCaption="ウィジェットを表示できる領域のうち、どれくらいの幅(%)を割り当てるか指定します。 100%にすると、画面いっぱいに表示されるためメニューを閉じづらくなることがあります。"
          optionId="widgetWidth"
          value={saves.settings.widgetWidth.toString()}
          placeholder="100"
          unit="%"
          onSaveButtonClick={(value) => setSettings("widgetWidth", parseInt(value, 10))}
        />
        <CustomTextField
          i18nLabel="ウィジェット最大幅"
          type="number"
          i18nCaption="ウィジェットの最大幅(px)を指定します。 この値を超える幅にはなりません。"
          optionId="widgetMaxWidth"
          value={saves.settings.widgetMaxWidth.toString()}
          placeholder="1200"
          unit="px"
          onSaveButtonClick={(value) => setSettings("widgetMaxWidth", parseInt(value, 10))}
        />
        <CustomTextField
          i18nLabel="ウィジェット拡大率"
          type="number"
          i18nCaption="ウィジェットの拡大率を指定します。 100%で通常表示、150%で1.5倍表示となります。"
          optionId="widgetZoom"
          value={(saves.settings.widgetZoom * 100).toString()}
          placeholder="100"
          unit="%"
          onSaveButtonClick={(value) => setSettings("widgetZoom", parseFloat(value) / 100)}
        />
      </OptionGroup>
      <OptionGroup i18nTitle="時間割ウィジェット">
        <CustomSwitch
          i18nLabel="時間割表示"
          i18nCaption={`サイドメニュー展開時に、右のスペースに簡易的な時間割を表示します。
                      この時間割はLMS以外の画面でも展開できるため、科目ページに直接アクセスできます。`}
          optionId="useSubTimeTable"
          value={saves.settings.useSubTimeTable}
          onChange={(_e, checked) => setSettings("useSubTimeTable", checked)}
        />

        <CustomSwitch
          i18nLabel="教室情報表示"
          i18nCaption={`メニュー横ウィジェットの時間割に、常に各科目の教室情報を表示します。
                        なお、日別表示の際はこの項目にかかわらず教室情報が表示されます。`}
          optionId="displayClassroom"
          value={saves.settings.displayClassroom}
          onChange={(_e, checked) => setSettings("displayClassroom", checked)}
        />
        <CustomSwitch
          i18nLabel="授業時間表示"
          i18nCaption={`メニュー横ウィジェットの時間割に、各時限の開始及び終了時刻を表示します。
                        なお、日別表示の際はこの項目にかかわらず時限情報が表示されます。`}
          optionId="displayTime"
          value={saves.settings.displayTime}
          onChange={(_e, checked) => setSettings("displayTime", checked)}
        />
        <CustomSelect
          i18nLabel="現在の日付・時刻表示"
          i18nCaption={`メニュー横ウィジェットの時間割の上部に、今日の日付もしくは時刻を表示します。 時刻は秒単位(HH:mm:ss)で表示されます。`}
          optionId="timeTableTopDate"
          value={saves.settings.timeTableTopDate.toString()}
          options={[
            { value: "date", label: "日付" },
            { value: "time", label: "時刻（秒単位）" },
            { value: "false", label: "非表示" },
          ]}
          onChange={(e, _) => setSettings("timeTableTopDate", e.target.value === "false" ? false : e.target.value)}
        />
        <CustomSwitch
          i18nLabel="現在の授業を強調表示"
          i18nCaption={`LMSページおよびメニュー横ウィジェットの時間割で、現在の授業時間を目立たせます。`}
          optionId="highlightToday"
          value={saves.settings.highlightToday}
          onChange={(_e, checked) => setSettings("highlightToday", checked)}
        />
      </OptionGroup>
      <OptionGroup i18nTitle="課題表示ウィジェット">
        <CustomSwitch
          i18nLabel="課題表示"
          i18nCaption={`サイドメニュー展開時に、右のスペースに課題一覧を表示します。
                      表示される課題一覧は約15分ごとに更新されます。`}
          optionId="useTaskList"
          value={saves.settings.useTaskList}
          onChange={(_e, checked) => setSettings("useTaskList", checked)}
        />
        <CustomSwitch
          i18nLabel="残り時間に応じて課題を強調表示"
          i18nCaption={`メニュー横ウィジェットの課題一覧で、提出期限に近いものを色をつけて目立たせます。`}
          optionId="highlightTask"
          value={saves.settings.highlightTask}
          onChange={(_e, checked) => setSettings("highlightTask", checked)}
        />
        <CustomSelect
          i18nLabel="期限表示モード"
          i18nCaption="メニュー横ウィジェットの課題一覧で、提出期限の表示形式を選択します。"
          options={[
            { value: "relative", label: "相対表示（残り時間）" },
            { value: "absolute", label: "絶対表示（提出期限時刻）" },
          ]}
          optionId="deadlineMode"
          value={saves.settings.deadlineMode}
          onChange={(e, _) => setSettings("deadlineMode", e.target.value)}
        />
        <CustomTextField
          i18nLabel="提出期限表示フォーマット"
          i18nCaption="メニュー横ウィジェットの課題一覧で、提出期限の表示形式が絶対表示の時の表示フォーマットを変更します。 yyyy:年 MM:月 E:曜日 dd:日 HH:時 mm:分"
          optionId="deadlineFormat"
          value={saves.settings.deadlineFormat}
          placeholder="yyyy/MM/dd HH:mm"
          onSaveButtonClick={(value) => setSettings("deadlineFormat", value)}
        />
        <CustomTextField
          i18nLabel="表示件数"
          type="number"
          i18nCaption="メニュー横ウィジェットの課題一覧で、1ページ内に表示する課題の最大件数を設定します。 課題の数がこれを超えた場合であっても、ページネーションにより全ての課題を確認できます。"
          optionId="taskListRowsPerPage"
          value={saves.settings.taskListRowsPerPage.toString()}
          placeholder="5"
          unit="件"
          pattern="^[0-9]+$"
          validateMessage="整数で入力してください。"
          onSaveButtonClick={(value) => setSettings("taskListRowsPerPage", parseInt(value, 10))}
        />
        <CustomSwitch
          i18nLabel="全てのアンケートを課題として表示"
          i18nCaption="授業ごとのアンケート表示の設定の有無に関わらず、回答期限内の全てのアンケートを課題として表示します。"
          optionId="displayAllSurvey"
          value={saves.settings.displayAllSurvey}
          onChange={(_e, checked) => setSettings("displayAllSurvey", checked)}
        />
        <CustomRemovableList
          i18nLabel="授業内アンケートの課題表示"
          optionId="notifySurveySubjects"
          i18nCaption="授業内アンケートを課題として表示する科目を選択します。"
          options={saves.settings.notifySurveySubjects.map((subject) => subject.name)}
          onChange={(idx) => {
            const newSubjects = saves.settings.notifySurveySubjects.filter((_, i) => i !== idx);
            setSettings("notifySurveySubjects", newSubjects);
          }}
          reset={() => setSettings("notifySurveySubjects", [])}
        />
        <CustomRemovableList
          i18nLabel="非表示課題リスト"
          optionId="hiddenTaskIdList"
          i18nCaption="メニュー横ウィジェットの課題一覧に表示されない課題IDを入力します。 リストから削除すると、期限内のものは再度表示されるようになります。"
          options={hiddenTaskList}
          onChange={(idx) => {
            const newIds = saves.settings.hiddenTaskIdList.filter((_, i) => i !== idx);
            setSettings("hiddenTaskIdList", newIds);
          }}
          reset={() => setSettings("hiddenTaskIdList", [])}
        />
      </OptionGroup>
      <OptionGroup i18nTitle="カスタムウィジェット">
        <CustomSwitch
          i18nLabel="2カラムレイアウトを有効化"
          i18nCaption={`並び替え可能なウィジェットを2列に並べて表示します。`}
          optionId="columnCount"
          value={saves.settings.columnCount === 2}
          onChange={(_e, checked) => setSettings("columnCount", checked ? 2 : 1)}
        />
        <CustomWidgetSort saves={saves} setSettings={setSettings} />
        <CustomRemovableList
          i18nLabel="リンク集 リンク削除"
          i18nCaption="サイドメニューにリンク集を追加できます。リンク集は好きに追加可能です。"
          optionId="originalLinks"
          options={saves.settings.originalLinks.map((link) => link.title + " - " + link.url)}
          onChange={(idx) => {
            const newLinks = saves.settings.originalLinks.filter((_, i) => i !== idx);
            setSettings("originalLinks", newLinks);
          }}
          reset={() => setSettings("originalLinks", [])}
        />
      </OptionGroup>
    </Box>
  );
};
