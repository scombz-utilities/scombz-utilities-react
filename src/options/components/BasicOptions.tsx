import { Box, Typography } from "@mui/material";
import { CustomSelect } from "./CustomSelect";
import { CustomSwitch } from "./CustomSwitch";
import { CustomTextField } from "./CustomTextField";
import { OptionGroup } from "./OptionGroup";
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
        <OptionGroup i18nTitle="OptionGroupSyllabusLinking">
          <CustomSelect
            i18nLabel="optionTitleFaculty"
            optionId="faculty"
            i18nCaption="optionDescriptionFaculty"
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
        </OptionGroup>
        <OptionGroup i18nTitle="OptionGroupAutomaticLogin">
          <CustomTextField
            i18nLabel="optionTitleStudentID"
            i18nCaption="optionDescriptionStudentID"
            optionId="loginData.username"
            value={saves.settings.loginData.username.split("@")[0]}
            onSaveButtonClick={(value) => {
              const username = value.includes("@") ? value : value + "@sic";
              setSettings("loginData", { ...saves.settings.loginData, username });
            }}
          />
          <CustomTextField
            i18nLabel="optionTitlePassword"
            type="password"
            i18nCaption="optionDescriptionPassword"
            optionId="loginData.password"
            value={saves.settings.loginData.password}
            onSaveButtonClick={(value) => setSettings("loginData", { ...saves.settings.loginData, password: value })}
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
        </OptionGroup>
      </Box>
    </Box>
  );
};
