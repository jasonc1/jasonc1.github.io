import { Text } from "../../components/text/text.component";
import "./NotFound.style.scss";

export const UnderConstruction = () => {
  return (
    <>
      <div className="not-found">
        <Text
          size="Header"
          textAlign="center"
          text="Content coming soon™️ — please reach out for more info"
        />
      </div>
    </>
  );
};

export default UnderConstruction;
