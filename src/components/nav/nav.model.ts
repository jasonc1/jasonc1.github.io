import { Dispatch, SetStateAction } from "react";

export interface INavProps {
  screenWidth: number;
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  customScrollTo: (id: string) => void;
}
