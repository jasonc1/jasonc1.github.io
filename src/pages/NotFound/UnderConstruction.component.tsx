import { Text } from "../../components/text/text.component";
import "./NotFound.style.scss";

export const UnderConstruction = () => {
  return (
    <>
      <div className="not-found">
        <Text size="Header" text="This page is under construction /" />
      </div>
    </>
  );
};

export default UnderConstruction;
