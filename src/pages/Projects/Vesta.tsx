import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { List } from '../../components/list/list.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import base_textinput from '../../assets/images/projects/Vesta/base_textinput.png';
import figma_variant_changes from '../../assets/images/projects/Vesta/figma_variant_changes.png';
import Modal_Audit from '../../assets/images/projects/Vesta/Modal_Audit.png';
import modal_scoping from '../../assets/images/projects/Vesta/modal_scoping.png';
import TextInputs from '../../assets/images/projects/Vesta/TextInputs.png';
import vesta_icons from '../../assets/images/projects/Vesta/vesta_icons.png';
import Modal from '../../assets/images/projects/Vesta/Modal.png';
import modal_workaround from '../../assets/images/projects/Vesta/modal_workaround.png';
import Cover from '../../assets/images/projects/Vesta/Cover.png';
import ModalSubcomponents from '../../assets/images/projects/Vesta/Subcomponents.png';

export const Vesta = () => {
  const summaryText = (
    <div>
      <ImageWithCaption
        src={Cover}
        white
        caption="Vesta's ui-kit cover in Figma, with a small legend for progress per page"
      />
      Vesta is an LOS (loan origination system) which is what loan officers use
      to process loans and manage their work. I was asked to contract part time
      to create Vesta's very first design system. Luckily, there were already
      some visual assets figured out like colors, type, and icons, but they
      needed some organization so that they could be used to flesh out the rest
      of the components. My time at Vesta so far has been to flesh out the 'v1'
      of the design system so that the rest of the product designers and
      frontend engineers can focus on building their product faster.
    </div>
  );

  const VestaContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          size="body-1"
          listItems={[
            'Audited product flows to document patterns',
            'Created and maintained design system from the ground up: starting from basic icons, typography, colors, and grid',
            'Collaborated weekly with product design team for feedback and presentation of components',
            'Created inputs, modals, navigational elements, and more',
            'Documented patterns and working best practices within the figma library',
            'Collaborated with Engineering to ensure React prop alignemnt and FE best practices',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Process',
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
      content={VestaContent}
    />
  );
};

export default Vesta;
