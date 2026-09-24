import Projects from "../../components/templates/prose/prose.component";
import { List } from "../../components/list/list.component";
import { Text } from "../../components/text/text.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import Cover from "../../assets/images/projects/Rosetta/roadshow.png";
import RecitationFigma from "../../assets/images/projects/Rosetta/recitation-figma.png";
import Roadshow from "../../assets/images/projects/Rosetta/roadshow.png";
import Onboarding from "../../assets/images/projects/Rosetta/rosetta onboarding.png";
import Recitation from "../../assets/images/projects/Rosetta/recitation.png";
import CardAudit from "../../assets/images/projects/Rosetta/cards-audit.png";
import CardMisconceptions from "../../assets/images/projects/Rosetta/card-misconceptions.png";
import CardLegacy from "../../assets/images/projects/Rosetta/cards-legacy.png";
import CardFinal from "../../assets/images/projects/Rosetta/cards.png";
import DocumentationBefore from "../../assets/images/projects/Rosetta/documentation before.png";
import DocumentationWeb from "../../assets/images/projects/Rosetta/documentation-web.png";
import DocumentationAfter from "../../assets/images/projects/Rosetta/documentation after.png";
import Popovers from "../../assets/images/projects/Rosetta/popovers.png";
import BorderAudit from "../../assets/images/projects/Rosetta/border.png";
import TokensWorkshop from "../../assets/images/projects/Rosetta/workshop.png";
import TokensBefore from "../../assets/images/projects/Rosetta/old tokens.png";
import TokenMigration from "../../assets/images/projects/Rosetta/token migration.png";
import TokensAfter from "../../assets/images/projects/Rosetta/tokens after.png";

export const Rosetta = () => {
  const Suleiman = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={"https://www.linkedin.com/in/suleiman-shakir/"}
    >
      <Text size="Body-bold" text="📢 Shout out to my homie Suleiman ✌️" />
    </a>
  );
  const summaryText = (
    <div className="summary-text-link">
      <Text
        size="Body"
        text={`Rosetta is the design system at Handshake, a b2b2c student network/job platform and eventual Handshake AI data-labelling platform. The team was small yet mighty: two design technologists — me and Suleiman Ali Shakir, who has become a very close friend over the year we worked together. With about 4 FE platform engineers behind us, the two of us supported ~35 designers, 100+ frontend engineers, and 5+ BUs on a 10+ year old codebase. In that year we shipped bi-weekly Figma library releases, delivered a platform-wide token consolidation and visual language refresh in a single quarter (3 months from leadership workshop to migration), ran two quarters of card parity work across every b2b2c surface, held weekly company-open office hours, ran quarterly onboarding for every new designer and intern, and built Recitation — a Chrome extension plus Figma companion that caught legacy styles and detached components a year before Figma's own 2025 schema announcement.`}
      />
      {Suleiman}
    </div>
  );

  const RosettaContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Shipped bi-weekly Figma library releases serving ~35 designers, 100+ frontend engineers, and 5+ BUs — as 1 of 2 design technologists on the system",
            "Delivered a platform-wide token consolidation and visual language refresh across EPD in a single quarter — 3 months from the leadership workshop to shipped migration — and presented it at EPD All Hands",
            "Ran two quarters of card parity work, auditing card sprawl across the entire b2b2c surface, consolidating one-offs, and realigning Figma functionality with code",
            "Co-created Recitation: a Chrome extension that flags legacy styles, tokens, and components inside a 10+ year old codebase, plus a Figma companion that lints component detaches — built a year ahead of Figma's 2025 schema announcement",
            "Ran quarterly onboarding sessions for every new hire and intern: Intro to Rosetta, How to Dev Mode, and more",
            "Ran weekly office hours, open to the whole company, to share progress, gather feedback, and unblock designers and engineers",
            "Mentored design interns and built a self-serve onboarding Figma file so designer ramp-up scaled past 1:1 time",
            "Triaged bugs, escalations, and daily requests from engineering, product, and design",
            "Consolidated fragmented Figma documentation into one template, with contribution processes for branch review, icon contributions, and more",
            "Contributions: cards, date pickers, tokens, selectInputs, TextInputs/TextAreas + variants, Popovers, and many more",
          ]}
        ></List>,
      ],
    },
    {
      section: "Design system contributions",
      content: [
        <ImageWithCaption
          src={Roadshow}
          caption="Roadshows, quarterly onboarding, and company wide announcements were all done by the amazing Suleiman &Y yours truly"
        />,
        <ImageWithCaption
          src={Onboarding}
          caption="Self serve figma file to help onboard and scale the design team"
        />,
        <ImageWithCaption
          src={Recitation}
          caption="Recitation, a chrome extension, to highlight legacy styling, themes, and non Rosetta components for Handshakes 10+ year old codebase."
        />,
        <ImageWithCaption
          src={RecitationFigma}
          caption="Recitation (Figma companion) to highlight to lint/catch component detaches in Figma - PRE figma schema 2025 announcement!"
        />,
        <ImageWithCaption
          src={CardLegacy}
          caption="Previously, design leadership felt that cards should just be a container, as designers struggled to think systematically"
        />,
        <ImageWithCaption
          src={CardAudit}
          caption="Over time, cards sprawled across the platform: conflicting usecases across the b2b2c surface areas, one-offs were rampant"
        />,
        <ImageWithCaption
          src={CardMisconceptions}
          caption="Parity work was necessary (lasted two quarters) to uncover misconecptions and educate the team on supported functionality"
        />,
        <ImageWithCaption
          src={CardFinal}
          caption="Cards clean up, consolidation, and aligning functionality with code"
        />,
        <ImageWithCaption
          src={DocumentationWeb}
          caption="Documentation in our reference site was fragmented and inconsistent"
        />,
        <ImageWithCaption
          src={DocumentationBefore}
          caption="Same goes for Figma"
        />,
        <ImageWithCaption
          src={DocumentationAfter}
          caption="Updated documentation template for Figma"
        />,
        <ImageWithCaption
          src={Popovers}
          caption="Revamped popovers to consolidate patterns and support FTUX (first time user experience)"
        />,
        <ImageWithCaption
          src={BorderAudit}
          caption="Audit of all the different border radii across the platform, just one screen can show you how much has sprawled"
        />,
        <ImageWithCaption
          src={TokensWorkshop}
          caption="I ran a workshop with the team + Leadership to discuss the direction of our visual language"
        />,
        <ImageWithCaption
          src={TokensBefore}
          caption="Tokens were out of sync with code and had MANY one-offs created"
        />,
        <ImageWithCaption
          src={TokensAfter}
          caption="Tokens were consolidated and we moved towards opacity based greys, an outcome that came out of the workshop: Apple-inspired design aesthetics"
        />,
        <ImageWithCaption
          src={TokenMigration}
          caption="Tokens were delivered within 3 months after the workshop"
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Rosetta"
      date="August 2024 - September 2025"
      summary={summaryText}
      image={Cover}
      image_caption="Rosetta roadshow Hero card displaying components"
      content={RosettaContent}
    />
  );
};

export default Rosetta;
