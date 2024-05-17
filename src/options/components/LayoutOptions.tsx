import { Box, Typography } from "@mui/material";
import { CustomSwitch } from "./CustomSwitch";
import type { Saves, Settings } from "~settings";

type Props = {
  saves: Saves;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: (key: keyof Settings, value: any) => void;
};
export const LayoutOptions = (props: Props) => {
  const { saves, setSettings } = props;
  return (
    <Box>
      <Typography variant="h5">レイアウト設定</Typography>
      <Box display="flex" flexDirection="column" gap={1} p={1}>
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
          i18nLabel="更新通知全削除ボタン追加"
          i18nCaption="ページ上部に表示されるバナーにある更新通知ボタンの右側に、全ての更新通知を一括で削除するボタンを追加します。"
          optionId="updateClear"
          value={saves.settings.updateClear}
          onChange={(_e, checked) => setSettings("updateClear", checked)}
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
      </Box>
    </Box>
  );
};
