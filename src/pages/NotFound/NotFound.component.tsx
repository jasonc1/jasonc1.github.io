import { Text } from "../../components/text/text.component";
import "./NotFound.style.scss";

export const NotFound = () => {
  return (
    <>
      <div className="not-found">
        <Text size="Header" text="Error 404 / You stepped out of bounds 👹" />
      </div>
    </>
  );
};

export default NotFound;
