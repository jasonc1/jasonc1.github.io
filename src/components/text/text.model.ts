export type typeSizes = "Display" | "Header" | "Body" | "Body-bold";
export interface ITextProps {
  color?: string;
  size: typeSizes;
  text: string | JSX.Element;
  textAlign?: "left" | "center" | "right";
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
}

export interface ITextStyles {
  color?: string;
  textAlign?: "left" | "center" | "right";
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
}
