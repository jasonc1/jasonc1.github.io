import React from 'react';
import './photography.style.scss';
import { Text } from '../../components/text/text.component';
import { Footer } from '../../components/footer/footer.component';
import { theme } from '../../colors.js';
import pgh from '../../assets/images/pgh.jpg';

const summary = `Here are just some of my favorite photographs that I’ve taken over the years. I shoot primarily 120 film (aka ‘medium format’), but sometimes I still use a Nikon FM2 for good old 35mm film - the stuff most of us grew up on before the digital age. For medium format, I currently own a Bronica ETRSi, Mamiya RZ67, and Plaubel Makina 67.`;

export const Photography = () => {
  return (
    <div className="photography-page">
      <Text
        size="display-1"
        color={theme.primary}
        text={'Analogue Photography'}
        marginBottom={16}
      />
      <Text
        size="body-1"
        color={theme.black}
        text={summary}
        marginBottom={80}
      />
      <img src={pgh} alt="pittsburgh" />
      <Footer color={theme.black} marginTop={80} />
    </div>
  );
};
