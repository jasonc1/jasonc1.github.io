import { Text } from "../text/text.component";
import self from "../../assets/images/photos/self.jpg";

export const AboutBlock = () => {
  return (
    <div className="about-block">
      <div className="block-header">
        <Text size="Header" text="I go by JSN" />
      </div>
      <div className="about-block-body">
        <div id="self-blurb">
          <Text
            size="Body"
            text="I am a product designer / design technologist with extensive Design System, Product Design, and Front-End Engineering experience."
          />
          <Text
            size="Body"
            text="I enjoy helping build scalable design systems by working at the intersection of design and code - comfortable with debugging UI issues, prototyping, and designing + implementing components.
"
          />
        </div>

        <img src={self} />
      </div>
    </div>
  );
};
