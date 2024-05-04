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
        <Text size="Header" text="Fuji Pro400h" />
      </div>
      <div className="photo-block-body">
        <img src={bodega} />
        <img src={flower} />
        <img src={forest} />
        <img src={halfmoon} />
        <img src={honolulu} />
        <img src={montanadoro} />
        <img src={pgh} />
      </div>
    </div>
  );
};
