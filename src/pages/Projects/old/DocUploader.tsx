import React from 'react';
import Projects from '../../../components/templates/prose/prose.component';
import docupload_pre from '../../../assets/images/projects/intuit/docupload_pre.png';
import docupload from '../../../assets/images/projects/intuit/docupload.gif';
import { List } from '../../../components/list/list.component';
import { ImageWithCaption } from '../../../components/ImageWithCaption/ImageWithCaption.component';

export const DocUploader = () => {
  const summaryText = (
    <div>
      <ImageWithCaption src={docupload} caption="DocUploader in production" />
      DocUploader was a feature that was created based on a huge customer pain
      point: providing ID documentation so that the customer could be verified
      for using Payments with Quickbooks. This project took roughly 4 weeks to
      implement, test, and release end to end.
    </div>
  );

  const DocUploaderContent = [
    {
      section: 'Responsibilities',
      content: [
        <List
          size="body-1"
          listItems={[
            'Implement complete front end of feature',
            'Collaborated with design, customer success, and back-end engineers to roll out feature',
            'Spec-ed out interaction edge cases and error handling',
          ]}
        ></List>,
      ],
    },
    {
      section: 'Problem',
      content: [
        <div>
          As part of the onboarding process, about 10% of customers sign up need
          to verify their identity by providing a form of Identification
          Document (Passport, Driver License, etc). The previous process was
          that the customer had to call customer care and fax/email their
          documentation, which took roughly 24-48 hours to complete, depending
          on what was needed. This is a huge pain point for the customer:
          calling customer care is never fun, and sending over sensitive
          information over the phone can be difficult.
        </div>,
        <ImageWithCaption
          src={docupload_pre}
          caption="Documentation Needed state: message displayed to user to call customer care to resolve ID verification"
        />,
      ],
    },
    {
      section: 'Solution & Deliverables',
      content: [
        <div>
          Docuploader was created with the intention of providing a faster way
          for a user to verify their Identity. Considerations were made so that
          the upload process would be straightforward: provide flexibility in
          terms of documents that could be used for verification and provide
          multiple ways to upload. We wanted to let the user be confident with
          what they are submitting, thus providing a thumbnail of the uploaded
          image, as well as a way to view it at a greater scale. The purpose of
          DocUploader was only to provide a way to upload an image, on the UI
          and service side, there was nothing done to verify fraudulent or bad
          photos - this step was handled on the Payment or Risk processor's
          side.
        </div>,
        <div>
          With DocUploader, the customer was able to attach a picture and send
          it online without having to talk to a care agent with the following
          steps:
        </div>,
        <List
          ordered
          size="body-1"
          listItems={[
            'As part of onboarding, user is prompted by signup to verify ID doc OR User is prompted by email sent through care agent to verify ID',
            'User selects type of ID document they would like to upload',
            'User drag and drops file on the drop area, or clicks browse button to upload image. Mobile users can take a picture and attach directly',
            'UI displays thumbnail, file size, and link to enlarge image in new tab for verification.',
            'User uploads picture and recieves confirmation that their image has been successfully uploaded.',
            'Customer Care & Risk evaluate and verify image.',
          ]}
        ></List>,
        <div>
          With DocUploader, a process that took 24-48 hours was cut down to
          about 10 minutes. Roughly 200+ uploads were made within the first
          month, and that saved Intuit about at least $5,000 at $25 per care
          call. However, the most important part was that we were able to save
          the user’s time as well as care agents’ time.
        </div>,
      ],
    },
  ];

  return (
    <Projects
      title="DocUploader"
      date="Mar 2017 - Apr 2017"
      summary={summaryText}
      content={DocUploaderContent}
    />
  );
};

export default DocUploader;
