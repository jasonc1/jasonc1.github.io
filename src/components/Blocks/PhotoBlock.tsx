import { Text } from "../text/text.component";
import bodega from "../../assets/images/photos/bodega.jpg";
import flower from "../../assets/images/photos/flower.jpeg";
import forest from "../../assets/images/photos/forest.jpg";
import halfmoon from "../../assets/images/photos/halfmoon.jpg";
import honolulu from "../../assets/images/photos/honolulu.webp";
import montanadoro from "../../assets/images/photos/montanadoro.webp";
import pgh from "../../assets/images/photos/pgh.webp";

export const PhotoBlock = () => {
  return (
    <div className="photo-block">
      <div className="block-header">
        <Text size="Body" text="@me.dium" weight="medium" />
        <a
          className="contact-links"
          href="www.mediumprints.com"
          target="_blank"
          rel="noreferrer"
        >
          <Text size="Body" text="mediumprints.com" weight="medium" />
        </a>
      </div>
      <div className="photo-block-body">
        <img src={bodega} alt="bodega" loading="lazy" decoding="async" />
        <img src={flower} alt="flower" loading="lazy" decoding="async" />
        <img src={forest} alt="forest" loading="lazy" decoding="async" />
        <img src={halfmoon} alt="halfmoon" loading="lazy" decoding="async" />
        <img src={honolulu} alt="honolulu" loading="lazy" decoding="async" />
        <img src={montanadoro} alt="mantana doro" loading="lazy" decoding="async" />
        <img src={pgh} alt="pittsburgh" loading="lazy" decoding="async" />
      </div>
    </div>
  );
};
