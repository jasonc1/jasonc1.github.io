import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import accordion_ids from "../../assets/images/projects/intuit/accordion_ids.gif";
import accordion_tron from "../../assets/images/projects/intuit/accordion_tron.gif";
import { Link } from "react-router-dom";
import { Text } from "../../components/text/text.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";

export const IDSAccordion = () => {
  const Intuit = (
    <Link className="action-link" to="/DocUploader" target="_blank">
      <Text
        size="Body-bold"
        text="👉 Check out one of my previous projects at Intuit!"
      />
    </Link>
  );
  const summaryText = (
    <div className="summary-text-link">
      <Text
        size="Body"
        text={`During my time as a software engineer at Intuit, I came across an
        opportunity to contribute to an upcoming design system: Intuit Design
        System [IDS]. This was one of my first experience in design systems: what
        started as a spike thus evolved into a journey to contribute a new
        component do a design system as an engineer. I had the pleasure of taking
        a component from early design concepts, to prototyping, and finally
        implementing a production ready accordion.`}
      />
      {Intuit}
    </div>
  );

  const IDSContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Architected and Implemented component",
            "Provide technical and interaction feedback",
            "Created hi-fi prototypes",
            "Implemented Accessibility support",
            "Integrated component into IDS review process",
            "Consumeed & implemented accordion in product",
            "Worked with engineers from 2 external BUs to support and extend component",
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
          text={` A new UI component is introduced to Quickbooks Online: the accordion +
        container-like features. This component would be used throughout
        quickbooks for various onboarding flows. There are no existing
        components from Intuit's proprietary component library, and
        furthermore, the current component library would also be deprecated.
        The designs presented were simply done through sketch; thus, things like easing (animation) as well as accessbility were not
        thought of during the intial design process. Current onboarding flows would either be too long or broken into
        multiple pages, thus forcing a user with a very rigid flow.`}
        />,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={`The ultimate goal was to not only make a component that my team can
        use, but also make a component that could be potentially used by other
        teams. This accordion was a crucial component in a sense that it could
        provide users flexibility when it came to filling out forms: a form
        broken down to sections that could not only summarize each section but
        also provide the user the freedom to preview what they need to
        accomplish and to start wherever they desired. This accordion was made
        so that custom header and body content could be used so that consumers
        of this component had full control as to what they want to display to
        the user. This is powerful so that the accordion could be dynamic:
        different states of the accordion could show different content. Key features include:`}
        />,

        <List
          size="Body"
          listItems={[
            "Collaboration with motion designers to be consistent with Intuit’s new motion design guidelines",
            "Customizable to different themes to match Intuit’s respective products",
            "Working towards graduation for officially being a part of Intuit Design Systems",
            "Upgraded project to React 16",
            "Collaboration with Accessibility team to meet Intuit’s standards",
            "Provide help and information externally to other teams for consumption",
          ]}
        ></List>,
        <ImageWithCaption
          src={accordion_ids}
          caption="The Accordion in the Intuit Design Systems gallery"
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={` At the end of the contribution, I was able to make something that
        could be used throughout Intuit, as I felt that it would be ultimately
        inefficient for another team to develop the same thing. In fact,
        multiple teams were designing new UIs with the accordion style that my
        team was using. This accordion currently sits as a lab component, but
        once two teams use it and it meets proper code coverage, it will be
        graduated into IDS officially, and it will be packaged into every
        project automatically as currently it is available in Intuit’s npm
        registry meaning developers have to install it manually.`}
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Intuit Design Systems Accordion"
      date="Jun 2017 - Aug 2017"
      summary={summaryText}
      image={accordion_tron}
      image_caption="The Intuit Design Systems Accordion seen in Payments Onboarding with Chase in production"
      content={IDSContent}
    />
  );
};

export default IDSAccordion;
