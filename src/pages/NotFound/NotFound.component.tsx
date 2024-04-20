import React from "react";
import { Text } from "../../components/text/text.component";
import "./NotFound.style.scss";
import { theme } from "../../colors.js";

const headline = "Page not found!";
const blurb =
  "You probably hit a broken link or tried link hopping - please press the back button on your browser. ";

export const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <Text
          size="Display"
          color={theme.accent}
          text={headline}
          marginBottom={16}
        />
        <Text size="Body" color={theme.accent} text={blurb} marginBottom={16} />
      </div>
    </div>
  );
};

export default NotFound;
