import { Box, Typography } from "@mui/material";
import { CustomRemovableList } from "./CustomRemovableList";
import { CustomSelect } from "./CustomSelect";
import { CustomSwitch } from "./CustomSwitch";
import { CustomTextField } from "./CustomTextField";

import type { Saves, Settings } from "~settings";

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
      <Box display="flex" flexDirection="column" gap={1} p={1}>
        <CustomSwitch
          label="メニュー横ウィジェット 時間割表示"
          caption={`サイドメニュー展開時に、右のスペースに簡易的な時間割を表示します。
                      この時間割はLMS以外の画面でも展開できるため、科目ページに直接アクセスできます。`}
          id="useSubTimeTable"
          value={saves.settings.useSubTimeTable}
          onChange={(_e, checked) => setSettings("useSubTimeTable", checked)}
        />
        <CustomSwitch
          label="メニュー横ウィジェット 課題表示"
          caption={`サイドメニュー展開時に、右のスペースに課題一覧を表示します。
                      表示される課題一覧は約15分ごとに更新されます。`}
          id="useTaskList"
          value={saves.settings.useTaskList}
          onChange={(_e, checked) => setSettings("useTaskList", checked)}
        />
        <CustomSwitch
          label="メニュー横ウィジェット メモ表示"
          caption={`サイドメニュー展開時に、右のスペースに自由に追加できるメモ帳を表示します。
                      通常記述のほか、マークダウンに対応しています。`}
          id="useUserMemo"
          value={saves.settings.useUserMemo}
          onChange={(_e, checked) => setSettings("useUserMemo", checked)}
        />
        <CustomSwitch
          label="メニュー横ウィジェット 時間割 教室表示"
          caption={`メニュー横ウィジェットの時間割に、常に各科目の教室情報を表示します。
                        なお、日別表示の際はこの項目にかかわらず教室情報が表示されます。`}
          id="displayClassroom"
          value={saves.settings.displayClassroom}
          onChange={(_e, checked) => setSettings("displayClassroom", checked)}
        />
        <CustomSwitch
          label="メニュー横ウィジェット 時間割 授業時間表示"
          caption={`メニュー横ウィジェットの時間割に、各時限の開始及び終了時刻を表示します。
                        なお、日別表示の際はこの項目にかかわらず時限情報が表示されます。`}
          id="displayTime"
          value={saves.settings.displayTime}
          onChange={(_e, checked) => setSettings("displayTime", checked)}
        />
        <CustomSwitch
          label="メニュー横ウィジェット 時間割 今日の日付表示"
          caption={`メニュー横ウィジェットの時間割の上部に、今日の日付を表示します。`}
          id="displayTodayDate"
          value={saves.settings.displayTodayDate}
          onChange={(_e, checked) => setSettings("displayTodayDate", checked)}
        />
        <CustomSwitch
          label="課題一覧 残り時間で強調表示"
          caption={`メニュー横ウィジェットの課題一覧で、提出期限に近いものを目立たせます。`}
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
        <CustomSwitch
          label="時間割 現在の授業を目立たせる"
          caption={`LMSページおよびメニュー横ウィジェットの時間割で、現在の授業時間を目立たせます。`}
          id="highlightToday"
          value={saves.settings.highlightToday}
          onChange={(_e, checked) => setSettings("highlightToday", checked)}
        />
        <CustomTextField
          label="課題一覧表示件数"
          type="number"
          caption="メニュー横ウィジェットの課題一覧で、1ページ内に表示する課題の最大件数を設定します。 課題の数がこれを超えた場合であっても、ページネーションにより全ての課題を確認できます。"
          id="taskListRowsPerPage"
          value={saves.settings.taskListRowsPerPage.toString()}
          onChange={(e) => setSettings("taskListRowsPerPage", parseInt(e.target.value, 10))}
        />
        <CustomRemovableList
          label="サイドメニュー リンク集"
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
  );
};
