import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { List } from '../../components/list/list.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import product_illustrations_blend_site from '../../assets/images/projects/ProductIllustrations/product_illustrations_blend_site.png';
import product_illustrations_components from '../../assets/images/projects/ProductIllustrations/product_illustrations_components.png';
import product_illustrations_lottie from '../../assets/images/projects/ProductIllustrations/product_illustrations_lottie.png';
import product_illustrations_sample from '../../assets/images/projects/ProductIllustrations/product_illustrations_sample.png';
import product_illustrations_type from '../../assets/images/projects/ProductIllustrations/product_illustrations_type.png';

export const ProductIllustrations = () => {
  // const AbstractMigrate = (
  //   <Link className="action-link" to="/AbstractMigrate" target="_blank">
  //     <Text size="link-1" text="abstract-migrate" />
  //   </Link>
  // );
  const summaryText = (
    <div>
      <ImageWithCaption
        white
        src={product_illustrations_blend_site}
        caption="Product Illustrations used in the Blend.com website"
      />
      Product Illustrations in Figma was a project where I helped the Brand
      design team migrate svg assets from Illustrator to Figma. The hope was
      that we could leverage Figma variants/components to create product
      illustrations faster within Figma as opposed to Illustrator. The main
      gripe was that Illustrator took too long to open and most of our workflow
      within the Design team was shifting towards Figma. The experiment was also
      to see if exported product illustrations (as SVG) from Figma would work
      well with After Effects with Bodymovin (for Lottie).
    </div>
  );

  const ProductIllustrationsContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          size="body-1"
          listItems={[
            'Migrating SVG assets from Illustrator to Figma',
            'Consolidating type styles and components',
            'Assisting and verifying outcomes with the Brand design team',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Problem',
      content: [
        <ImageWithCaption
          white
          src={product_illustrations_sample}
          caption="A sample product illustration created by the Brand Design team"
        />,
        <div>
          The main problem was that in order to make a product illustration, we
          would have to open up a main file in Adobe Illustrator, and copy
          vector assets to then create an illustratration. Designers would have
          to copy and paste components within different files in order to create
          an illustration. Furthermore, type styles were free form and thus had
          no consistency across multiple product illustrations.
        </div>,
      ],
    },
    {
      section: 'Solution & Deliverables',
      content: [
        <ImageWithCaption
          white
          src={product_illustrations_components}
          caption="An iteration of the product illustration components"
        />,
        <div>
          The main deliverable on my end was to produce a figma library with all
          the components. The migration was not the smoothest due to some
          clipping masks don’t transfer that well from Illustrator to Figma as
          well as some typographic elements. I tried to export all assets as
          SVGs and thus importing them within Figma, but eventually had to
          redraw a good 40% of the assets. This took about a week tops and that
          took the majority of the project. The rest of my time was spent
          cleaning up and organizing the components to pilot and help me learn
          how to leverage Figma Variants, as the feature was recently released.
        </div>,
        <ImageWithCaption
          white
          src={product_illustrations_type}
          caption="A type ramp for product illustrations"
        />,
        <div>
          The last two weeks were spent auditing existing product illustrations
          to formulate a type ramp. There are two types of product illustrations
          that the brand team makes - consumer or enterprise. I noticed that
          existing product illustrations had varying type styles, some body text
          for the same elements would vary from 11px to 17px. Even elements like
          buttons sometimes had varying font sizes and some were sentence case
          while others were upper case. Thus, creating some guidelines around
          type usage would also help designers create illustrations faster
        </div>,
        <ImageWithCaption
          src={product_illustrations_lottie}
          caption="Instruction for exporting product illustrations from Figma to export for Lottie."
        />,
        <div>
          Last, I was able to create a few product illustration samples using
          the new figma library and handed them off to a teammate on the brand
          team so that they could test out the SVG in Adobe AfterEffects. The
          design team heavily leverages Lottie for animations, so we wanted to
          make sure we could create illustrations in Figma that would mesh well
          with Bodymovin, a plugin used to export animations as JSON files for
          Lottie to use.
        </div>,
      ],
    },
  ];

  return (
    <Projects
      title="Product Illustrations in Figma"
      date="October 2020"
      summary={summaryText}
      content={ProductIllustrationsContent}
    />
  );
};

export default ProductIllustrations;
