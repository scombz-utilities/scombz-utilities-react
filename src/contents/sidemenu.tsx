import { Box, List, Drawer, Divider, ListItem, ListItemText, ListItemButton, IconButton } from "@mui/material";
import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect, useState, useMemo } from "react";
import { GrMenu } from "react-icons/gr";
// import { defaultSaves } from "./util/settings";
import { sideMenuLogic, getSideMenuList } from "./util/sideMenuLogic";

export const config: PlasmoCSConfig = {
  matches: ["https://scombz.shibaura-it.ac.jp/*"],
  run_at: "document_end",
};

const sideMenu = () => {
  useEffect(() => {
    sideMenuLogic();
  }, []);

  const sideMenuList = useMemo(() => getSideMenuList(), []);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open?: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    const o = open === undefined ? !isOpen : open;
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsOpen(o);
  };

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {sideMenuList.map((item, index) => {
          if (item == "divider") {
            return (
              <Box my={1} key={"divider" + index}>
                <Divider />
              </Box>
            );
          } else {
            return (
              <ListItem key={item.name + item.iconClass} disablePadding>
                <ListItemButton>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={isOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      <IconButton onClick={toggleDrawer()} size="large">
        <GrMenu />
      </IconButton>
    </div>
  );
};

export default sideMenu;
