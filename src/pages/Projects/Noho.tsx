import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import { Text } from "../../components/text/text.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import numbers from "../../assets/images/projects/Noho/numbers.png";
import oneConfig from "../../assets/images/projects/Noho/one-config.png";
import brandSwap from "../../assets/images/projects/Noho/brand-swap.png";
import alunaIntake from "../../assets/images/projects/Noho/aluna-intake.png";
import storybookProductTile from "../../assets/images/projects/Noho/storybook-producttile.png";
import adminBeforeAfter from "../../assets/images/projects/Noho/admin-before-after.png";
import redesignRollout from "../../assets/images/projects/Noho/redesign-rollout.png";
import composer from "../../assets/images/projects/Noho/composer.png";

export const Noho = () => {
  const summaryText = `Employee #3 and founding design engineer at NOHO Labs, on one condition:
      design would own the design system. A year in — $3M+ ARR, 500+ users, 2
      brands, 15 FTE. I architected the frontend and built Pegasus, the themeable
      design system underneath both brands, then used it to ship the second
      entity 0 to 1 in 2 months without touching a single existing component.
      The through-line: the prototype stopped being a mock of the build and
      became the build.`;

  const NohoContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Employee #3 and founding design engineer — architected the frontend for a $3M+ ARR platform",
            "500+ users across 2 brands, on one themeable design system",
            "ALUNA shipped 0 → 1 in 2 months, with 0 changes to existing components",
            "Brand 2.0 across login, portal, care plans and admin — as the only designer",
            "Patient portal redesign: ~2 weeks prototyping in code, 1 week to build and test",
            "18 agent skills — design system (5), product (4), marketing (3), quality (3), bugs (3)",
            "~2 months from first prompt to owning the design system alone",
            "agents-memory — a shared vault that onboarded 2 new devs onto the system, not onto me",
            "Engineers now ship UI against Pegasus without me in the loop",
          ]}
        ></List>,
      ],
    },
    {
      section: "Problem",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={`Modern healthcare is reactive. NOHO Labs (an 8VC Build company) exists to
        make it preventative — which means earning trust before revenue, inside
        real constraints: clinical safety and a regulatory floor that is a
        foundation rather than an obstacle.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`The complication was headcount: one designer, a handful of engineers, two
        brands, and a roadmap that never paused. A design system is the obvious
        answer to that math — but not the usual version, where you build the
        system first and the product second. Everything had to arrive as a
        by-product of shipping something real.`}
        />,
      ],
    },
    {
      section: "Design tokens & theming",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={`When a creative director joined, the brand became a real stance rather than
        a palette and a logo, and the platform had to support a theme. The app had
        been deliberately dialled back until then — all focus on UX, robustness,
        and staying updatable through components rather than by hand. That
        restraint is what made a theme possible at all.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`A brand is a single config file. Components never know which brand they are
        in, and an ALUNA build never contains a NOHO value. CSS variables carry the
        look, injected before first paint — no flash of NOHO styling on a partner
        build. React context carries the content, read through useBrand(). No
        inheritance helper, no shared base, no deep merge: TypeScript turns an
        omission into a compile error, and a CI guard catches NOHO strings leaking
        into a partner file.`}
        />,
        <ImageWithCaption
          src={oneConfig}
          caption="noho.ts at 240 lines beside aluna.ts at 482 — the same keys, and not one shared line between them."
        />,
        <ImageWithCaption
          src={brandSwap}
          caption="The same intake component with the same test data, rendered under each brand. Only the tokens moved."
        />,
        <ImageWithCaption
          src={alunaIntake}
          caption="ALUNA's typography and palette on NOHO's intake flow — a different company, different fonts, different legal copy, same components underneath."
        />,
      ],
    },
    {
      section: "Components & Storybook",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={`The system makes the UI decisions; teams make the UX decisions. Components
        are presentational only — no business or clinical logic — so application
        code keeps behaviour and workflow. Content arrives through children and
        named slots: the component owns layout, the app owns words and data. That
        is what keeps a refactor 1:1 — swap the markup, and the patient experience
        does not move.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`"Patient care comes first" is a spec, not a slogan: every edge case is a
        patient, which makes loading, empty and error states product surfaces
        rather than afterthoughts. Escape hatches are governed too — overrides
        start at the colour and cascade, move to the role when no colour fits, and
        components expose exactly one styling entry point, applied last. An
        override that keeps recurring gets promoted into a variant or a token.`}
        />,
        <ImageWithCaption
          src={storybookProductTile}
          caption="ProductTile in Storybook — real content, responsive variants, and the props table below. Components get designed in the catalog rather than next to it."
        />,
      ],
    },
    {
      section: "Design at scale",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={`What compounds is not the components — it is that the second time costs
        less than the first. Three skills came out of the ideation period, each one
        existing because the last made the next bottleneck obvious: a Storybook
        skill, then prompting to fix components against the catalog, then
        /frontend, which the brand rollout stress-tested into something usable by
        someone other than me.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`That last one is the unlock. A designer prototyping in code only helps once
        — the handoff is still a translation, and translation is where fidelity
        dies. Making the prototype executable by someone else changes the shape of
        the team: an engineer shipped end-to-end dose-protocol tracking from a few
        Figma screens, with agents building and them handling the integration.
        Their words for it: "design-system rigor without internalizing every rule
        first." That is the line between personal tooling and team
        infrastructure.`}
        />,
        <ImageWithCaption
          src={adminBeforeAfter}
          caption="Admin operations before and after the refactor — the same data, rebuilt on system components."
        />,
        <ImageWithCaption
          src={redesignRollout}
          caption="Brand 2.0 across login, portal, care plans, and admin. Running it through the skills rather than by hand is also what hardened the skills — every rough edge surfaced under real load."
        />,
        <ImageWithCaption
          src={composer}
          caption="Composer — marketing pages as a config array. Sections toggle, re-theme, and re-copy from data, so page changes stopped queueing behind a developer."
        />,
      ],
    },
    {
      section: "What I'd do differently",
      content: [
        <List
          size="Body"
          listItems={[
            "Agentation — some way to tag a piece of UI and refine it right there, in place",
            "Code Connect plus a console MCP, to tighten the Figma ↔ code ↔ browser loop",
            "Backend-less prototyping, earlier — stop waiting on real data to start moving",
          ]}
        ></List>,
      ],
    },
  ];

  return (
    <Projects
      title="Eterna & Pegasus DS"
      date="September 2025 - Present"
      summary={summaryText}
      image={numbers}
      image_caption="A small but mighty team, one year in"
      content={NohoContent}
    />
  );
};

export default Noho;
