import { Text } from "../text/text.component";
import self from "../../assets/images/photos/self.jpg";

export const AboutBlock = () => {
  return (
    <div className="about-block">
      <div className="block-header">
        <Text size="Header" text="//" />
        <Text size="Header" text="I go by jsn" />
      </div>
      <div className="about-block-body">
        <div id="self-blurb">
          <Text
            size="Body"
            text="I am a Design Technologist with prior professional experience as a UI developer, and I enjoy helping build scalable design systems by working at the intersection of design and code."
          />
        </div>

        <img src={self} />
      </div>
    </div>
  );
};
