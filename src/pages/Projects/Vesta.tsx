import React from "react";
import Projects from "../../components/templates/prose/prose.component";
import { List } from "../../components/list/list.component";
import { ImageWithCaption } from "../../components/ImageWithCaption/ImageWithCaption.component";
import base_textinput from "../../assets/images/projects/Vesta/base_textinput.png";
import figma_variant_changes from "../../assets/images/projects/Vesta/figma_variant_changes.png";
import Modal_Audit from "../../assets/images/projects/Vesta/Modal_Audit.png";
import modal_scoping from "../../assets/images/projects/Vesta/modal_scoping.png";
import TextInputs from "../../assets/images/projects/Vesta/TextInputs.png";
import vesta_icons from "../../assets/images/projects/Vesta/vesta_icons.png";
import Modal from "../../assets/images/projects/Vesta/Modal.png";
import modal_workaround from "../../assets/images/projects/Vesta/modal_workaround.png";
import Cover from "../../assets/images/projects/Vesta/Cover.png";
import ModalSubcomponents from "../../assets/images/projects/Vesta/Subcomponents.png";

export const Vesta = () => {
  const summaryText = `Vesta is an LOS (loan origination system) — the software loan officers use
      to process loans and manage their work. I was brought on part time, as a
      contractor, to build Vesta's very first design system from zero over 6
      months. Some visual assets existed already — colors, type, icons — but
      unorganized and unusable as a foundation. I restructured those into
      tokens on an 8pt half grid, then shipped the v1 library: an in-house
      subset of Material UI icons, a base text input extended into every input
      variant, a base modal with swappable subcomponents, navigational
      elements, and the pattern documentation around them. The base-component
      approach is the point: each new variant is a pre-configured instance of a
      base rather than a new component to maintain, so the product designers
      and frontend engineers can build product faster without the library
      sprawling.`;

  const VestaContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          size="Body"
          listItems={[
            "Vesta's first design system, 0 → v1 over a 6-month part-time contract",
            "8pt half grid, in-house icon subset, full type and colour tokens",
            "Audited every product flow before designing — including a full modal audit",
            "base_input and base_modal — variants ship as configured instances, not new components",
            "Weekly component reviews with the product design team",
            "React prop alignment agreed with Engineering",
          ]}
        ></List>,
      ],
    },
    {
      section: "Process",
      content: [
        <ImageWithCaption
          src={vesta_icons}
          caption="Vesta's icons are simply using material ui's vast list of icons, but the icon library is simply a subset that is maintained in house for flexibility. Size variants stem from an 8pt half grid."
        />,
        <ImageWithCaption
          src={figma_variant_changes}
          caption="Figma changed up their variant organization UI, so a learning here is not to put every icon as a variant of an Icon component, despite that's how it's represented in the code for some codebases. Thus, here's why each icon is it's own component in Figma, but it would be rendered as <Icon type={$name}/>"
        />,
        <ImageWithCaption
          src={base_textinput}
          caption="a base text input was created so that it could be extended to provide a text mask, an icon, or other props. This would help unify some of the visually similar input controls like text inputs, dropdowns, etc."
        />,
        <ImageWithCaption
          src={TextInputs}
          caption="Text inputs with other variants. Note: each variant exists as it's own component, but they are mainly just a pre-defined version of the base_input"
        />,
        <ImageWithCaption
          src={Modal_Audit}
          caption="Like most components, an audit would be done document existing patterns in the product - pictured here is the audit for Modals"
        />,
        <ImageWithCaption
          src={modal_scoping}
          caption="This is a bit of a brainstorm screen, but it documents how I think about creating subcomponents for organisms like a Modal"
        />,
        <ImageWithCaption
          white
          src={ModalSubcomponents}
          caption="Subcomponents to create a base_modal to support the modal variants while being set up for instance swapping for the modalContent"
        />,
        <ImageWithCaption
          src={Modal}
          caption="Taking on the same idea as base_inputs, a base_modal was created so that it could represent different variants of modals showcased above"
        />,
        <ImageWithCaption
          src={modal_workaround}
          caption="A clever tip that I've discovered while at Carta: local components (within a working file) can be swapped in via the instance swapper to dynamically render content without detaching."
        />,
      ],
    },
  ];

  return (
    <Projects
      title="Vesta"
      date="March 2022 - August 2022, contract"
      summary={summaryText}
      image={Cover}
      image_caption="Vesta's ui-kit cover in Figma, with a small legend for progress per page"
      content={VestaContent}
    />
  );
};

export default Vesta;
