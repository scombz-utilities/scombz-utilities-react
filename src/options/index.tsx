import { Box, Button, Typography, Snackbar, Alert, ThemeProvider } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { CustomRemovableList } from "./components/CustomRemovableList";
import { CustomSelect } from "./components/CustomSelect";
import { CustomSwitch } from "./components/CustomSwitch";
import { CustomTextField } from "./components/CustomTextField";
import theme from "~/theme";
import { SLIDER_BAR_MINS } from "~constants";
import { defaultSaves } from "~settings";
import type { Saves, Faculty } from "~settings";

const OptionsIndex = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [saves, setSaves] = useState<Saves>(defaultSaves);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setSettings = (key: string, value: any) => {
    setSaves({
      ...saves,
      settings: {
        ...saves.settings,
        [key]: value,
      },
    });
  };

  useEffect(() => {
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      setSaves(currentData);
    });
  }, []);

  const save = () => {
    chrome.storage.local.set(saves, () => {
      console.log("Saved");
      setSnackbarOpen(true);
    });
  };

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
    <ThemeProvider theme={theme}>
      <Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "300px", py: 1 }}
          >
            設定を保存しました
          </Alert>
        </Snackbar>
        <Box p={2} pb={10}>
          <Typography variant="h4">ScombZ Utilities</Typography>
          <Box display="flex" flexDirection="column" gap={1} p={1}>
            <CustomSelect
              label="学部"
              id="faculty"
              caption="学部を選択してください"
              options={[
                { value: "din", label: "大学院" },
                { value: "ko1", label: "工学部" },
                { value: "sys", label: "システム理工学部" },
                { value: "dsn", label: "デザイン工学部" },
                { value: "arc", label: "建築学部" },
              ]}
              value={saves.settings.faculty}
              onChange={(e, _) => setSettings("faculty", e.target.value as Faculty)}
            />
            <CustomSwitch
              label="ログインボタン自動クリック"
              caption="ScombZのログイン画面に遷移した際、学生ログインを自動でクリックします。"
              id="clickLogin"
              value={saves.settings.clickLogin}
              onChange={(_e, checked) => setSettings("clickLogin", checked)}
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
            <CustomSwitch
              label="未提出課題数のバッジ表示"
              caption="未提出の課題の個数をバッジに表示します。"
              id="popupBadge"
              value={saves.settings.popupBadge}
              onChange={(_e, checked) => setSettings("popupBadge", checked)}
            />
            <CustomSelect
              label="出欠表示削除"
              id="removeAttendance"
              caption="科目ページの最下部にある出欠表示を削除します。 ※表示のみを削除することも可能です。"
              options={[
                { value: "none", label: "削除しない" },
                { value: "only", label: "出席表示が※の科目のみ" },
                { value: "all", label: "全て" },
              ]}
              value={saves.settings.removeAttendance}
              onChange={(e, _) => setSettings("removeAttendance", e.target.value)}
            />
            <CustomRemovableList
              label="授業内アンケートの課題表示"
              id="notifySurveySubjects"
              caption="授業内アンケートを課題として表示する科目を選択します。"
              options={saves.settings.notifySurveySubjects.map((subject) => subject.name)}
              onChange={(idx) => {
                const newSubjects = saves.settings.notifySurveySubjects.filter((_, i) => i !== idx);
                setSettings("notifySurveySubjects", newSubjects);
              }}
              reset={() => setSettings("notifySurveySubjects", [])}
            />
            <CustomSwitch
              label="未提出課題数のバッジ表示"
              caption={`ADFS二段階認証確認画面の次へボタンを自動でクリックします。
            ログイン後、自動でScombZの画面に入れます。
            スマートフォンを利用した二段階認証にも対応しています`}
              id="autoAdfs"
              value={saves.settings.autoAdfs}
              onChange={(_e, checked) => setSettings("autoAdfs", checked)}
            />
            <CustomSwitch
              label="S*gsot学番自動入力"
              caption="S*gsotのログイン時、ユーザー名入力欄に学籍番号を自動入力します。"
              id="autoFillSgsot"
              value={saves.settings.autoFillSgsot}
              onChange={(_e, checked) => setSettings("autoFillSgsot", checked)}
            />
            <CustomSwitch
              label="サイドメニューを自動で閉じる"
              caption={`ScombZの左側に表示されるサイドメニューを、常に閉じた状態でページ読み込みします。
                      メニューボタンを押すことで展開できます。
                      左メニュースタイル変更をオンにしている場合は、本項目もオンにすることが推奨されます。`}
              id="hideSideMenu"
              value={saves.settings.hideSideMenu}
              onChange={(_e, checked) => setSettings("hideSideMenu", checked)}
            />
            <CustomSwitch
              label="サイドメニューのスタイル変更"
              caption={`ScombZの左側に表示されるサイドメニューを、ユーザビリティに配慮したスタイルに変更します。
                      表示だけでなく、グレーの部分をクリックすることによっても、メニューを閉じられるようになります。`}
              id="styleSideMenu"
              value={saves.settings.styleSideMenu}
              onChange={(_e, checked) => setSettings("styleSideMenu", checked)}
            />
            <CustomSwitch
              label="お知らせダイアログを大きくする"
              caption={`ScombZのお知らせなどのダイアログを、ウィンドウのサイズまで拡張して見やすくします。
                      また、ダイアログの外をクリックすることでもダイアログを閉じられるようになります。`}
              id="styleDialog"
              value={saves.settings.styleDialog}
              onChange={(_e, checked) => setSettings("styleDialog", checked)}
            />
            <CustomSwitch
              label="アンケートのレイアウト最適化"
              caption={`アンケート画面のレイアウトを最適化します。`}
              id="styleSurveys"
              value={saves.settings.styleSurveys}
              onChange={(_e, checked) => setSettings("styleSurveys", checked)}
            />
            <CustomSwitch
              label="テストのレイアウト最適化"
              caption={`テスト画面のレイアウトを最適化します。`}
              id="useSubTimeTable"
              value={saves.settings.useSubTimeTable}
              onChange={(_e, checked) => setSettings("useSubTimeTable", checked)}
            />
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
              label="時間割 現在の授業を目立たせる"
              caption={`LMSページおよびメニュー横ウィジェットの時間割で、現在の授業時間を目立たせます。`}
              id="highlightToday"
              value={saves.settings.highlightToday}
              onChange={(_e, checked) => setSettings("highlightToday", checked)}
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
              label="レポート提出ボタンの変更"
              caption="レポート提出画面に、制作時間の簡易入力ボタンを追加します。また、提出ボタンをユーザビリティに配慮した色や配置にします。"
              id="changeReportBtn"
              value={saves.settings.changeReportBtn}
              onChange={(_e, checked) => setSettings("changeReportBtn", checked)}
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
            <CustomTextField
              label="課題一覧表示件数"
              type="number"
              caption="メニュー横ウィジェットの課題一覧で、1ページ内に表示する課題の最大件数を設定します。 課題の数がこれを超えた場合であっても、ページネーションにより全ての課題を確認できます。"
              id="taskListRowsPerPage"
              value={saves.settings.taskListRowsPerPage.toString()}
              onChange={(e) => setSettings("taskListRowsPerPage", parseInt(e.target.value, 10))}
            />
            <CustomTextField
              label="スライダーバーの最大値(分)"
              type="number"
              caption="レポート提出時に、作成時間を簡易入力するためのスライダーバーの最大値を設定します。"
              id="sliderBarMax"
              value={saves.settings.sliderBarMax.toString()}
              onChange={(e) => setSettings("sliderBarMax", parseInt(e.target.value, 10))}
            />
            <CustomSelect
              label="提出時間の初期値(分)"
              caption="レポート提出時に、作成時間を簡易入力するためのスライダーバーの初期値を設定します。"
              id="timesBtnValue"
              options={SLIDER_BAR_MINS.map((min, index) => ({
                value: index.toString(),
                label: min.join("分, ") + "分",
              }))}
              value={saves.settings.timesBtnValue.toString()}
              onChange={(e, _) => setSettings("timesBtnValue", parseInt(e.target.value, 10))}
            />
            <CustomTextField
              label="ファイル名の自動入力設定"
              caption="レポート提出時にファイル名自動入力ボタンを押した際に入力される文字列を変更します。"
              id="defaultInputName"
              value={saves.settings.defaultInputName}
              onChange={(e) => setSettings("defaultInputName", e.target.value)}
            />
            <CustomSwitch
              label="LMSページのレイアウト変更 教室表示"
              caption="LMSページで、教室情報を常に表示します。"
              id="lms.showClassroom"
              value={saves.settings.lms.showClassroom}
              onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, showClassroom: checked })}
            />
            <CustomSwitch
              label="LMSページのレイアウト変更 文字センタリング"
              caption="LMSページで、文字を中央揃えにします。"
              id="lms.centering"
              value={saves.settings.lms.centering}
              onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, centering: checked })}
            />
            <CustomSwitch
              label="LMSページのレイアウト変更 休日非表示"
              caption="LMSページで、授業のない日を非表示にします。 また、5限以降の授業をとっていない場合はそれらも非表示にします。"
              id="lms.hideNoClassDay"
              value={saves.settings.lms.hideNoClassDay}
              onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, hideNoClassDay: checked })}
            />
            <CustomSwitch
              label="更新通知全削除ボタン追加"
              caption="ページ上部に表示されるバナーにある更新通知ボタンの右側に、全ての更新通知を一括で削除するボタンを追加します。"
              id="updateClear"
              value={saves.settings.updateClear}
              onChange={(_e, checked) => setSettings("updateClear", checked)}
            />
            <CustomSwitch
              label="課題削除できないバグの修正"
              caption="課題提出画面の成果物提出を削除するとき、ドラッグ&ドロップ状態になっていると画面に何も表示されなくなり何もできなくなるという、ScombZ本体のバグを修正します。"
              id="dragAndDropBugFix"
              value={saves.settings.dragAndDropBugFix}
              onChange={(_e, checked) => setSettings("dragAndDropBugFix", checked)}
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
              label="提出済み課題を非表示"
              caption="ScombZのホーム画面に表示されるカレンダーにおいて、既に提出済みである課題を非表示にします。"
              id="hideCompletedReports"
              value={saves.settings.hideCompletedReports}
              onChange={(_e, checked) => setSettings("hideCompletedReports", checked)}
            />
            <CustomSwitch
              label="サインアウトページのレイアウト変更"
              caption="サインアウトページのレイアウトを最適化します。"
              id="signOutPageLayout"
              value={saves.settings.signOutPageLayout}
              onChange={(_e, checked) => setSettings("signOutPageLayout", checked)}
            />
            <CustomSwitch
              label="レイアウト変更 最大幅を有効化"
              caption="ページの最大幅の有効/無効を設定します。"
              id="layout.setMaxWidth"
              value={saves.settings.layout.setMaxWidth}
              onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, setMaxWidth: checked })}
            />
            <CustomTextField
              label="レイアウト変更 科目別ページ最大幅(px)"
              type="number"
              caption="科目別ページの最大幅を設定します。"
              id="layout.maxWidthPx.subj"
              value={saves.settings.layout.maxWidthPx.subj.toString()}
              onChange={(e) =>
                setSettings("layout", {
                  ...saves.settings.layout,
                  maxWidthPx: { ...saves.settings.layout.maxWidthPx, subj: parseInt(e.target.value, 10) },
                })
              }
            />
            <CustomTextField
              label="レイアウト変更 LMSページ最大幅(px)"
              type="number"
              caption="LMSページの最大幅を設定します。"
              id="layout.maxWidthPx.lms"
              value={saves.settings.layout.maxWidthPx.lms.toString()}
              onChange={(e) =>
                setSettings("layout", {
                  ...saves.settings.layout,
                  maxWidthPx: { ...saves.settings.layout.maxWidthPx, lms: parseInt(e.target.value, 10) },
                })
              }
            />
            <CustomTextField
              label="レイアウト変更 課題提出ページ最大幅(px)"
              type="number"
              caption="課題提出ページの最大幅を設定します。"
              id="layout.maxWidthPx.task"
              value={saves.settings.layout.maxWidthPx.task.toString()}
              onChange={(e) =>
                setSettings("layout", {
                  ...saves.settings.layout,
                  maxWidthPx: { ...saves.settings.layout.maxWidthPx, task: parseInt(e.target.value, 10) },
                })
              }
            />
            <CustomSwitch
              label="レイアウト変更 ページトップボタン非表示"
              caption="ページ最上部へのボタンを非表示にします。"
              id="layout.removePageTop"
              value={saves.settings.layout.removePageTop}
              onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, removePageTop: checked })}
            />
            <CustomSwitch
              label="レイアウト変更 ダイレクトリンク非表示"
              caption="ページ最下部に表示されるダイレクトリンクを非表示にします。"
              id="layout.removeDirectLink"
              value={saves.settings.layout.removeDirectLink}
              onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, removeDirectLink: checked })}
            />
            <CustomSwitch
              label="レイアウト変更 トップページレイアウト変更"
              caption="トップページのレイアウトを最適化します。"
              id="layout.topPageLayout"
              value={saves.settings.layout.topPageLayout}
              onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, topPageLayout: checked })}
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
              label="科目ページ タイトル変更"
              caption="科目別のページ内において、ページタイトルをわかりやすいものに変更します。"
              id="modifyCoursePageTitle"
              value={saves.settings.modifyCoursePageTitle}
              onChange={(_e, checked) => setSettings("modifyCoursePageTitle", checked)}
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
          </Box>
          <Box>
            <Typography variant="h4">初期化</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (confirm("本当に初期化しますか？\nこの操作は取り消せません。")) {
                  chrome.storage.local.clear(() => {
                    window.location.reload();
                  });
                }
              }}
            >
              初期化
            </Button>
          </Box>
          <Box
            m={1}
            position="fixed"
            sx={{
              bottom: 0,
              right: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fffa",
              backdropFilter: "blur(3px)",
              boxShadow: "0 0 6px #0003",
              margin: 0,
              padding: 1,
            }}
          >
            <Button variant="contained" sx={{ width: 250 }} onClick={save}>
              保存
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OptionsIndex;
