import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { List } from '../../components/list/list.component';
import { ImageWithCaption } from '../../components/ImageWithCaption/ImageWithCaption.component';
import Alchemy_cover from '../../assets/images/projects/Alchemy/Alchemy_cover.png';
import Alchemy_foundations from '../../assets/images/projects/Alchemy/Alchemy_foundations.png';
import Alchemy_theming from '../../assets/images/projects/Alchemy/Alchemy_theming.png';
import Alchemy_checkbox from '../../assets/images/projects/Alchemy/Alchemy_checkbox.png';
import Alchemy_reference_site_color from '../../assets/images/projects/Alchemy/Alchemy_reference_site_color.svg';
import Alchemy_reference_site_component from '../../assets/images/projects/Alchemy/Alchemy_reference_site_component.svg';
import Alchemy_theme_object from '../../assets/images/projects/Alchemy/Alchemy_theme_object.png';
import Alchemy_icons_example from '../../assets/images/projects/Alchemy/Alchemy_icons_example.png';

import Checkbox_documentation from '../../assets/images/projects/Alchemy/Checkbox_documentation.pdf';
import { Text } from '../../components/text/text.component';

export const Alchemy = () => {
  const componentDocumentation = (
    <a
      className="action-link"
      target="_blank"
      rel="noreferrer"
      href={Checkbox_documentation}
    >
      <Text size="link-1" text="component documentation" />
    </a>
  );

  const summaryText = (
    <div>
      <ImageWithCaption
        white
        src={Alchemy_cover}
        caption="Alchemy brand logo"
      />
      Alchemy design system is an ongoing design system effort at Blend to
      create a unified design system that can be extensively customized and
      themed to be utilized in Blend’s various product families. Alchemy is the
      product of numerous attempts to establish design systems at Blend, thus
      leveraging all of Blend’s learnings and past attempts. Alchemy’s main goal
      is to act as one sole component library that both enterprise and consumer
      products can use to design and build with. The Alchemy design system is
      unique due to the fact that it takes on a “system for systems” approach
      since it leverages theming in order to produce visually distinct and
      unique components that basically act as one to many design systems.
    </div>
  );

  const AlchemyContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          size="body-1"
          listItems={[
            'Designed components with theming and accessibility in mind',
            'Created documentation for such components',
            'Synthesized a vision for a themeable design system to meet Blend’s product needs',
            'Collaborated with the brand team to put together concepts for a reference site',
            'Collaborated with Engineering to establish foundations for theming architecture',
            'Established design tokens: typography, colors, icons, and basic grid structure',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Problem',
      content: [
        <ImageWithCaption
          white
          src={Alchemy_foundations}
          caption="A brief overview of Alchemy's foundations"
        />,
        <div>
          The problem at hand was that Blend was facing two issues: there were
          separate component libraries for each product and that some products
          do share many components from different libraries. On top of that,
          Blend’s consumer products are primarily white labeled, meaning the
          design system carries no branding since the branding is derived from
          the customer’s branding. For example, Wells Fargo’s Mortgage
          application via Blend takes on the Wells Fargo brand colors.
        </div>,
        <div>
          However, with the growth of the Consumer banking platform as well as
          customer asks, Blend has been exploring ways to let customers
          customize their visual identity more within the Blend application.
          Thus, Alchemy’s first goal is to unify all the fragmented design
          libraries and also establish a shared language amongst design and
          engineering. The second goal is to support theming in a way that
          Alchemy can support drastically different visual styles. The implicit
          goal is also to then be able to support theming so that our customers
          can then create their own theme so that their application experience
          can be tailored to a customer’s brand.
        </div>,
      ],
    },
    {
      section: 'Process',
      content: [
        <ImageWithCaption
          white
          src={Alchemy_theme_object}
          caption="An example of Alchemy's theme object with three tiers: primitives, semantics, and component level overrides."
        />,

        <div>
          Our first two quarters for Alchemy was dedicated towards understanding
          the problem and subsequently synthesizing the vision for the project.
          The team and I had the opportunity to work with Brad Frost, the
          godfather of atomic design, to help guide us through our first few
          months to create a unified component library to support all of Blend’s
          products. We hypothesized that we could create a design system that
          supported themes so that the component library could produce the same
          functional components but, through theming, could look visually
          different based on color, type, padding, border radius, and more. With
          Brad Frost, we were able to define how we want to support theming,
          establish a north star, and thus begin establishing our foundations.
        </div>,

        <div>
          We defined a theme to be a json object (with the help of json
          templating) so that we could define tiers: primitives, semantics, and
          overrides. We defined primitives to be the ‘raw’ styles for things
          like hex codes for color, font declarations for type, spacing units
          for padding/margins, and more. From there, the semantic declarations
          basically served as the “80% use case” where commonly used patterns
          could be established. For example, we could say that “negative” color
          would be referring to the primitive “red” and we could then map the
          negative color to our components.
        </div>,
        <div>
          However, we could then define an override saying that for a specific
          component, we want the component to use a different color for it’s
          error state (in which it would use the “negative” color token). This
          is useful for one-off or specific edge cases where we would need to
          intentionally deviate from a given pattern. This helps give consumers
          as well as us, the maintainers of the system, to have the ergonomics
          to reference the same design tokens so that we could easily change
          values and create other themes as well as be able to have the
          flexibility and freedom to create components that were special cases.
        </div>,

        <div>
          Once we defined our theming architecture as well as the conclusion of
          our workshops with Brad Frost, we decided to commence our work
          developing components via pilot projects with different
          product/development teams. Our first pilot project was for a team
          working on Scenario Sharing. I won’t go into much detail about the
          feature itself, but we found that we had about 2-3 weeks to produce a
          set of components: radio, checkbox, and a textInput. However, the
          project timeline was pushed to 1 week and developers started building
          ASAP, so the team decided to use the legacy components. Most
          importantly, we found that it would be very difficult to meet a
          deadline esp when we are still working on foundations, and producing
          even one production ready component within 3 weeks would be
          questionably hard to pull off.
        </div>,
        <ImageWithCaption
          white
          src={Alchemy_theming}
          caption="Alchemy supports multiple design languages with the use of theming."
        />,
        <div>
          Ultimately, we learned that we needed to establish our foundational
          components (think atomic components: color, type, gride, and icons)
          and have teams first consume that before we can move onto our
          ‘molecule’ or just simply ‘compound’ components. In hindsight, it made
          total sense and we should have seen that coming from a mile away since
          we weren’t really set up in a way to start building fast.
        </div>,
        <div>
          Through auditing, we realized that we needed to determine if Alchemy
          should support ultimate flexibility or a fixed number components when
          it came to atomic components like type styles. We ran into the issue
          of figuring out how we could implement theming so that we could have
          the consumer app leverage 3 header styles while the enterprise app
          requiring 6 header styles. Our approach was to support the max number
          that we currently support, which would we 6. We found that the
          enterprise app was the most while another product had 5 header styles.
          Additional headers could be added, but it would need to necessary for
          other products to need an additional header style before the addition.
          We also found that these header styles are quite set in stone since
          they have been around for roughly 5 years. With product families that
          don’t requires as much headers, they would just use the ‘slots’ that
          they needed, and the leftover headers would remain empty.
        </div>,
        <div>
          On the code side, we figured that they would still render a type
          style, but it would be the ‘last one’: for example, if there were only
          3 headers, and <code className="inline">H4</code> would just render
          the same style as <code className="inline">H3</code> so that the
          component wouldn’t result into a null pointer/compilation issue. Since
          most of our designers work within a product family, we were also under
          the impression that designers would not reference styles that “didn’t
          exist” in alchemy. What I mean by that is: if the consumer app only
          has 3 header styles, designers would only be referencing those three
          header styles. Thus, on the code side, if an engineer is being handed
          off designs, they won’t ever run into the case that they would have
          the alchemy reference the 4th header type style since they would have
          not seen it and the designer would not have referenced an{' '}
          <code className="inline">H4</code> on Figma anyway.
        </div>,
        <div>
          For color, we found that we could let designers create and add as many
          color primitives as they wanted since that would function as their
          “palette.” We decided to opt for maximum flexibility since we found
          that all of our products ranged in various numbers of color styles.
          Our consumer app had something like 12 colors (mainly also due to the
          fact that it’s white-label) while our enterprise app had upwards of 36
          colors. We discovered that with the use of primitives and overrides,
          and due to the fact that visual language/branding is involved, color
          needed to be flexible. Unlike type, color usage warranted flexibility
          due to the complexity and variance of our product families.
        </div>,
        <ImageWithCaption
          white
          src={Alchemy_icons_example}
          caption="An example of product specific icons vs core icons"
        />,
        <div>
          As for icons, we only had enough time to audit and clean up our icon
          sets for our product families, but we never got around to establishing
          how we could support icons. My hypothesis was to just support the
          ‘common’ set that all product families would have to have
          compatibility for, and the rest of the icons would just be supported
          via a product specific component library. Keep in mind, alchemy would
          be the one shared component library, but there would still exist
          product specific libraries that product teams would maintain, but such
          components would not be shared since they are in fact product
          specific. So for icons, we would determine (via audits) the list of
          icons that were commonly used: checkmark, up, down, and so on. For
          special icons like a loan document in which the enterprise app would
          be the only user of such icon, the enterprise product team would thus
          bring in their own icon. How would they do that? That, we never got
          around to talking too much deeply, but I would presume that alchemy
          would build a library that could help product teams use a custom set
          of icons so that each team could follow the same process and not have
          various homebrewed/bootstrapped solutions. Our enterprise app already
          had icons that were drawn to fit an 8pt grid, but our consumer app
          wasn’t. So after a bit of design debt and consolidation, I spent some
          time redrawing our consumer icons (in adobe illustrator) to have them
          drawn from 20x20 to 24x24 since scaling in figma and exporting via SVG
          would have all the pixels and stroke widths messed up.
        </div>,
        <div>
          As for grid, the same as icons followed, but we mainly spent time
          determining that we could get away with an 8pt grid since more of our
          products use an 8pt grid, and that we just needed to determine spacing
          units and breakpoints for responsiveness. Most layouts would be
          determined by the product teams, but they would leverage alchemy’s
          breakpoints as well as spacing units and flex grid to derive their own
          ‘custom’ layouts for specific column widths.
        </div>,
        <div>
          Over time, we were eventually able to come around and establish
          constraints on color, type, and grid. We had enough to start working
          on a typography component. An engineer at Blend was spending a quarter
          refactoring the Admin app panel in the enterprise application from
          Angular to React and thought that it would be good timing to partner
          with Alchemy. I had a feeling it would be too big of an ask to pull of
          in the quarter since were provided a priority list of components.
          Checkbox, Type component, Radio, Textbox, action button, link button,
          and more. In hindsight, that was way too much to be able to do with
          effectively one dedicated designer and engineer. If we could even push
          out one, maybe two, components during the quarter, that would be huge.{' '}
        </div>,
        <ImageWithCaption
          src={Alchemy_checkbox}
          caption="Alchemy's checkbox component with the enterprise theme."
        />,
        <div>
          Nonetheless, we decided to give the project a try. It ultimately was a
          learning experience for us since we needed to consider theming and
          auditing components from all product families in order to figure out
          what props to support for a component. For example, buttons on the
          Consumer app only had primary and secondary variants while buttons on
          the Enterprise app had primary, secondary, and tertiary variants. The
          problem wasn’t so much the auditing, but was to try and figure out if
          we should support 2 or 3 variants and how we would handle that for
          theming. We were able to get a head start with designing some of the
          components, and I was able to knock out a few like Radio + RadioGroup,
          Checkbox + CheckboxGroup, TextInput, SelectInput, and ActionButton.
          However, we were only able to get around to developing a Text
          component since that was the first building block we needed to
          establish alongside color in which the components would leverage type
          and color styles from the theme.
        </div>,
        <div>
          Although we missed the mark in delivering suxch an enormous project,
          we were able to establish a priority list of components: Type, Button,
          Radio, RadioGroup, Checkbox, CheckboxGroup, TextInput, SelectInput,
          and so on. We were able to focus on the typography component and the
          roll out of the component before Q4 ended. Since we figured out the
          theming for color and typography, we focused on designing components
          while we developed the type component. The type component did not need
          much design since the type styles were already established and there
          was just design QA that was necessary so that the type styles were
          accurate and that the type component could support certain properties
          like italics, spacings, etc.
        </div>,
        <div>
          The biggest learning, however, is that in order to gain adoption of
          our growing design system, we have to start small. One huge oversight
          was that the team decided to pile on a bunch of components within a
          quarter. In my opinion, that was not the best move, but we ultimately
          were able to learn from it. On top of that, I discovered that a big
          win is just to get a team to adopt a simple component. I would say
          color or type would just be huge enough. The fact that we were able to
          produce a type component that was ready to use for the Admin app panel
          refactor was huge enough. That would serve as new component in which
          both consumer and enterprise app engineers could slowly adopt. Since
          type is used everywhere in the application, unlike a checkbox being
          used only in forms/consent, it would be on of the most used
          components.
        </div>,
        <div>
          However, in Q1, around the time I am writing this, the project came to
          a brief and yet painful pause. We hired a new design lead to take on
          the project, and my two teammates: the fill-in design lead and lead
          engineer decided to leave the team. From there, the project went on a
          different course, and the theming, foundational work was archived. We
          never ended up rolling out the typography component, as the project
          decided to focus on icons. In that same vein, the icon roll out was
          also a small component in which was an easy win with high impact just
          like the type component. However, I decided to take a brief pause on
          the team, and was not part of the icon refactor/consolidation effort.
          In short, the icon refactor was to replace all the consumer icons and
          enterprise icons to use rounded icons from Material Design. However,
          since there was no lead engineer, the changes were all rolled in the
          alchemy figma library, but no code changes were made, thus resulting
          in design and tech debt. For the duration in which we would not have a
          lead engineer, Design would product screens with new icons, while in
          prod the icons would still be the old styles until Alchemy supports
          icons, unless individual product teams want to manually bring in their
          own icons.
        </div>,
        <div>
          While it did disappoint me to see that the type component was not even
          used or leveraged come Q1, I felt that I learned some valuable lessons
          for me to remember if and when I start my own design system. I felt
          that the learnings were the most valuable takeaway for me less so the
          output, despite working on this project for almost a year. I did
          manage to crank out almost hundreds of variants of components in
          Figma. I managed to consolidate colors, resize icons, create new
          components, audit accessibility support across our apps, and much much
          more.
        </div>,
        <ImageWithCaption
          src={Alchemy_reference_site_color}
          caption="Alchemy's Color page mock for the reference site"
        />,
        <div>
          I managed to spend my last few weeks before stepping off Alchemy to
          onboard the new design lead before learning that the project would
          shift but without much clarity on the project roadmap or how it would
          get there. It did disappoint me greatly, as my biggest “dream” (in a
          sense) was to help contribute to the reference site. In Q4, I managed
          to work with the Brand design team to product a logo and minor brand
          identity elements as well. The logo would be used for our reference
          site in which our design and component documentation would be
          presented along side with live component/sandboxes as well as
          foundations and other resources. I spent a few weeks drafting the
          reference site Information Architecture and how we could use a
          dropdown in the nav bar to act as our theme switcher.
        </div>,
        <ImageWithCaption
          src={Alchemy_reference_site_component}
          caption="Alchemy's component documentation mock for the reference site"
        />,
        <div>
          We toyed with the idea that the dropdown would basically pass in a
          theme so that each component documentation page would include a live
          alchemy component and reflect the theme the site is currently in.
          Since all components would be the same, our component documentation
          would look the same for enterprise, consumer, and other apps - just
          the component would look visually/stylistically different. On top of
          that, the theme switcher would also control the design docs for things
          like color, type, and more. Across all apps, the colors would be very
          different, so the theme switcher would thus render a Colors page for
          our consumer app, render a different Colors page for our enterprise
          app, and so on. I also spent some time mocking up the Colors Page,
          Typography Page, and a mock component page.
        </div>,
        <div>
          The {componentDocumentation} was recorded within a template doc in
          Dropbox Paper. This was done so that we had a template to record all
          facets of the component documentation without having an actual
          reference site. That way, we could just copy and paste content when
          the reference site was made. It should be noted that we didn’t have
          the bandwidth nor desire to use a CMS to generate the reference site
          pages, since were just trying to get the ball running, and I’m more
          than comfortable creating pages in React anyway. The component
          documentation happened to be a product of my various attempts to
          creating documentation at Blend for design systems. Over the last two
          years, I spent time looking at reference sites, drafting component
          questionnaires for UI review for the design team, and worked with
          product designers to create a template of the component documentation
          so that it would be consistent across the design team. That came in
          handy since we just leveraged that for the Alchemy reference site
          component documentation.
        </div>,
      ],
    },
  ];

  return (
    <Projects
      title="Alchemy"
      date="April 2020 - Present"
      summary={summaryText}
      content={AlchemyContent}
    />
  );
};

export default Alchemy;
