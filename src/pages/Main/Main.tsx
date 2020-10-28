import React from 'react';
import { Text } from '../../components/text/text.component';
import './main.style.scss';
import { theme } from '../../colors.js';
import { Nav } from '../../components/nav/nav.component';
import { Rule } from '../../components/rule/rule.component';
import { Footer } from '../../components/footer/footer.component';

export const Main = () => {
  return (
    <div className="main" id="main-selector">
      <Nav />
      <div className="about main-container" id="scroll-about">
        <div className="about-content">
          <Text
            size="display-1"
            color={theme.accent}
            text="I’m a design technologist, sneakerhead, mechanical keyboard enthusiast, and photographer."
            marginBottom={32}
          />
          <Text
            size="body-1"
            color={theme.accent}
            text="Hi, I’m Jason. I used to be a developer, but now I sit at the intersection of design and code. My passion is building and maintaining design systems at the moment, and on the side I sometimes create tools for design ops, create high fidelity prototypes, contribute documentation, evangelize Figma features, and much more. "
            marginBottom={24}
          />
          <Text
            size="body-1"
            color={theme.accent}
            text="I currently work at Blend as a Design Technologist frontlining the Alchemy Design Systems effort. I graduated from  Carnegie Mellon University with a B.S in Information Systems and an additional B.S. in  Human Computer Interaction. "
          />
        </div>
      </div>
      <div className="projects main-container" id="scroll-projects">
        <Text
          size="display-1"
          color={theme.accent}
          text="Design Systems"
          marginBottom={32}
        />
        <Rule />
      </div>
      <div className="photography main-container" id="scroll-photography">
        <Text
          size="display-1"
          color={theme.accent}
          text="Photography"
          marginBottom={32}
        />
      </div>
      <div className="contact main-container" id="scroll-contact">
        <div>
          <Text
            size="display-1"
            color={theme.accent}
            text="Contact"
            marginBottom={32}
          />
        </div>

        <Footer color={theme.accent} />
      </div>
    </div>
  );
};
