import Projects from "../../../components/templates/prose/prose.component";
import { List } from "../../../components/list/list.component";
import { ImageWithCaption } from "../../../components/ImageWithCaption/ImageWithCaption.component";
import { Text } from "../../../components/text/text.component";
import SRLegacy_Alpha from "../../../assets/images/projects/SRLegacy/SRLegacy_alpha.png";
import SRLegacy_landing from "../../../assets/images/projects/SRLegacy/SRLegacy_landing.png";
import SRLegacy_home from "../../../assets/images/projects/SRLegacy/SRLegacy_home.png";
import SRLegacy_spec from "../../../assets/images/projects/SRLegacy/SRLegacy_spec.png";
import SRLegacy_STRAT_card from "../../../assets/images/projects/SRLegacy/SRLegacy_STRAT_card.png";
import SRLegacy_logo_2 from "../../../assets/images/projects/SRLegacy/SRLegacy_logo_2.svg";
import SRLegacy_logo_4 from "../../../assets/images/projects/SRLegacy/SRLegacy_logo_4.svg";
import SRLegacy_logo_6 from "../../../assets/images/projects/SRLegacy/SRLegacy_logo_6.svg";
import SRLegacy_logo_final from "../../../assets/images/projects/SRLegacy/SRLegacy_logo_final.svg";

export const SRLegacy = () => {
  const summaryText = `StratRoulette [SR] is a project created by my good friend Justin Chen from
  CMU. SR is essentially a form of "spin the wheel" that tells someone how
  to play a game - in this case, the game is CounterStrike. I primarily work
  on and, in a way, pioneer StratRoulette’s identity and feature
  development, but I also take part in the front end development in React.`;

  const SRLegacyContent = [
    {
      section: "Responsibilities",
      content: [
        <List
          ordered
          size="Body"
          listItems={[
            "Lead product designer",
            "Designed all flows and interactions of the app",
            "Created branding identity",
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
          text={`One of the obvious "problems" with StratRoulette was that it was
        bootstrapped together with minimal thought on branding, layout,
        information heirarchy, and overall aesthetics. However, the main
        problem was that StratRoulette was in ALPHA stages, and if we wanted
        to develop more features, we would need a foundation for design. With
        a foundation of layout and common ui components, Justin could spend
        more time on developing features. StratRoulette also lacked in things
        like feature discovery and promoting user engagement. Overall
        usability was lacking as well since StartRoulette only grew threw word
        of mouth, but it ultimately was not intuitive to a new user.`}
        />,

        <ImageWithCaption
          src={SRLegacy_Alpha}
          caption="StratRoulette in the early days"
        />,
      ],
    },
    {
      section: "Solution & Deliverables",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={` StratRoulette took off around 2015, and in 2017 I was asked to do a
          redesign to not only develop an identity for the application but also
          create and design user flows that would help foster community
          engagement. Ultimately, we wanted to develop a design language so that
          we could scale and build something that looked more modern. With that,
          I was tasked to brainstorm an identity for StratRoulette, develop
          layouts and pages for the developers with usability in mind.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`For every page I designed, I looked up common conventions and patterns
        that users are accustomed to from apps like Soundcloud. We wanted to
        encourage user enagement, so we wanted to create a home page feed to
        show user activity, but also provide a convenient way to contribute
        Strats. A landing page was also needed since we want to showcase what
        StratRoulette is used for and what it can do. We incorporated user
        accounts so that users could save their content as well as discuss and
        vote on other content.`}
        />,

        <ImageWithCaption
          src={SRLegacy_landing}
          caption="StratRoulette landing page, a place to showcase what StratRoulette does"
        />,
      ],
    },
    {
      section: "Process",
      content: [
        <Text
          size="Body"
          marginBottom={16}
          text={`My role for SR is two fold: I am in charge of developing and
          maintaining some sort of identity through branding and ui components
          so that we have a framework for designing and developing features, and
          I am responsible for designing new features and work flows for users
          so that we can expand SR.`}
        />,

        <Text
          size="Header"
          text="Identity &amp; Components"
          marginTop={16}
          marginBottom={16}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={` When it came to designing StratRoulette, I wanted to make sure that we
          were consistent with overall styling of the application. My first
          order of business was mainly just to create a small foundation of UI
          components: font, colors, input, grid, and more. Once that foundation
          was layed out, StratRoulette had some sort of identity, thus we could
          move on with creating layouts and certain user flows like landing
          page, submitting a start, etc.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`I really wanted to make sure the whole website was made so that it
        could be catered towards different types of games, as we were thinking
        of expanding from CS:GO. I ultimately was just tired of seeing really
        bright or neon and crazy looking text on websites to fit the brand of
        the game, and since SR is not really tied to a game, I figured I could
        just start from scratch and keep it minimal. I first just started out
        by picking some colors, really just anything I felt, and at that time
        I felt like electric blue and a dark black/grey would be pretty
        fitting as accent colors. All the icons made in SR were also created
        by me with a little bit of illustrator magic.`}
        />,

        <ImageWithCaption
          src={SRLegacy_spec}
          caption="StratRoulette initial component spec sheet"
        />,
        <Text
          size="Header"
          text="Logo designs"
          marginTop={16}
          marginBottom={16}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={` The first order of business for StratRoulette was for me to create a
          logo. The biggest motivation for me was to not make it look to
          “gamer,” and also not too boring. What I shortly realized was that
          making some sort of logo or monogram with the letters “S” and “R” were
          quit tricky.`}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`The first iterations were based on a hexagonal shape, similar to a
          revolver barrel. I wanted to really emphasize the roulette part, and I
          thought it would be interesting with the idea “russian roulette.”
          However, it was hard for me to execute and figure out where the S
          would ultimately be.`}
        />,
        <img
          className="SR-logo"
          src={SRLegacy_logo_2}
          alt={"sr logo attempt 1"}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`Then, I tried more of a symmetric approach, as I tried to make the S
          and the R shapes look more similar, but it just seemed to take too
          much space.`}
        />,
        <img
          className="SR-logo"
          src={SRLegacy_logo_4}
          alt={"sr logo attepmt 2"}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={` Next was some sort of lightning bolt to convey the fast paced nature
        of SR, and the R was placed as more of an exponent and not the main
        focus.`}
        />,

        <img
          className="SR-logo"
          src={SRLegacy_logo_6}
          alt={"sr logo attempt 3"}
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`However, the last iteration was something completely unorthodox. I was
        really inspired by something like Parley’s icons with some sort of
        circle border, and I just toyed around with switching the emphasis of
        the letters. Ultimately, I came to this by just trying it out, but I
        seemed to like it more: the letter “R” seemed to fit better with a
        Circle, as it wasn’t clashing with either sharp edges or curved edges
        of the bends. This logo is used for the main page, as well as the
        favicon. Note that the favicon does not have the “StratRoulette” text
        in the circle, as it is too small to be read or seen.`}
        />,

        <img
          className="SR-logo"
          src={SRLegacy_logo_final}
          alt={"sr logo final"}
        />,

        <Text
          size="Header"
          text="Product designs"
          marginTop={16}
          marginBottom={16}
        />,

        <Text
          size="Body"
          marginBottom={16}
          text={` The most important part was to showcase the Strat card because it was
          the one thing that users directly interacted with. We wanted to show
          what new things we added: color coding towards games, a save and share
          button, tags, etc, and furthermore this would be a component that
          shows up everywhere. We wanted to provide a way for people to
          contribute strats, search/filter for strats, roll strats (when they
          play the game), and comment on strats.`}
        />,

        <ImageWithCaption
          src={SRLegacy_STRAT_card}
          caption="The strat card showcasing tags, votes, share button, and improved information hierarchy."
        />,

        <Text
          size="Body"
          marginBottom={16}
          text={`A big problem with StratRoulette's original strat card was that there
        was no separation of information: there was a string of text for a
        strat and the name of the user who submitted it. Furthermore, the
        information blended into the webpage, there was no way for a user to
        really understand that a strat was present upon the first roll or page
        load. Thus, the idea of a strat card came into play: we wanted to
        effectively provide information to the user. Since strats are viewed
        quickly during games, it is important to have proper information
        hierarchy: valuable time is lost to the user if they have to look
        carefully, and sometimes users do not have the patience to look around
        for information.`}
        />,

        <ImageWithCaption
          src={SRLegacy_Alpha}
          caption="StratRoulette's early version of a start: you could not distinguish what information was important or not."
        />,
        <Text
          size="Body"
          marginBottom={16}
          text={`The Home page is quite similar to something you would typically see in
        most social media feeds. The idea was that we wanted to show the
        activity feeds of people that a user follow and show what Strats are
        being favorited or created. Essentially this page is where people
        share strat cards, playbooks (collections of strats), and more. I was
        ultimately inspired by how SoundCloud takes the “social media”
        approach of sharing music, where people post songs or repost songs,
        instead of acting like a typical music library. The same goes for SR,
        we wanted it to act not only as a repository of strats that people
        contribute, but we want to be able to showcase them and share them
        easily.`}
        />,

        <ImageWithCaption
          src={SRLegacy_home}
          caption="StratRoulette's homepage feed showcasing trending strats and easy access for the user to contributing content."
        />,
      ],
    },
  ];
  return (
    <Projects
      title="StratRoulette [v0.1 | ARCHIVE]"
      date="Aug 2017 - Dec 2017"
      summary={summaryText}
      content={SRLegacyContent}
    />
  );
};

export default SRLegacy;
