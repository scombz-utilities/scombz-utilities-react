import { Box, Typography } from "@mui/material";
import { CustomSelect } from "~/options/components/blocks/CustomSelect";
import { CustomSwitch } from "~/options/components/blocks/CustomSwitch";
import { CustomTextField } from "~/options/components/blocks/CustomTextField";
import type { Saves, Settings } from "~settings";

type Props = {
  saves: Saves;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: (key: keyof Settings, value: any) => void;
};

export const PopupOptions = (props: Props) => {
  const { saves, setSettings } = props;
  return (
    <Box>
      <Typography variant="h5">ポップアップ</Typography>
      <Box p={1}>
        <Typography variant="body2" sx={{ color: "#666" }}>
          アドレスバー横にあるScombZ Utilitiesをクリックすると表示されるポップアップメニューについての設定を行います。
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1} p={1}>
        <Typography variant="h6">基本設定</Typography>
        <CustomSelect
          i18nLabel="初期タブ"
          i18nCaption="ポップアップを開いたときに最初に表示されるタブを選択します。"
          options={[
            { value: "timetable", label: "時間割" },
            { value: "tasks", label: "課題" },
          ]}
          optionId="popupInitialTab"
          value={saves.settings.popupInitialTab}
          onChange={(e, _) => setSettings("popupInitialTab", e.target.value)}
        />
        <CustomSwitch
          i18nLabel="未提出課題数のバッジ表示"
          i18nCaption="未提出の課題の個数をバッジに表示します。"
          optionId="popupBadge"
          value={saves.settings.popupBadge}
          onChange={(_e, checked) => setSettings("popupBadge", checked)}
        />
        <CustomSwitch
          i18nLabel="課題タブを表示する"
          i18nCaption={`ポップアップ内の時間割に課題タブを表示します。
            課題タブからは未提出の課題を確認することができます。
            課題タブ内の項目をクリックするとその課題の提出ページを開くことができます。`}
          optionId="popupTasksTab"
          value={saves.settings.popupTasksTab}
          onChange={(_e, checked) => setSettings("popupTasksTab", checked)}
        />
        <CustomSelect
          i18nLabel="課題が多い場合の表示方法"
          i18nCaption={`課題タブにおいて、課題の数が多いときにあふれた項目を省略するかスクロールして表示するか選択できます。「省略する」を選択した場合は「… 他◯件」をクリックすることでスクロール表示に切り替えることができます。`}
          options={[
            { value: "hidden", label: "省略する" },
            { value: "auto", label: "スクロールして表示する" },
          ]}
          optionId="popupOverflowMode"
          value={saves.settings.popupOverflowMode}
          onChange={(e, _) => setSettings("popupOverflowMode", e.target.value)}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap={1} p={1}>
        <Typography variant="h6">フィルタ機能</Typography>
        <CustomSwitch
          i18nLabel="一定日数より先の課題をポップアップから非表示"
          i18nCaption={`下の「非表示にする日数」で設定した日数よりも提出期限が先の課題について、ポップアップ内の課題一覧に表示されなくなります。また、バッジに表示される未提出の課題の個数のカウントからも除外されます。この設定で非表示になったとしても課題の存在が無くなった訳ではないので注意してください。`}
          optionId="popupHideFutureTasks"
          value={saves.settings.popupHideFutureTasks}
          onChange={(_e, checked) => setSettings("popupHideFutureTasks", checked)}
        />
        <CustomTextField
          i18nLabel="非表示にする日数"
          type="number"
          i18nCaption={``}
          optionId="popupHideFutureTasksRange"
          value={saves.settings.popupHideFutureTasksRange.toString()}
          onSaveButtonClick={(value) => setSettings("popupHideFutureTasksRange", parseInt(value, 10))}
        />
      </Box>
    </Box>
  );
};
