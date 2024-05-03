import React from "react";
import { Text } from "../../components/text/text.component";
import "./NotFound.style.scss";
import { theme } from "../../colors.js";

const headline = "Page not found!";
const blurb =
  "You probably hit a broken link or tried link hopping - please press the back button on your browser. ";

export const NotFound = () => {
  return (
    <>
      <p style={{ marginTop: 400 }}>this is a test</p>
    </>
  );
};

export default NotFound;
