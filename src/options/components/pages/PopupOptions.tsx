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
      <Box display="flex" flexDirection="column" gap={1} p={1}>
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
          i18nCaption={`課題タブにおいて、課題の数が多いときにあふれた項目を非表示にするかスクロールして表示するか選択できます。`}
          options={[
            { value: "hidden", label: "非表示にする" },
            { value: "auto", label: "スクロールして表示する" },
          ]}
          optionId="popupOverflowMode"
          value={saves.settings.popupOverflowMode}
          onChange={(e, _) => setSettings("popupOverflowMode", e.target.value)}
        />
        <CustomTextField
          i18nLabel="期限が一定日数以内の課題をカウント対象とする"
          type="number"
          i18nCaption={``}
          optionId="popupTasksRange"
          value={saves.settings.popupTasksRange.toString()}
          onSaveButtonClick={(value) => setSettings("popupTasksRange", parseInt(value, 10))}
        />
        <CustomSelect
          i18nLabel="一定日数より先の課題の表示方法"
          i18nCaption={`課題タブにおいて、「期限が一定日数以内の課題をカウント対象とする」設定でカウントの対象外となった課題の表示方法を選択できます。`}
          options={[
            { value: "normal", label: "通常と同様に表示" },
            { value: "gray", label: "薄い灰色で表示" },
            { value: "hidden", label: "非表示" },
          ]}
          optionId="popupLaterTasks"
          value={saves.settings.popupLaterTasks}
          onChange={(e, _) => setSettings("popupLaterTasks", e.target.value)}
        />
      </Box>
    </Box>
  );
};
