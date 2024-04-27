export type menuItem =
  | {
      name: string;
      url: string;
      iconClass: string | null;
    }
  | "divider";
