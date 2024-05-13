import { Box, Typography } from "@mui/material";
import { CustomSelect } from "./CustomSelect";
import { CustomSwitch } from "./CustomSwitch";

import type { Saves, Settings } from "~settings";

type Props = {
  saves: Saves;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: (key: keyof Settings, value: any) => void;
};
export const BasicOptions = (props: Props) => {
  const { saves, setSettings } = props;
  return (
    <Box>
      <Typography variant="h5">基本設定</Typography>
      <Box display="flex" flexDirection="column" gap={1} p={1}>
        <CustomSelect
          label="学部"
          optionId="faculty"
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
        <CustomSwitch
          label="ログインボタン自動クリック"
          caption="ScombZのログイン画面に遷移した際、学生ログインを自動でクリックします。"
          id="clickLogin"
          value={saves.settings.clickLogin}
          onChange={(_e, checked) => setSettings("clickLogin", checked)}
        />
        <CustomSwitch
          label="自動ログイン"
          caption={`ログイン情報を自動入力し、ADFS二段階認証確認画面の次へボタンを自動でクリックします。
            ログイン後、自動でScombZの画面に入れます。
            スマートフォンを利用した二段階認証にも対応しています。
            ※登録した情報は「詳細設定タブ」から確認・変更ができます。`}
          id="autoAdfs"
          value={saves.settings.autoAdfs}
          onChange={(_e, checked) => setSettings("autoAdfs", checked)}
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
          optionId="removeAttendance"
          caption="科目ページの最下部にある出欠表示を削除します。 ※表示のみを削除することも可能です。"
          options={[
            { value: "none", label: "削除しない" },
            { value: "only", label: "出席表示が※の科目のみ" },
            { value: "all", label: "全て" },
          ]}
          value={saves.settings.removeAttendance}
          onChange={(e, _) => setSettings("removeAttendance", e.target.value)}
        />
        <CustomSwitch
          label="S*gsot学番自動入力"
          caption="S*gsotのログイン時、ユーザー名入力欄に学籍番号を自動入力します。"
          id="autoFillSgsot"
          value={saves.settings.autoFillSgsot}
          onChange={(_e, checked) => setSettings("autoFillSgsot", checked)}
        />
        <CustomSwitch
          label="時間割 現在の授業を目立たせる"
          caption={`LMSページおよびメニュー横ウィジェットの時間割で、現在の授業時間を目立たせます。`}
          id="highlightToday"
          value={saves.settings.highlightToday}
          onChange={(_e, checked) => setSettings("highlightToday", checked)}
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
          label="レポート提出ボタンの変更"
          caption="レポート提出画面に、制作時間の簡易入力ボタンを追加します。また、提出ボタンをユーザビリティに配慮した色や配置にします。"
          id="changeReportBtn"
          value={saves.settings.changeReportBtn}
          onChange={(_e, checked) => setSettings("changeReportBtn", checked)}
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
    </Box>
  );
};
