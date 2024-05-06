import { Dispatch, SetStateAction } from "react";

export interface INavProps {
  screenWidth: number;
  showMenu: boolean;
  navItems: string[];
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  customScrollTo: (id: string) => void;
}
