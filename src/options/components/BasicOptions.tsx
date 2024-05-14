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
          i18nLabel="在籍学部"
          optionId="faculty"
          i18nCaption="学部情報をもとに、科目別ページにシラバスへのリンクを表示します。"
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
          i18nLabel="ログインボタン自動クリック"
          i18nCaption="ScombZのログイン画面に遷移した際、学生ログインを自動でクリックします。"
          optionId="clickLogin"
          value={saves.settings.clickLogin}
          onChange={(_e, checked) => setSettings("clickLogin", checked)}
        />
        <CustomSwitch
          i18nLabel="自動ログイン"
          i18nCaption={`ログイン情報を自動入力し、ADFS二段階認証確認画面の次へボタンを自動でクリックします。
            ログイン後、自動でScombZの画面に入れます。
            スマートフォンを利用した二段階認証にも対応しています。
            ※登録した情報は「詳細設定タブ」から確認・変更ができます。`}
          optionId="autoAdfs"
          value={saves.settings.autoAdfs}
          onChange={(_e, checked) => setSettings("autoAdfs", checked)}
        />
        <CustomSwitch
          i18nLabel="未提出課題数のバッジ表示"
          i18nCaption="未提出の課題の個数をバッジに表示します。"
          optionId="popupBadge"
          value={saves.settings.popupBadge}
          onChange={(_e, checked) => setSettings("popupBadge", checked)}
        />
        <CustomSelect
          i18nLabel="出欠表示削除"
          optionId="removeAttendance"
          i18nCaption="科目ページの最下部にある出欠表示を削除します。 ※表示のみを削除することも可能です。"
          options={[
            { value: "none", label: "削除しない" },
            { value: "only", label: "出席表示が※の科目のみ" },
            { value: "all", label: "全て" },
          ]}
          value={saves.settings.removeAttendance}
          onChange={(e, _) => setSettings("removeAttendance", e.target.value)}
        />
        <CustomSwitch
          i18nLabel="S*gsot学番自動入力"
          i18nCaption="S*gsotのログイン時、ユーザー名入力欄に学籍番号を自動入力します。"
          optionId="autoFillSgsot"
          value={saves.settings.autoFillSgsot}
          onChange={(_e, checked) => setSettings("autoFillSgsot", checked)}
        />
        <CustomSwitch
          i18nLabel="サイドメニューを自動で閉じる"
          i18nCaption={`ScombZの左側に表示されるサイドメニューを、常に閉じた状態でページ読み込みします。
                      メニューボタンを押すことで展開できます。
                      左メニュースタイル変更をオンにしている場合は、本項目もオンにすることが推奨されます。`}
          optionId="hideSideMenu"
          value={saves.settings.hideSideMenu}
          onChange={(_e, checked) => setSettings("hideSideMenu", checked)}
        />
        <CustomSwitch
          i18nLabel="サイドメニューのスタイル変更"
          i18nCaption={`ScombZの左側に表示されるサイドメニューを、ユーザビリティに配慮したスタイルに変更します。
                      表示だけでなく、グレーの部分をクリックすることによっても、メニューを閉じられるようになります。`}
          optionId="styleSideMenu"
          value={saves.settings.styleSideMenu}
          onChange={(_e, checked) => setSettings("styleSideMenu", checked)}
        />
        <CustomSwitch
          i18nLabel="お知らせダイアログを大きくする"
          i18nCaption={`ScombZのお知らせなどのダイアログを、ウィンドウのサイズまで拡張して見やすくします。
                      また、ダイアログの外をクリックすることでもダイアログを閉じられるようになります。`}
          optionId="styleDialog"
          value={saves.settings.styleDialog}
          onChange={(_e, checked) => setSettings("styleDialog", checked)}
        />
        <CustomSwitch
          i18nLabel="アンケートのレイアウト最適化"
          i18nCaption={`アンケート画面のレイアウトを最適化します。`}
          optionId="styleSurveys"
          value={saves.settings.styleSurveys}
          onChange={(_e, checked) => setSettings("styleSurveys", checked)}
        />
        <CustomSwitch
          i18nLabel="テストのレイアウト最適化"
          i18nCaption={`テスト画面のレイアウトを最適化します。`}
          optionId="useSubTimeTable"
          value={saves.settings.useSubTimeTable}
          onChange={(_e, checked) => setSettings("useSubTimeTable", checked)}
        />
        <CustomSwitch
          i18nLabel="レポート提出ボタンの変更"
          i18nCaption="レポート提出画面に、制作時間の簡易入力ボタンを追加します。また、提出ボタンをユーザビリティに配慮した色や配置にします。"
          optionId="changeReportBtn"
          value={saves.settings.changeReportBtn}
          onChange={(_e, checked) => setSettings("changeReportBtn", checked)}
        />
        <CustomSwitch
          i18nLabel="LMSページのレイアウト変更 教室表示"
          i18nCaption="LMSページで、教室情報を常に表示します。"
          optionId="lms.showClassroom"
          value={saves.settings.lms.showClassroom}
          onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, showClassroom: checked })}
        />
        <CustomSwitch
          i18nLabel="LMSページのレイアウト変更 文字センタリング"
          i18nCaption="LMSページで、文字を中央揃えにします。"
          optionId="lms.centering"
          value={saves.settings.lms.centering}
          onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, centering: checked })}
        />
        <CustomSwitch
          i18nLabel="LMSページのレイアウト変更 休日非表示"
          i18nCaption="LMSページで、授業のない日を非表示にします。 また、5限以降の授業をとっていない場合はそれらも非表示にします。"
          optionId="lms.hideNoClassDay"
          value={saves.settings.lms.hideNoClassDay}
          onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, hideNoClassDay: checked })}
        />

        <CustomSwitch
          i18nLabel="更新通知全削除ボタン追加"
          i18nCaption="ページ上部に表示されるバナーにある更新通知ボタンの右側に、全ての更新通知を一括で削除するボタンを追加します。"
          optionId="updateClear"
          value={saves.settings.updateClear}
          onChange={(_e, checked) => setSettings("updateClear", checked)}
        />
        <CustomSwitch
          i18nLabel="課題削除できないバグの修正"
          i18nCaption="課題提出画面の成果物提出を削除するとき、ドラッグ&ドロップ状態になっていると画面に何も表示されなくなり何もできなくなるという、ScombZ本体のバグを修正します。"
          optionId="dragAndDropBugFix"
          value={saves.settings.dragAndDropBugFix}
          onChange={(_e, checked) => setSettings("dragAndDropBugFix", checked)}
        />
        <CustomSwitch
          i18nLabel="課題ドラッグ&ドロップ提出"
          i18nCaption="課題提出画面の成果物提出欄をクリックなしで最初からドラッグ&ドロップにします。"
          optionId="forceDragAndDropSubmit"
          value={saves.settings.forceDragAndDropSubmit}
          onChange={(_e, checked) => setSettings("forceDragAndDropSubmit", checked)}
        />
        <CustomSwitch
          i18nLabel="ファイル一括ダウンロード"
          i18nCaption="科目詳細ページ内において、配布されているすべてのpdfファイルをZIP形式に圧縮し一括でダウンロードする機能です。"
          optionId="downloadFileBundle"
          value={saves.settings.downloadFileBundle}
          onChange={(_e, checked) => setSettings("downloadFileBundle", checked)}
        />
        <CustomSwitch
          i18nLabel="提出済み課題を非表示"
          i18nCaption="ScombZのホーム画面に表示されるカレンダーにおいて、既に提出済みである課題を非表示にします。"
          optionId="hideCompletedReports"
          value={saves.settings.hideCompletedReports}
          onChange={(_e, checked) => setSettings("hideCompletedReports", checked)}
        />
        <CustomSwitch
          i18nLabel="サインアウトページのレイアウト変更"
          i18nCaption="サインアウトページのレイアウトを最適化します。"
          optionId="signOutPageLayout"
          value={saves.settings.signOutPageLayout}
          onChange={(_e, checked) => setSettings("signOutPageLayout", checked)}
        />
        <CustomSwitch
          i18nLabel="レイアウト変更 最大幅を有効化"
          i18nCaption="ページの最大幅の有効/無効を設定します。"
          optionId="layout.setMaxWidth"
          value={saves.settings.layout.setMaxWidth}
          onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, setMaxWidth: checked })}
        />

        <CustomSwitch
          i18nLabel="レイアウト変更 ページトップボタン非表示"
          i18nCaption="ページ最上部へのボタンを非表示にします。"
          optionId="layout.removePageTop"
          value={saves.settings.layout.removePageTop}
          onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, removePageTop: checked })}
        />
        <CustomSwitch
          i18nLabel="レイアウト変更 ダイレクトリンク非表示"
          i18nCaption="ページ最下部に表示されるダイレクトリンクを非表示にします。"
          optionId="layout.removeDirectLink"
          value={saves.settings.layout.removeDirectLink}
          onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, removeDirectLink: checked })}
        />
        <CustomSwitch
          i18nLabel="レイアウト変更 トップページレイアウト変更"
          i18nCaption="トップページのレイアウトを最適化します。"
          optionId="layout.topPageLayout"
          value={saves.settings.layout.topPageLayout}
          onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, topPageLayout: checked })}
        />
        <CustomSwitch
          i18nLabel="レイアウト変更 名前非表示"
          i18nCaption="名前をクリックして非表示にできるようにします。"
          optionId="layout.clickToHideName"
          value={saves.settings.layout.clickToHideName}
          onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, clickToHideName: checked })}
        />
        <CustomSwitch
          i18nLabel="科目ページ リンク化"
          i18nCaption="科目別のページ内において、テキスト内のURLをリンク化します。"
          optionId="layout.linkify"
          value={saves.settings.layout.linkify}
          onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, linkify: checked })}
        />
        <CustomSwitch
          i18nLabel="科目ページ タイトル変更"
          i18nCaption="科目別のページ内において、ページタイトルをわかりやすいものに変更します。"
          optionId="modifyCoursePageTitle"
          value={saves.settings.modifyCoursePageTitle}
          onChange={(_e, checked) => setSettings("modifyCoursePageTitle", checked)}
        />
        <CustomSwitch
          i18nLabel="特殊リンクにおけるホイールクリックと右クリックの有効化"
          i18nCaption="LMSページ内の科目ボタン、科目別ページのダウンロードリンクなど、右クリックが通常できないリンクを通常のリンクと同じようにサポートします。"
          optionId="modifyClickableLinks"
          value={saves.settings.modifyClickableLinks}
          onChange={(_e, checked) => setSettings("modifyClickableLinks", checked)}
        />
        <CustomSwitch
          i18nLabel="科目ページ マークダウンメモ帳"
          i18nCaption="科目別ページ内において、マークダウン記法に対応したメモ帳を追加します。"
          optionId="markdownNotePad"
          value={saves.settings.markdownNotePad}
          onChange={(_e, checked) => setSettings("markdownNotePad", checked)}
        />
      </Box>
    </Box>
  );
};
