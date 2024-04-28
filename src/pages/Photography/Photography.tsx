import React from "react";
import "./photography.style.scss";
import { Text } from "../../components/text/text.component";
import { Footer } from "../../components/footer/footer.component";
import { theme } from "../../colors.js";
import pgh from "../../assets/images/pgh.jpg";
import montanadoro from "../../assets/images/montanadoro.jpg";
import bodega from "../../assets/images/bodega.jpg";
import honolulu from "../../assets/images/honolulu.jpg";
import halfmoon from "../../assets/images/halfmoon.jpg";

const summary = `Here are just some of my favorite photographs that I’ve taken over the years. I shoot primarily 120 film (aka ‘medium format’), but sometimes I still use a Nikon FM2 for good old 35mm film - the stuff most of us grew up on before the digital age. For medium format, I currently own a Bronica ETRSi, Mamiya RZ67, and Plaubel Makina 67.`;

export const Photography = () => {
  return (
    <div className="photography-page">
      <Text
        size="Display"
        color={theme.primary}
        text={"Analogue Photography"}
        marginBottom={16}
      />
      <Text size="Body" color={theme.black} text={summary} marginBottom={80} />
      <img src={pgh} alt="Pittsburgh, Pennsylvania" />
      <img src={montanadoro} alt="Montaña D'oro, San Luis Obispo, California" />
      <img src={bodega} alt="Bodega Bay, California" />
      <img src={honolulu} alt="Honolulu, Hawaii" />
      <img src={halfmoon} alt="HalfMoon Bay, California" />

      {/* <Footer color={theme.black} /> */}
    </div>
  );
};
