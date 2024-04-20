import React from "react";
import { Text } from "../../components/text/text.component";
import "./UnderConstruction.style.scss";
import { theme } from "../../colors.js";

const headline = "Under Construction!";
const blurb =
  "This content is coming soon, and I am currently hard at work writing it. If you'd like to chat specifically about a certain topic, please contact me.";

export const UnderConstruction = () => {
  return (
    <div className="under-construction">
      <div className="under-construction-content">
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

export default UnderConstruction;
