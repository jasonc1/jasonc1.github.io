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
}: ITextProps) => {
  const textStyles: ITextStyles = {
    textAlign,
    color,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  };

  const textClass = classNames("text", {
    Display: size === "Display",
    Header: size === "Header",
    Body: size === "Body",
    "Body-bold": size === "Body-bold",

    // "display-1": size === "display-1",
    // "display-2": size === "display-2",
    // "header-1": size === "header-1",
    // "subheader-1": size === "subheader-1",
    // "body-1": size === "body-1",
    // "body-2": size === "body-2",
    // "link-1": size === "link-1",
    // "link-2": size === "link-2",
  });

  const renderText = (size: string) => {
    if (size === "Display") {
      return (
        <h1 id={id} className={textClass} style={textStyles}>
          {text}
        </h1>
      );
    } else if (size === "Header") {
      return (
        <h2 id={id} className={textClass} style={textStyles}>
          {text}
        </h2>
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
