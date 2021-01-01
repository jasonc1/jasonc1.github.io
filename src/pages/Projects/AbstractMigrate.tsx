import React from 'react';
import Projects from '../../components/templates/prose/prose.component';
import { List } from '../../components/list/list.component';

export const AbstractMigrate = () => {
  const summaryText = (
    <div>
      Wait Task V2 is a project where prototyping was leveraged to flesh out a
      loading experience through code. A hi-fi prototype was made in a matter of
      days to help the Design team figure out transitions, content, and
      technical constraints. The prototype was coded in ReactJS and served as a
      not only a working sandbox for designers to see the experience in real
      time but also a handoff item for engineering and thus saving several weeks
      of development time.
    </div>
  );

  const AbstractMigrateContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          size="body-1"
          listItems={[
            'Created a hi-fi prototype with ReactJS',
            'Collaborated with Design to work through step by step transitions',
            'Collaborated with Engineering for hand off and walked through code',
            'Aided Engineering in making code production ready',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Problem',
      content: [
        <div>
          The original Wait Task experience was simply a spinner with some text
          that lasted somewhere around 30 seconds, and the home insurance team
          wanted to make the experience more dynamic and informative for the
          user.
        </div>,

        <div>
          I was presented a few screens in Figma, and there were three ‘stages’
          of the wait task. However, many of the transitions were not figured
          out and there seemed to be a lot of moving pieces between each
          ‘stage.’ Thus, we figured it would be small enough scope but yet
          worthwhile to invest time to coding a hi-fi prototype in order to work
          through all the transitions and intricate interactions.
        </div>,
      ],
    },
    {
      section: 'Solution & Deliverables',
      content: [
        <div>
          As mentioned, the prototype that I was able to produce with the Design
          team served as a deliverable for hand off for the engineering team.
          The prototype came to be a useful addition to the design mocks since
          the engineers could see exactly what was happening frame by frame, but
          most importantly, the engineers could also reference my code.
        </div>,
      ],
    },
    {
      section: 'Process',
      content: [
        <div>
          This project happened over the course of a few days, but my process
          was quite simple: with most prototypes I make. The first step was to
          look at the mocks and ask questions and figure out what goes where.
          Since I knew this was a loading experience that was supposed to be
          dynamic based on service requests returning data, I mainly used
          setTimeouts to mock all the timings for the prototype.
        </div>,
        <div>
          Moreover, I found it extremely helpful to draw everything out frame by
          frame in figma to highlight every ‘delta’ between each transition
          between the stages. This helped serve as a blueprint for the prototype
          so that I could figure out every single element that I needed to show
          or hide. It was also helpful to just workshop the frames with the
          primary designer on the project and provide insight as to what could
          be done or what would be out of scope.
        </div>,
        <div>
          Considerations were made to use other prototyping tools at the time,
          and even Adobe AE was considered. However, we felt that it would be
          easier for handoff if we had a code solution. Additionally, it served
          to be easier to update and tweak timings on the code side as opposed
          to Adobe AE. Overall, we felt that it would be too cumbersome to
          animate every single item manually in Adobe AE, and code helped
          streamline this with the use of CSS and javascript to programmatically
          animate or transition elements.
        </div>,
      ],
    },
  ];

  return (
    <Projects
      title="Abstract Migrate Tool"
      date="March 2019 - July 2019"
      summary={summaryText}
      content={AbstractMigrateContent}
    />
  );
};

export default AbstractMigrate;
