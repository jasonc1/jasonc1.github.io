import React from "react";
import { ISubjectProps, ISubjectStyles } from "./subject.model";
import "./subject.style.scss";
import { Text } from "../text/text.component";
import { theme } from "../../colors.js";

export const Subject = ({
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  title,
  description,
  children,
}: ISubjectProps) => {
  const subjectStyles: ISubjectStyles = {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  };

  return (
    <div className="subject" style={subjectStyles}>
      <Text
        size="Display"
        text={title}
        color={theme.accent}
        marginBottom={32}
      />
      <Text
        size="Body"
        text={description}
        color={theme.white}
        marginBottom={8}
      />
      {children}
    </div>
  );
};
