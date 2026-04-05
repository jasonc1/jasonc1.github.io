import type { JSX } from "react";
export type typeSizes = "Display" | "Subheader" | "Header" | "Body" | "Body-bold";
export interface ITextProps {
  color?: string;
  size: typeSizes;
  text: string | JSX.Element;
  textAlign?: "left" | "center" | "right";
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  id?: string;
  caps?: boolean;
  weight?: "light" | "regular" | "medium";
}

export interface ITextStyles {
  color?: string;
  textAlign?: "left" | "center" | "right";
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  textTransform?: "uppercase" | "none";
  fontWeight?: number;
}
