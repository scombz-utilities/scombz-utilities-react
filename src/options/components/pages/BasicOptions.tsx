import { LoginToGoogle } from "../blocks/LoginToGoogle";
import { CustomSelect } from "~/options/components/blocks/CustomSelect";
import { CustomSwitch } from "~/options/components/blocks/CustomSwitch";
import { CustomTextField } from "~/options/components/blocks/CustomTextField";
import { OptionGroup } from "~/options/components/blocks/OptionGroup";
import type { Saves, Settings } from "~settings";

type Props = {
  saves: Saves;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSettings: (key: keyof Settings, value: any) => void;
};
export const BasicOptions = (props: Props) => {
  const { saves, setSettings } = props;
  return (
    <>
      <h2>{chrome.i18n.getMessage("basicOptions")}</h2>
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
          placeholder="XX00000"
          pattern="^([a-zA-Z]{2}[0-9]{5})$"
          validateMessage="学籍番号は2文字のアルファベットと5文字の数字の組み合わせで入力してください。"
          canIgnoreError
          onSaveButtonClick={(value) => {
            const username = value + "@sic";
            setSettings("loginData", { ...saves.settings.loginData, username });
          }}
        />
        <CustomTextField
          i18nLabel="optionTitlePassword"
          type="password"
          i18nCaption="optionDescriptionPassword"
          optionId="loginData.password"
          value={saves.settings.loginData.password}
          placeholder="password"
          onSaveButtonClick={(value) => setSettings("loginData", { ...saves.settings.loginData, password: value })}
        />
        <CustomSwitch
          i18nLabel="basicOptions_ClickLoginButtonAutomatically"
          i18nCaption="ScombZのログイン画面に遷移した際、学生ログインを自動でクリックします。"
          optionId="clickLogin"
          value={saves.settings.clickLogin}
          onChange={(_e, checked) => setSettings("clickLogin", checked)}
        />
        <CustomSwitch
          i18nLabel="自動ログイン"
          i18nCaption={`ログイン情報を自動入力し、ADFS二段階認証確認画面の次へボタンを自動でクリックします。
            ログイン後、自動でScombZの画面に入れます。
            スマートフォンを利用した二段階認証にも対応しています。`}
          optionId="autoAdfs"
          value={saves.settings.autoAdfs}
          onChange={(_e, checked) => setSettings("autoAdfs", checked)}
        />
      </OptionGroup>
      <OptionGroup i18nTitle="機能設定">
        <CustomSwitch
          i18nLabel="全てのアンケートを課題として表示"
          i18nCaption="授業ごとのアンケート表示の設定の有無に関わらず、回答期限内の全てのアンケートを課題として表示します。"
          optionId="displayAllSurvey"
          value={saves.settings.displayAllSurvey}
          onChange={(_e, checked) => setSettings("displayAllSurvey", checked)}
        />
        <LoginToGoogle saves={saves} onChange={(value) => setSettings("googleClassroom", value)} />
      </OptionGroup>
    </>
  );
};
