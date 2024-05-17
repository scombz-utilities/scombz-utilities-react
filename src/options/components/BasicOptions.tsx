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
        <CustomSwitch
          i18nLabel="科目ページ シラバス連携ボタンの表示"
          i18nCaption="科目別のページ内において、シラバスへのリンクを表示します。"
          optionId="createSyllabusButton"
          value={saves.settings.createSyllabusButton}
          onChange={(_e, checked) => setSettings("createSyllabusButton", checked)}
        />
        <CustomSwitch
          i18nLabel="科目ページ 要素入れ替え"
          i18nCaption="科目ページに存在する「担当教員へのメッセージ」「お知らせ」「課題」「教材」「テスト」「アンケート」「ディスカッション」「出席」の各要素を自由に入れ替えします。順番は詳細設定から変更できます。"
          optionId="sortSubjectByOrder"
          value={saves.settings.sortSubjectByOrder}
          onChange={(_e, checked) => setSettings("sortSubjectByOrder", checked)}
        />
        <CustomSelect
          i18nLabel="科目ページ 教材の順番を統一"
          optionId="materialSortOrder"
          i18nCaption="科目によって初回が一番上だったり最新回が一番上だったりする教材の順番を統一します。"
          options={[
            { value: "false", label: "統一しない" },
            { value: "asc", label: "昇順(初回が一番上)" },
            { value: "desc", label: "降順(最新回が一番上)" },
          ]}
          value={saves.settings.materialSortOrder.toString()}
          onChange={(e, _) => setSettings("materialSortOrder", e.target.value === "false" ? false : e.target.value)}
        />
        <CustomSwitch
          i18nLabel="科目ページ 使わない教材を非表示"
          i18nCaption="教材要素にある様々なものを非表示にできるようにします。詳細設定から、自動的に非表示にするものも選択できます。"
          optionId="hideMaterial"
          value={saves.settings.hideMaterial}
          onChange={(_e, checked) => setSettings("hideMaterial", checked)}
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
