import { Box, ButtonGroup, Collapse, IconButton, Typography, Paper, Link } from "@mui/material";
import { useState, useEffect } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdAdd } from "react-icons/md";
import { RiEarthFill } from "react-icons/ri";
import { AddLinkModal } from "./AddLinkModal";
import type { Saves } from "~settings";
import { defaultSaves } from "~settings";

export type LinkItemProps = {
  title: string;
  url: string;
};
const LinkItem = (props: LinkItemProps) => {
  const { title, url } = props;
  const origin = new URL(url).origin;
  const [isFaviconError, setIsFaviconError] = useState<boolean>(false);
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Paper
        sx={{
          py: 1,
          px: 0.5,
          minWidth: "60px",
          maxWidth: "90px",
          height: "50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Box width="28px" height="28px" overflow="hidden">
          {isFaviconError && (
            <Box
              width="28px"
              height="28px"
              color="text.secondary"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <RiEarthFill fontSize="24px" />
            </Box>
          )}
          <Box width="28px" height="28px" display="flex" justifyContent="center" alignItems="center">
            <img
              src={`${origin}/favicon.ico`}
              width="24px"
              height="24px"
              onError={() => setIsFaviconError(true)}
              hidden={isFaviconError}
            />
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{ textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", textAlign: "center" }}
        >
          {title}
        </Typography>
      </Paper>
    </Link>
  );
};

export const Links = () => {
  const [isLinksOpen, setIsLinksOpen] = useState<boolean>(true);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState<boolean>(false);
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const toggleOpen = () => {
    setIsLinksOpen(!isLinksOpen);
  };
  useEffect(() => {
    const fetching = async () => {
      const currentData = (await chrome.storage.local.get(defaultSaves)) as Saves;
      setLinks(currentData.settings.originalLinks);
      setIsDarkMode(currentData.settings.darkMode);
    };
    fetching();
  }, []);
  return (
    <>
      <Box
        width="calc(100% - 16px)"
        m="0 auto"
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: isDarkMode ? "#333840cc" : "#ddda",
          color: isDarkMode ? "#ccccce" : "inherit",
          backdropFilter: "blur(6px)",
          padding: 1,
          borderRadius: 1,
        }}
      >
        <Box position="relative">
          <Typography variant="h6" sx={{ px: 0.5, textAlign: "left", fontSize: "16px" }}>
            {chrome.i18n.getMessage("WidgetLinks")}
          </Typography>
          <ButtonGroup sx={{ position: "absolute", top: 0, right: 0 }}>
            <IconButton size="small" onClick={() => setIsAddLinkModalOpen(true)}>
              <MdAdd />
            </IconButton>
            <IconButton onClick={toggleOpen} size="small">
              {isLinksOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </IconButton>
          </ButtonGroup>
        </Box>
        <Collapse in={isLinksOpen} timeout="auto">
          <Box sx={{ display: "flex", gap: 1, flexDirection: "row", flexWrap: "wrap", mt: 0.5 }}>
            {links.map((link, index) => (
              <LinkItem key={index} title={link.title} url={link.url} />
            ))}
            {links.length === 0 && (
              <Paper
                sx={{
                  py: 1,
                  px: 1,
                  minWidth: "60px",
                  maxWidth: "90px",
                  height: "50px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => setIsAddLinkModalOpen(true)}
              >
                <Box
                  width="28px"
                  height="28px"
                  fontSize="24px"
                  color="text.secondary"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <MdAdd />
                </Box>
                <Typography variant="caption" sx={{ textAlign: "center" }}>
                  {chrome.i18n.getMessage("WidgetLinksAdd")}
                </Typography>
              </Paper>
            )}
          </Box>
        </Collapse>
      </Box>
      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        setIsOpen={setIsAddLinkModalOpen}
        onClose={(res) => {
          if (!res?.title || !res?.url) return;
          setLinks([...links, { title: res.title, url: res.url }]);
        }}
      />
    </>
  );
};
