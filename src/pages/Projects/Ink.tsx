import ImageWithCaption from "../../components/ImageWithCaption/ImageWithCaption.component";
import Projects from "../../components/templates/prose/prose.component";
import { List } from "../../components/list/list.component";
import emp_storybook from "../../assets/images/projects/Ink/emp_storybook.jpg";
import emp_storybook2 from "../../assets/images/projects/Ink/emp_storybook2.jpg";
import figma_button from "../../assets/images/projects/Ink/figma_button.jpg";
import figma_doc from "../../assets/images/projects/Ink/figma_doc.jpg";
import figma_doc2 from "../../assets/images/projects/Ink/figma_doc2.jpg";
import figma_icons from "../../assets/images/projects/Ink/figma_icons.png";
import emp_storybook1 from "../../assets/images/projects/Ink/emp_storybook1.png";
import employee_figma from "../../assets/images/projects/Ink/employee_figma.png";
import figma_button_spec from "../../assets/images/projects/Ink/figma_button_spec.png";
import figma_doc1 from "../../assets/images/projects/Ink/figma_doc1.png";
import shimmer_doc from "../../assets/images/projects/Ink/shimmer_doc.png";
import shimmer_doc1 from "../../assets/images/projects/Ink/shimmer_doc1.png";
import ink_cover from "../../assets/images/projects/Ink/ink_cover.png";
import icon_doc from "../../assets/images/projects/Ink/icon_doc.png";
import { Text } from "../../components/text/text.component";

export const Ink = () => {
  const summaryText = `During my time at Carta, I had the pleasant opportunity to make an impact
  on the design system. Taking my experiences from Blend, I was able to help
  lead the Ink on Figma 'team', which just comprised of one visual designer
  and a few other DTs to help maintain the library. Every week, I met with
  the team to break down and assign work for updating the library or helping
  out with the rebrand effort. As a group, wee set up guidelines for
  maintaining the library and made sure that it stayed up to date. On top of
  that, I made numerous contributions to the codebase ranging from helping
  with the sass to styled-components migration, extending components,
  updating backstop tests, and improving documentation. Lastly, I drove the
  creation and adoption of a storybook react framework that came with an
  optimized webpack config, storybook addons pre-installed, and more to help
  other DTs or FE engineers adopt storybook for their library/project.`;

  const InkContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Active contributor to the ink codebase: refactoring, improvements, documentation",
            "Led Ink on Figma working group to ensure parity with code and maintain the figma library",
            "Coordinated releases with code and figma library",
            "Brought forth PR check to update figma library whenever a DT makes a ui change to the codebase",
            "Introduced Storybook to the Employee/Shareholder pillar and created a tiered library to house recipes of ink components",
            "Collaborated with other DTs to share storybook react template",
            "Created employee-library in figma for designers",
            "improved UI health for Employee/Shareholder experience by 50%",
            "Sunsetted all other vestigial and unsupported figma library files",
          ]}
        ></List>,
      ],
    },

    {
      section: "Ink on Figma (figma library)",
      content: [
        <ImageWithCaption
          src={figma_button}
          white
          caption="Variant matrix of the Button with the rebranded styles"
        />,
        <ImageWithCaption
          src={figma_button_spec}
          white
          caption="Button spec for documentation within figma"
        />,
        <ImageWithCaption
          src={figma_icons}
          white
          caption="Icons as their own component with size variants"
        />,
        <ImageWithCaption
          src={icon_doc}
          white
          caption="Icon size table was added to highlight the icon sizes on the doc site along side the Icon refactor from sass to styled-components"
        />,
        <ImageWithCaption src={figma_doc} white caption="Ink on Figma 101" />,
        <ImageWithCaption
          src={figma_doc1}
          white
          caption="Branching one-pager, to help manage releases. A clean changelog is a healthy changelog"
        />,
        <ImageWithCaption
          src={figma_doc2}
          white
          caption="Documentation for a clever work-around to display 'custom' content within Figma components"
        />,
        <ImageWithCaption
          src={shimmer_doc}
          white
          caption="Updated the Shimmer component take more responsive values for the 'width' and `height` props instead of a fixed pixel value"
        />,
        <ImageWithCaption
          src={shimmer_doc1}
          white
          caption="Shimmer (circle variant) responsiveness and type change for 'props' and 'height' props"
        />,
      ],
    },
    {
      section: "Storybook template & Employee specific storybook",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={` As Carta scales, there will be the occaisional need for a new
        component; either as a one-off that isn't supported by the Ink team,
        or as a recipe of ink components to document a pattern. The
        introduction of storybook has been proven to be useful since it can
        act as a place to prototype or develop new components but also
        showcase patterns within the pillar or even externally. Often times we
        find ourselves re-configuring the props to a table multiple times, or
        create the same card over and over again across the 4 products within
        the Employee org.`}
        />,

        <Text
          size="Body"
          marginBottom={16}
          text={`In conjunction with other DTs at Carta, we were able to create a
      template that can be easily cloned or replicated for use within the
      monorepo or for bootstrapped projects.`}
        />,

        <ImageWithCaption
          src={emp_storybook}
          white
          caption="Storybook, for the Employee/Shareholder pillar, to showcase employee specific patterns that use ink components"
        />,
        <ImageWithCaption
          src={emp_storybook1}
          white
          caption="Ink, Carta's design system"
        />,
        <ImageWithCaption
          src={emp_storybook2}
          white
          caption="Employee (read as 'domain') specific assets"
        />,
        <ImageWithCaption
          src={employee_figma}
          white
          caption="Ink, Carta's design system"
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Ink"
      date="October 2021 - September 2022"
      summary={summaryText}
      image={ink_cover}
      image_caption="Ink, Carta's design system"
      content={InkContent}
    />
  );
};

export default Ink;
