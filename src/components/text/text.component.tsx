import React from "react";
import { ITextProps, ITextStyles } from "./text.model";
import "./text.style.scss";
import classNames from "classnames";

export const Text = ({
  textAlign = "left",
  color = "inherit",
  id,
  size,
  text,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  caps,
  weight,
}: ITextProps) => {
  const textStyles: ITextStyles = {
    textAlign,
    color,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    textTransform: caps ? "uppercase" : undefined,
    fontWeight: weight === "medium" ? 400 : weight === "regular" ? 400 : weight === "light" ? 300 : undefined,
  };

  const textClass = classNames("text", {
    Display: size === "Display",
    Subheader: size === "Subheader",
    Header: size === "Header",
    Body: size === "Body",
    "Body-bold": size === "Body-bold",
  });

  const renderText = (size: string) => {
    if (size === "Display") {
      return (
        <h1 id={id} className={textClass} style={textStyles}>
          {text}
        </h1>
      );
    } else if (size === "Subheader" || size === "Header") {
      return (
        <span id={id} className={textClass} style={textStyles}>
          {text}
        </span>
      );
    } else {
      return (
        <p id={id} className={textClass} style={textStyles}>
          {text}
        </p>
      );
    }
  };

  return <>{renderText(size)}</>;
};
