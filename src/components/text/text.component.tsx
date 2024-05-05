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
