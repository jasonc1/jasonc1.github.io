import { Link } from "react-router-dom";
import { Text } from "../text/text.component";
import resume from "../../assets/misc/jason_chen_resume.pdf";

export const ContactBlock = () => {
  return (
    <div className="contact-block">
      <div className="block-header">
        <Text size="Header" text="Drop a line /" />
        <a href="mailto:jasonc1@alumni.cmu.edu" target="_blank">
          <Text size="Header" text="jasonc1@alumni.cmu.edu" />
        </a>
      </div>
      <Text size="Body-bold" text="You can find me here as well /" />

      <div className="contact-block-body">
        <a
          className="contact-links"
          href="https://github.com/jasonc1"
          target="_blank"
        >
          <Text size="Body-bold" text="Github" />
        </a>
        <a
          className="contact-links"
          href="https://www.linkedin.com/in/jchen10"
          target="_blank"
        >
          <Text size="Body-bold" text="LinkedIn" />
        </a>
      </div>

      <div className="contact-block-body">
        <Link className="contact-links" to={resume} target="_blank">
          <Text size="Body-bold" text="Resume" />
        </Link>
        <a
          className="contact-links"
          href="https://www.instagram.com/me.dium/"
          target="_blank"
        >
          <Text size="Body-bold" text="Instagram" />
        </a>
      </div>
    </div>
  );
};
