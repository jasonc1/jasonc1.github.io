import { IProjectsProps } from "./prose.model";
import { Text } from "../../text/text.component";
import { theme } from "../../../colors.js";
import { formatDateRange } from "../../../utils/formatDateRange";
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
          <Text size="Body" text={formatDateRange(date)} weight="light" />
        </div>

        <div className="prose-summary">
          <Text size="Body" text={summary} marginBottom={8} />
        </div>
      </div>
      {content.map((c) => {
        if (c.section && c.content) {
          const slug = c.section
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          return (
            <div className={`prose-block prose-block--${slug}`} key={slug}>
              <Text size="Header" caps text={c.section} />
              {c.content.map((contentBlock) => {
                return contentBlock;
              })}
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Prose;
