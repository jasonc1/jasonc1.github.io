export interface ITextProps {
  color?: string;
  size:
    | 'display-1'
    | 'display-2'
    | 'header-1'
    | 'subheader-1'
    | 'body-1'
    | 'body-2'
    | 'link-1'
    | 'link-2';
  text: string | JSX.Element;
  textAlign?: 'left' | 'center' | 'right';
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
}

export interface IStyles {
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
}
