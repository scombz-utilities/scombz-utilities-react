import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { CustomRemovableList } from "./CustomRemovableList";
import { CustomSelect } from "./CustomSelect";
import { CustomTextField } from "./CustomTextField";
import { SLIDER_BAR_MINS } from "~constants";

import type { Saves, Settings } from "~settings";

type Props = {
  saves: Saves;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: (key: keyof Settings, value: any) => void;
  setScombzData: (key: string, value: unknown) => void;
};

export const AdvancedOptions = (props: Props) => {
  const { saves, setSettings, setScombzData } = props;
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
      <Typography variant="h5">詳細設定</Typography>
      <Stack gap={1} p={1}>
        <CustomTextField
          i18nLabel="学籍番号"
          i18nCaption="ログイン時に使用する学籍番号を入力してください。"
          optionId="loginData.username"
          value={saves.settings.loginData.username.split("@")[0]}
          onChange={(e) => {
            const username = e.target.value.includes("@") ? e.target.value : e.target.value + "@sic";
            setSettings("loginData", { ...saves.settings.loginData, username });
          }}
        />
        <CustomTextField
          i18nLabel="パスワード"
          type="password"
          i18nCaption="ログイン時に使用するパスワードを入力してください。"
          optionId="loginData.password"
          value={saves.settings.loginData.password}
          onChange={(_event) =>
            setSettings("loginData", { ...saves.settings.loginData, password: _event.target.value })
          }
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

        <CustomTextField
          i18nLabel="スライダーバーの最大値(分)"
          type="number"
          i18nCaption="レポート提出時に、作成時間を簡易入力するためのスライダーバーの最大値を設定します。"
          optionId="sliderBarMax"
          value={saves.settings.sliderBarMax.toString()}
          onChange={(e) => setSettings("sliderBarMax", parseInt(e.target.value, 10))}
        />
        <CustomSelect
          i18nLabel="提出時間の初期値(分)"
          i18nCaption="レポート提出時に、作成時間を簡易入力するためのスライダーバーの初期値を設定します。"
          optionId="timesBtnValue"
          options={SLIDER_BAR_MINS.map((min, index) => ({
            value: index.toString(),
            label: min.join("分, ") + "分",
          }))}
          value={saves.settings.timesBtnValue.toString()}
          onChange={(e, _) => setSettings("timesBtnValue", parseInt(e.target.value, 10))}
        />
        <CustomTextField
          i18nLabel="ファイル名の自動入力設定"
          i18nCaption="レポート提出時にファイル名自動入力ボタンを押した際に入力される文字列を変更します。"
          optionId="defaultInputName"
          value={saves.settings.defaultInputName}
          onChange={(e) => setSettings("defaultInputName", e.target.value)}
        />

        <CustomTextField
          i18nLabel="レイアウト変更 科目別ページ最大幅(px)"
          type="number"
          i18nCaption="科目別ページの最大幅を設定します。"
          optionId="layout.maxWidthPx.subj"
          value={saves.settings.layout.maxWidthPx.subj.toString()}
          onChange={(e) =>
            setSettings("layout", {
              ...saves.settings.layout,
              maxWidthPx: { ...saves.settings.layout.maxWidthPx, subj: parseInt(e.target.value, 10) },
            })
          }
        />
        <CustomTextField
          i18nLabel="レイアウト変更 LMSページ最大幅(px)"
          type="number"
          i18nCaption="LMSページの最大幅を設定します。"
          optionId="layout.maxWidthPx.lms"
          value={saves.settings.layout.maxWidthPx.lms.toString()}
          onChange={(e) =>
            setSettings("layout", {
              ...saves.settings.layout,
              maxWidthPx: { ...saves.settings.layout.maxWidthPx, lms: parseInt(e.target.value, 10) },
            })
          }
        />
        <CustomTextField
          i18nLabel="レイアウト変更 課題提出ページ最大幅(px)"
          type="number"
          i18nCaption="課題提出ページの最大幅を設定します。"
          optionId="layout.maxWidthPx.task"
          value={saves.settings.layout.maxWidthPx.task.toString()}
          onChange={(e) =>
            setSettings("layout", {
              ...saves.settings.layout,
              maxWidthPx: { ...saves.settings.layout.maxWidthPx, task: parseInt(e.target.value, 10) },
            })
          }
        />
        <CustomSelect
          i18nLabel="ヘッダアイコンのリンク先"
          i18nCaption="ヘッダのScombZアイコンをクリックした際のリンク先を設定します。"
          optionId="headLinkTo"
          options={[
            { value: "/portal/home", label: "ホーム" },
            { value: "/lms/timetable", label: "LMS" },
            { value: "lms/task", label: "課題・テスト一覧" },
          ]}
          value={saves.settings.headLinkTo}
          onChange={(e, _) => setSettings("headLinkTo", e.target.value)}
        />
        <CustomRemovableList
          i18nLabel="科目ページメモ"
          optionId="coursePageMemo"
          i18nCaption="科目ページに表示されるメモを設定します。"
          options={saves.scombzData.coursePageMemo.map(
            (memo) => `${memo.course ?? memo.id}: ${memo.memo.slice(0, 30)}`,
          )}
          onChange={(idx) => {
            const newMemos = saves.scombzData.coursePageMemo.filter((_, i) => i !== idx);
            setScombzData("coursePageMemo", newMemos);
          }}
          reset={() => setScombzData("coursePageMemo", [])}
        />
      </Stack>
    </Box>
  );
};
