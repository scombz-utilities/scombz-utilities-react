import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, Box } from "@mui/material";
import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect, useState, useMemo } from "react";
import { MdOutlineNoteAdd } from "react-icons/md";
import { OriginalTaskModal } from "./components/originalTaskModal";
import { getCourseTitle, jsxToHtml } from "./util/functions";
import theme, { darkTheme } from "~/theme";
import { defaultSaves, type Saves } from "~settings";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/lms/course*"],
  run_at: "document_end",
};

const insertAddTaskButton = async (openModal: () => void) => {
  const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
  if (!currentData.settings.useTaskList) return;
  const button = (
    <>
      <link href={chrome.runtime.getURL("css/addTaskButton.css")} rel="stylesheet" />
      <div className="scombzUtilitiesAddTaskButton" title={chrome.i18n.getMessage("OriginalTaskAdd")}>
        <MdOutlineNoteAdd />
      </div>
    </>
  );
  const buttonHtml = jsxToHtml(button);
  const target = document.querySelector("#report > .block-title") as HTMLDivElement;
  if (!target) return;
  target.insertAdjacentHTML("beforeend", buttonHtml);
  document.querySelector(".scombzUtilitiesAddTaskButton")?.addEventListener("click", () => {
    openModal();
  });
};

const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement,
});

export const getStyle = () => styleElement;

const AddTask = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const course = useMemo(() => getCourseTitle(), []);
  const courseURL = useMemo(() => window.location.href, []);

  useEffect(() => {
    insertAddTaskButton(() => setIsModalOpen(true));
    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      setIsDarkMode(currentData.settings.darkMode);
    });
  }, []);

  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
        <Box>
          <OriginalTaskModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            onClose={() => {}}
            course={course}
            courseURL={courseURL}
          />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default AddTask;
