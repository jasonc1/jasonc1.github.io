import React from "react";
import { Text } from "../text/text.component";
import { Subject } from "../subject/subject.component";
import { SubjectLinks } from "../subject-links/subject-links.component";

const InstagramLink = (
  <a
    className="action-link"
    target="_blank"
    rel="noreferrer"
    href={"https://www.instagram.com/me.dium"}
  >
    <Text size="Body-bold" text="Instagram" />
  </a>
);

const photographyDescription: JSX.Element = (
  <div>
    I’ve been shooting photography for a few years now - let’s say 8 years to
    keep it simple. I’ve done everything from sports photography at CMU to event
    photography and much more. As of the last few years, I started shooting
    analogue (film) phtography as I can really focus in on composing a shot and
    spend less time editing on the computer and more time outside taking
    landscape photographs. You can also find me on {InstagramLink} to see my
    latest film scans.
  </div>
);

export const Photography = () => {
  return (
    <Subject title="Photography" description={photographyDescription}>
      <SubjectLinks
        projects={[
          {
            name: "Personal work",
            link: "photography",
            external: false,
          },
        ]}
      />
    </Subject>
  );
};

export default Photography;
