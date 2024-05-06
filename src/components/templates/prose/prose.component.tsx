import React from "react";
import { IProjectsProps } from "./prose.model";
import { Text } from "../../text/text.component";
import { Footer } from "../../footer/footer.component";
import { theme } from "../../../colors.js";
import "./prose.style.scss";

export const Prose = ({
  content,
  image,
  image_caption,
  date,
  summary,
  title,
}: IProjectsProps) => {
  return (
    <div className="prose">
      <div className="prose-block">
        {image ? <img src={image} alt={image_caption} /> : <br />}
        <div className="block-header">
          <Text size="Display" text={title} />
          <Text size="Body" text={date} marginBottom={16} />
        </div>

        <Text size="Body" text={summary} marginBottom={8} />
      </div>
      {content.map((c) => {
        if (c.section && c.content) {
          return (
            <div className="prose-block">
              <Text
                size="Header"
                color={theme.black}
                text={c.section}
                marginBottom={16}
              />
              {c.content.map((contentBlock) => {
                return contentBlock;
              })}
            </div>
          );
        } else {
          return null;
        }
      })}
      {/* <Footer color={theme.black} marginTop={80} /> */}
    </div>
  );
};

export default Prose;
