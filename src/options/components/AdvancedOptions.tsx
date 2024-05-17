import { Box, Stack, Typography } from "@mui/material";
import { CustomRemovableList } from "./CustomRemovableList";
import { CustomSelect } from "./CustomSelect";
import { CustomSwitch } from "./CustomSwitch";
import { CustomTextField } from "./CustomTextField";
import { OptionGroup } from "./OptionGroup";
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

  const dictionary = {
    message: "担当教員へのメッセージ",
    information: "お知らせ",
    report: "課題",
    courseContent: "教材",
    examination: "テスト",
    questionnaire: "アンケート",
    discussion: "ディスカッション",
    attendance: "出席",
    ltiExternalToolLink: "外部連携",
  };

  const [items, setItems] = useState(() => {
    return saves.settings.subjectOrder.map((value, idx) => {
      return {
        id: idx + 1,
        value,
        displayValue: dictionary[value] ?? value,
      };
    });
  });

  useEffect(() => {
    if (JSON.stringify(items.map((item) => item.value)) === JSON.stringify(saves.settings.subjectOrder)) return;
    setSettings(
      "subjectOrder",
      items.map((item) => item.value),
    );
  }, [items]);

  return (
    <Box>
      <Typography variant="h5">詳細設定</Typography>
      <Stack gap={1} p={1}>
        <OptionGroup i18nTitle="科目ページ">
          <CustomTextField
            i18nLabel="レイアウト変更 科目別ページ最大幅(px)"
            type="number"
            i18nCaption="科目別ページの最大幅を設定します。"
            optionId="layout.maxWidthPx.subj"
            value={saves.settings.layout.maxWidthPx.subj.toString()}
            onSaveButtonClick={(value) =>
              setSettings("layout", {
                ...saves.settings.layout,
                maxWidthPx: { ...saves.settings.layout.maxWidthPx, subj: parseInt(value, 10) },
              })
            }
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
          <CustomSwitch
            i18nLabel="ファイル一括ダウンロード"
            i18nCaption="科目詳細ページ内において、配布されているすべてのpdfファイルをZIP形式に圧縮し一括でダウンロードする機能です。"
            optionId="downloadFileBundle"
            value={saves.settings.downloadFileBundle}
            onChange={(_e, checked) => setSettings("downloadFileBundle", checked)}
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
            i18nLabel="科目ページ マークダウンメモ帳"
            i18nCaption="科目別ページ内において、マークダウン記法に対応したメモ帳を追加します。"
            optionId="markdownNotePad"
            value={saves.settings.markdownNotePad}
            onChange={(_e, checked) => setSettings("markdownNotePad", checked)}
          />
        </OptionGroup>

        <OptionGroup i18nTitle="課題提出ページ">
          <CustomTextField
            i18nLabel="スライダーバーの最大値(分)"
            type="number"
            i18nCaption="レポート提出時に、作成時間を簡易入力するためのスライダーバーの最大値を設定します。"
            optionId="sliderBarMax"
            value={saves.settings.sliderBarMax.toString()}
            onSaveButtonClick={(value) => setSettings("sliderBarMax", parseInt(value, 10))}
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
            onSaveButtonClick={(value) => setSettings("defaultInputName", value)}
          />
          <CustomTextField
            i18nLabel="レイアウト変更 課題提出ページ最大幅(px)"
            type="number"
            i18nCaption="課題提出ページの最大幅を設定します。"
            optionId="layout.maxWidthPx.task"
            value={saves.settings.layout.maxWidthPx.task.toString()}
            onSaveButtonClick={(value) =>
              setSettings("layout", {
                ...saves.settings.layout,
                maxWidthPx: { ...saves.settings.layout.maxWidthPx, task: parseInt(value, 10) },
              })
            }
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
            i18nLabel="レポート提出ボタンの変更"
            i18nCaption="レポート提出画面に、制作時間の簡易入力ボタンを追加します。また、提出ボタンをユーザビリティに配慮した色や配置にします。"
            optionId="changeReportBtn"
            value={saves.settings.changeReportBtn}
            onChange={(_e, checked) => setSettings("changeReportBtn", checked)}
          />
        </OptionGroup>

        <OptionGroup i18nTitle="LMSページ">
          <CustomTextField
            i18nLabel="レイアウト変更 LMSページ最大幅(px)"
            type="number"
            i18nCaption="LMSページの最大幅を設定します。"
            optionId="layout.maxWidthPx.lms"
            value={saves.settings.layout.maxWidthPx.lms.toString()}
            onSaveButtonClick={(value) =>
              setSettings("layout", {
                ...saves.settings.layout,
                maxWidthPx: { ...saves.settings.layout.maxWidthPx, lms: parseInt(value, 10) },
              })
            }
          />
          <CustomSwitch
            i18nLabel="optionTitleLmsShowClassroom"
            i18nCaption="optionDescriptionLmsShowClassroom"
            optionId="lms.showClassroom"
            value={saves.settings.lms.showClassroom}
            onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, showClassroom: checked })}
          />
          <CustomSwitch
            i18nLabel="optionTitleLmsHideNoClassDay"
            i18nCaption="optionDescriptionLmsHideNoClassDay"
            optionId="lms.hideNoClassDay"
            value={saves.settings.lms.hideNoClassDay}
            onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, hideNoClassDay: checked })}
          />
          <CustomSwitch
            i18nLabel="文字センタリング"
            i18nCaption="LMSページで、文字を中央揃えにします。"
            optionId="lms.centering"
            value={saves.settings.lms.centering}
            onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, centering: checked })}
          />
        </OptionGroup>
        <OptionGroup i18nTitle="OptionGroupCoursePage">
          <CustomSwitch
            i18nLabel="optionTitleDownloadFileBundle"
            i18nCaption="optionDescriptionDownloadFileBundle"
            optionId="downloadFileBundle"
            value={saves.settings.downloadFileBundle}
            onChange={(_e, checked) => setSettings("downloadFileBundle", checked)}
          />
          <CustomSwitch
            i18nLabel="optionTitleLayoutLinkify"
            i18nCaption="optionDescriptionLayoutLinkify"
            optionId="layout.linkify"
            value={saves.settings.layout.linkify}
            onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, linkify: checked })}
          />
          <CustomSwitch
            i18nLabel="optionTitleMarkdownNotePad"
            i18nCaption="optionDescriptionMarkdownNotePad"
            optionId="markdownNotePad"
            value={saves.settings.markdownNotePad}
            onChange={(_e, checked) => setSettings("markdownNotePad", checked)}
          />
        </OptionGroup>

        <OptionGroup i18nTitle="レイアウト変更">
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
        </OptionGroup>

        <OptionGroup i18nTitle="OptionGroupOthers">
          <CustomSwitch
            i18nLabel="optionTitleModifyClickableLinks"
            i18nCaption="optionDescriptionModifyClickableLinks"
            optionId="modifyClickableLinks"
            value={saves.settings.modifyClickableLinks}
            onChange={(_e, checked) => setSettings("modifyClickableLinks", checked)}
          />
          <CustomSwitch
            i18nLabel="optionTitleLayoutClickToHideName"
            i18nCaption="optionDescriptionLayoutClickToHideName"
            optionId="layout.clickToHideName"
            value={saves.settings.layout.clickToHideName}
            onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, clickToHideName: checked })}
          />
          <CustomSelect
            i18nLabel="optionTitleHeadLinkTo"
            i18nCaption="optionDescriptionHeadLinkTo"
            optionId="headLinkTo"
            options={[
              { value: "/portal/home", label: "ホーム / Top" },
              { value: "/lms/timetable", label: "LMS" },
              { value: "lms/task", label: "課題・テスト一覧 / Assignments" },
            ]}
            value={saves.settings.headLinkTo}
            onChange={(e, _) => setSettings("headLinkTo", e.target.value)}
          />
          <CustomSwitch
            i18nLabel="未提出課題数のバッジ表示"
            i18nCaption="未提出の課題の個数をバッジに表示します。"
            optionId="popupBadge"
            value={saves.settings.popupBadge}
            onChange={(_e, checked) => setSettings("popupBadge", checked)}
          />
          <CustomSwitch
            i18nLabel="S*gsot学番自動入力"
            i18nCaption="S*gsotのログイン時、ユーザー名入力欄に学籍番号を自動入力します。"
            optionId="autoFillSgsot"
            value={saves.settings.autoFillSgsot}
            onChange={(_e, checked) => setSettings("autoFillSgsot", checked)}
          />
        </OptionGroup>
        <CustomSelect
          i18nLabel="科目ページ 使わない教材を自動非表示"
          i18nCaption="教材要素にある様々なもののうち、自動的に非表示にするものを選択します。"
          optionId="autoHideMaterial"
          options={[
            { value: "false", label: "自動的に非表示にしない" },
            { value: "all", label: "全て非表示" },
            { value: "recent", label: "最新のもの以外を非表示" },
          ]}
          value={saves.settings.autoHideMaterial.toString()}
          onChange={(e, _) => setSettings("autoHideMaterial", e.target.value === "false" ? false : e.target.value)}
        />
          <CustomContainerParent
            label="科目ページ要素入れ替え"
            optionId="subjectOrder"
            caption={`科目ページに存在する「担当教員へのメッセージ」「お知らせ」「課題」「教材」「テスト」「アンケート」「ディスカッション」「出席」の各要素を自由に入れ替えします。
                      存在しない要素がある場合はその要素を抜いた状態での並び替えが行われます。`}
          >
            <SortableTable items={items} setItems={setItems} />
          </CustomContainerParent>
      </Stack>
    </Box>
  );
};
