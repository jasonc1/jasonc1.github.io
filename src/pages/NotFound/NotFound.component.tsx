import React from "react";
import { Text } from "../../components/text/text.component";
import "./NotFound.style.scss";

const headline = "Page not found!";
const blurb =
  "You probably hit a broken link or tried link hopping - please press the back button on your browser. ";

export const NotFound = () => {
  return (
    <>
      <div className="not-found">
        <Text size="Header" text="[ 404 ] You stepped out of bounds /" />
      </div>
    </>
  );
};

export default NotFound;
