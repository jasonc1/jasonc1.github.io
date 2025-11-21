import { Text } from "../text/text.component";
import bodega from "../../assets/images/photos/bodega.jpg";
import flower from "../../assets/images/photos/flower.jpeg";
import forest from "../../assets/images/photos/forest.jpg";
import halfmoon from "../../assets/images/photos/halfmoon.jpg";
import honolulu from "../../assets/images/photos/honolulu.jpg";
import montanadoro from "../../assets/images/photos/montanadoro.jpg";
import pgh from "../../assets/images/photos/pgh.jpg";

export const PhotoBlock = () => {
  return (
    <div className="photo-block">
      <div className="block-header">
        <Text size="Header" text="@me.dium" />
        <a
          className="contact-links"
          href="www.mediumprints.com"
          target="_blank"
          rel="noreferrer"
        >
          <Text size="Body-bold" text="Checkout mediumprints.com" />
        </a>
      </div>
      <div className="photo-block-body">
        <img src={bodega} alt="bodega" />
        <img src={flower} alt="flower" />
        <img src={forest} alt="forest" />
        <img src={halfmoon} alt="halfmoon" />
        <img src={honolulu} alt="honolulu" />
        <img src={montanadoro} alt="mantana doro" />
        <img src={pgh} alt="pittsburgh" />
      </div>
    </div>
  );
};
