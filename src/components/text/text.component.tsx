import React from "react";
import { ITextProps, ITextStyles } from "./text.model";
import "./text.style.scss";
import classNames from "classnames";
import { highlightMetrics } from "../../utils/highlightMetrics";

export const Text = ({
  textAlign = "left",
  color,
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
  // Only set colour when a caller asks for one. A blanket inline `color:
  // inherit` outranks every stylesheet rule, which is why prose tone had to be
  // done with opacity before — and opacity on a parent cannot be undone by a
  // child, so a metric could never return to full black.
  const textStyles: ITextStyles = {
    textAlign,
    ...(color ? { color } : {}),
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
    Caption: size === "Caption",
  });

  const body = typeof text === "string" ? highlightMetrics(text) : text;

  const renderText = (size: string) => {
    if (size === "Display") {
      return (
        <h1 id={id} className={textClass} style={textStyles}>
          {body}
        </h1>
      );
    } else if (size === "Subheader" || size === "Header") {
      return (
        <span id={id} className={textClass} style={textStyles}>
          {body}
        </span>
      );
    } else {
      return (
        <p id={id} className={textClass} style={textStyles}>
          {body}
        </p>
      );
    }
  };

  return <>{renderText(size)}</>;
};
