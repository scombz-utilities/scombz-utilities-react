import type { menuItem } from "../types/sidemenu.type";

export const hideSideMenu = async () => {
  const sidemenu = document.querySelector("body #contentsWrapper #sidemenu") as HTMLElement;
  const pagemain = document.querySelector("body #contentsWrapper #pageMain") as HTMLElement;
  if (!sidemenu || !pagemain) return;
  sidemenu.style.display = "none";
  pagemain.style.width = "100%";
  pagemain.style.transition = "none";
  pagemain.style.position = "absolute";
  pagemain.style.left = "0";
};

export const getSideMenuList = (): null | menuItem[] => {
  const sidemenu = document.querySelector("body #contentsWrapper #sidemenu") as HTMLElement;
  if (!sidemenu) return;
  const list = sidemenu.querySelectorAll("a.sidemenu-link,br") as NodeListOf<HTMLAnchorElement>;
  const menuItemList: menuItem[] = [...list].map((item) => {
    if (item.tagName === "BR") {
      return "divider";
    }
    const classes = item.getAttribute("class").split(/\s/);
    const regex = /[A-Za-z0-9\-]+-icon/;
    const match = classes.find((cls) => cls.match(regex) && cls !== "sidemenu-icon");
    return {
      name: item.textContent,
      url: item.href,
      iconClass: match ?? null,
    };
  });
  return menuItemList;
};

export const sideMenuLogic = async () => {
  console.log(getSideMenuList());
};
