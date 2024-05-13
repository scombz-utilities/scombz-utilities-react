import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { CustomRemovableList } from "./CustomRemovableList";
import { CustomSelect } from "./CustomSelect";
import { CustomSwitch } from "./CustomSwitch";
import { CustomTextField } from "./CustomTextField";
import { OptionGroup } from "./OptionGroup";
import { CustomWidgetSort } from "./WidgetOptions";

import type { Saves, Settings } from "~settings";

type Props = {
  saves: Saves;
  setSettings: (key: keyof Settings, value: unknown) => void;
};
export const RecommendedOptions = (props: Props) => {
  const { saves, setSettings } = props;
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
    <Box>
      <Typography variant="h5">{chrome.i18n.getMessage("RecommendedOptions")}</Typography>
      <Stack gap={1} py={1}>
        <OptionGroup title={chrome.i18n.getMessage("OptionGroupSyllabusLinking")}>
          <CustomSelect
            label={chrome.i18n.getMessage("optionTitleFaculty")}
            optionId="faculty"
            caption={chrome.i18n.getMessage("optionDescriptionFaculty")}
            options={
              chrome.i18n.getUILanguage() === "ja"
                ? [
                    { value: "din", label: "大学院" },
                    { value: "ko1", label: "工学部" },
                    { value: "sys", label: "システム理工学部" },
                    { value: "dsn", label: "デザイン工学部" },
                    { value: "arc", label: "建築学部" },
                  ]
                : [
                    { value: "din", label: "Master / Doctor" },
                    { value: "ko1", label: "Engineering" },
                    { value: "sys", label: "System Engineering and Science" },
                    { value: "dsn", label: "Engineering and Design" },
                    { value: "arc", label: "Architecture" },
                  ]
            }
            value={saves.settings.faculty}
            onChange={(e, _) => setSettings("faculty", e.target.value)}
          />
        </OptionGroup>
        <OptionGroup title={chrome.i18n.getMessage("OptionGroupAutomaticLogin")}>
          <CustomTextField
            label={chrome.i18n.getMessage("optionTitleStudentID")}
            caption={chrome.i18n.getMessage("optionDescriptionStudentID")}
            optionId="loginData.username"
            value={saves.settings.loginData.username.split("@")[0]}
            onChange={(e) => {
              const username = e.target.value.includes("@") ? e.target.value : e.target.value + "@sic";
              setSettings("loginData", { ...saves.settings.loginData, username });
            }}
          />
          <CustomTextField
            label={chrome.i18n.getMessage("optionTitlePassword")}
            type="password"
            caption={chrome.i18n.getMessage("optionDescriptionPassword")}
            optionId="loginData.password"
            value={saves.settings.loginData.password}
            onChange={(_event) =>
              setSettings("loginData", { ...saves.settings.loginData, password: _event.target.value })
            }
          />
        </OptionGroup>

        <OptionGroup title={chrome.i18n.getMessage("OptionGroupWidget")}>
          <CustomWidgetSort saves={saves} setSettings={setSettings} />
          <CustomRemovableList
            label={chrome.i18n.getMessage("optionTitleHiddenTaskList")}
            optionId="hiddenTaskIdList"
            caption={chrome.i18n.getMessage("optionDescriptionHiddenTaskList")}
            options={hiddenTaskList}
            onChange={(idx) => {
              const newIds = saves.settings.hiddenTaskIdList.filter((_, i) => i !== idx);
              setSettings("hiddenTaskIdList", newIds);
            }}
            reset={() => setSettings("hiddenTaskIdList", [])}
          />
          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleDisplayClassroom")}
            caption={chrome.i18n.getMessage("optionDescriptionDisplayClassroom")}
            optionId="displayClassroom"
            value={saves.settings.displayClassroom}
            onChange={(_e, checked) => setSettings("displayClassroom", checked)}
          />
          <CustomSelect
            label={chrome.i18n.getMessage("optionTitleTimeTableTopDate")}
            caption={chrome.i18n.getMessage("optionDescriptionTimeTableTopDate")}
            optionId="timeTableTopDate"
            value={saves.settings.timeTableTopDate.toString()}
            options={[
              { value: "date", label: "日付 / Date" },
              { value: "time", label: "時刻（秒単位）/ Time in seconds" },
              { value: "false", label: "非表示 / Hidden" },
            ]}
            onChange={(e, _) => setSettings("timeTableTopDate", e.target.value === "false" ? false : e.target.value)}
          />
        </OptionGroup>

        <OptionGroup title="LMS">
          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleLmsShowClassroom")}
            caption={chrome.i18n.getMessage("optionDescriptionLmsShowClassroom")}
            optionId="lms.showClassroom"
            value={saves.settings.lms.showClassroom}
            onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, showClassroom: checked })}
          />
          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleLmsHideNoClassDay")}
            caption={chrome.i18n.getMessage("optionDescriptionLmsHideNoClassDay")}
            optionId="lms.hideNoClassDay"
            value={saves.settings.lms.hideNoClassDay}
            onChange={(_e, checked) => setSettings("lms", { ...saves.settings.lms, hideNoClassDay: checked })}
          />
        </OptionGroup>

        <OptionGroup title={chrome.i18n.getMessage("OptionGroupCoursePage")}>
          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleDownloadFileBundle")}
            caption={chrome.i18n.getMessage("optionDescriptionDownloadFileBundle")}
            optionId="downloadFileBundle"
            value={saves.settings.downloadFileBundle}
            onChange={(_e, checked) => setSettings("downloadFileBundle", checked)}
          />

          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleLayoutLinkify")}
            caption={chrome.i18n.getMessage("optionDescriptionLayoutLinkify")}
            optionId="layout.linkify"
            value={saves.settings.layout.linkify}
            onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, linkify: checked })}
          />
          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleMarkdownNotePad")}
            caption={chrome.i18n.getMessage("optionDescriptionMarkdownNotePad")}
            optionId="markdownNotePad"
            value={saves.settings.markdownNotePad}
            onChange={(_e, checked) => setSettings("markdownNotePad", checked)}
          />
        </OptionGroup>

        <OptionGroup title={chrome.i18n.getMessage("OptionGroupOthers")}>
          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleModifyClickableLinks")}
            caption={chrome.i18n.getMessage("optionDescriptionModifyClickableLinks")}
            optionId="modifyClickableLinks"
            value={saves.settings.modifyClickableLinks}
            onChange={(_e, checked) => setSettings("modifyClickableLinks", checked)}
          />
          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleForceDragAndDropSubmit")}
            caption={chrome.i18n.getMessage("optionDescriptionForceDragAndDropSubmit")}
            optionId="forceDragAndDropSubmit"
            value={saves.settings.forceDragAndDropSubmit}
            onChange={(_e, checked) => setSettings("forceDragAndDropSubmit", checked)}
          />
          <CustomSwitch
            label={chrome.i18n.getMessage("optionTitleLayoutClickToHideName")}
            caption={chrome.i18n.getMessage("optionDescriptionLayoutClickToHideName")}
            optionId="layout.clickToHideName"
            value={saves.settings.layout.clickToHideName}
            onChange={(_e, checked) => setSettings("layout", { ...saves.settings.layout, clickToHideName: checked })}
          />
          <CustomSelect
            label={chrome.i18n.getMessage("optionTitleHeadLinkTo")}
            caption={chrome.i18n.getMessage("optionDescriptionHeadLinkTo")}
            optionId="headLinkTo"
            options={[
              { value: "/portal/home", label: "ホーム / Top" },
              { value: "/lms/timetable", label: "LMS" },
              { value: "lms/task", label: "課題・テスト一覧 / Assignments" },
            ]}
            value={saves.settings.headLinkTo}
            onChange={(e, _) => setSettings("headLinkTo", e.target.value)}
          />
        </OptionGroup>
      </Stack>
    </Box>
  );
};
