import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { CustomRemovableList } from "./CustomRemovableList";
import { CustomSelect } from "./CustomSelect";
import { CustomSwitch } from "./CustomSwitch";
import { CustomTextField } from "./CustomTextField";
import { CustomWidgetSort } from "./WidgetOptions";

import type { Saves, Settings } from "~settings";

type Props = {
  saves: Saves;
  setSettings: (key: keyof Settings, value: unknown) => void;
};
export const RecommendedOptions = (props: Props) => {
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
      <Typography variant="h5">おすすめ設定</Typography>
      <Box display="flex" flexDirection="column" gap={1} p={1}>
        <CustomSelect
          label="学部"
          id="faculty"
          caption="学部を選択してください。学部情報は、ScombZとシラバス間の連携機能にのみ使用されます。"
          options={[
            { value: "din", label: "大学院" },
            { value: "ko1", label: "工学部" },
            { value: "sys", label: "システム理工学部" },
            { value: "dsn", label: "デザイン工学部" },
            { value: "arc", label: "建築学部" },
          ]}
          value={saves.settings.faculty}
          onChange={(e, _) => setSettings("faculty", e.target.value)}
        />
        <CustomTextField
          label="学籍番号"
          caption="ログイン時に使用する学籍番号を入力してください。"
          id="loginData.username"
          value={saves.settings.loginData.username.split("@")[0]}
          onChange={(e) => {
            const username = e.target.value.includes("@") ? e.target.value : e.target.value + "@sic";
            setSettings("loginData", { ...saves.settings.loginData, username });
          }}
        />
        <CustomTextField
          label="パスワード"
          type="password"
          caption="ログイン時に使用するパスワードを入力してください。"
          id="loginData.password"
          value={saves.settings.loginData.password}
          onChange={(_event) =>
            setSettings("loginData", { ...saves.settings.loginData, password: _event.target.value })
          }
        />
        <CustomSelect
          label="ヘッダアイコンのリンク先"
          caption="ヘッダのScombZアイコンをクリックした際のリンク先を設定します。"
          id="headLinkTo"
          options={[
            { value: "/portal/home", label: "ホーム" },
            { value: "/lms/timetable", label: "LMS" },
            { value: "lms/task", label: "課題・テスト一覧" },
          ]}
          value={saves.settings.headLinkTo}
          onChange={(e, _) => setSettings("headLinkTo", e.target.value)}
        />
        <CustomSwitch
          label="LMSページのレイアウト変更 教室表示"
          caption="LMSページで、教室情報を常に表示します。"
          id="lms.showClassroom"
          value={saves.settings.lms.showClassroom}
          onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, showClassroom: checked })}
        />
        <CustomSwitch
          label="LMSページのレイアウト変更 休日非表示"
          caption="LMSページで、授業のない日を非表示にします。 また、5限以降の授業をとっていない場合はそれらも非表示にします。"
          id="lms.hideNoClassDay"
          value={saves.settings.lms.hideNoClassDay}
          onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, hideNoClassDay: checked })}
        />
        <CustomSwitch
          label="課題ドラッグ&ドロップ提出"
          caption="課題提出画面の成果物提出欄をクリックなしで最初からドラッグ&ドロップにします。"
          id="forceDragAndDropSubmit"
          value={saves.settings.forceDragAndDropSubmit}
          onChange={(_e, checked) => setSettings("forceDragAndDropSubmit", checked)}
        />
        <CustomSwitch
          label="ファイル一括ダウンロード"
          caption="科目詳細ページ内において、配布されているすべてのpdfファイルをZIP形式に圧縮し一括でダウンロードする機能です。"
          id="downloadFileBundle"
          value={saves.settings.downloadFileBundle}
          onChange={(_e, checked) => setSettings("downloadFileBundle", checked)}
        />
        <CustomSwitch
          label="レイアウト変更 名前非表示"
          caption="名前をクリックして非表示にできるようにします。"
          id="layout.clickToHideName"
          value={saves.settings.layout.clickToHideName}
          onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, clickToHideName: checked })}
        />
        <CustomSwitch
          label="科目ページ リンク化"
          caption="科目別のページ内において、テキスト内のURLをリンク化します。"
          id="layout.linkify"
          value={saves.settings.layout.linkify}
          onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, linkify: checked })}
        />
        <CustomSwitch
          label="特殊リンクにおけるホイールクリックと右クリックの有効化"
          caption="LMSページ内の科目ボタン、科目別ページのダウンロードリンクなど、右クリックが通常できないリンクを通常のリンクと同じようにサポートします。"
          id="modifyClickableLinks"
          value={saves.settings.modifyClickableLinks}
          onChange={(_e, checked) => setSettings("modifyClickableLinks", checked)}
        />
        <CustomSwitch
          label="科目ページ マークダウンメモ帳"
          caption="科目別ページ内において、マークダウン記法に対応したメモ帳を追加します。"
          id="markdownNotePad"
          value={saves.settings.markdownNotePad}
          onChange={(_e, checked) => setSettings("markdownNotePad", checked)}
        />
        <CustomRemovableList
          label="非表示課題リスト"
          id="hiddenTaskIdList"
          caption="メニュー横ウィジェットの課題一覧に表示されない課題IDを入力します。 リストから削除すると、期限内のものは再度表示されるようになります。"
          options={hiddenTaskList}
          onChange={(idx) => {
            const newIds = saves.settings.hiddenTaskIdList.filter((_, i) => i !== idx);
            setSettings("hiddenTaskIdList", newIds);
          }}
          reset={() => setSettings("hiddenTaskIdList", [])}
        />
        <CustomWidgetSort saves={saves} setSettings={setSettings} />
        <CustomSwitch
          label="時間割 教室表示"
          caption={`メニュー横ウィジェットの時間割に、常に各科目の教室情報を表示します。
                        なお、日別表示の際はこの項目にかかわらず教室情報が表示されます。`}
          id="displayClassroom"
          value={saves.settings.displayClassroom}
          onChange={(_e, checked) => setSettings("displayClassroom", checked)}
        />
      </Box>
    </Box>
  );
};
