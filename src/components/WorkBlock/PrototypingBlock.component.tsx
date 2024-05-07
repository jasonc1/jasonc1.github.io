import { Link } from "react-router-dom";
import { Text } from "../text/text.component";
import theme from "../../colors";

export const PrototypingBlock = () => {
  return (
    <div className="work-short-block" id="prototyping-block">
      <Text size="Header" text="Prototyping" />
      <div className="item-row">
        <Link to="carta-employee-onboarding">
          <Text
            size="Body-bold"
            color={theme.primary}
            text="Carta employee onboarding /"
          />
        </Link>

        <Text
          size="Body"
          text="Three end to end prototypes were created to test a new 2FA flow and subsequently leveraged for user tests."
        />
      </div>

      <div className="item-row">
        <Link to="carta-exercise-status">
          <Text
            size="Body-bold"
            color={theme.primary}
            text="Carta exercise status /"
          />
        </Link>

        <Text
          size="Body"
          text="The task was to revamp the exercise status for more transparency behind the status as opposed to simply saying 'pending' or 'cancelled.'"
        />
      </div>
      <div className="item-row">
        <Link to="otm">
          <Text
            size="Body-bold"
            color={theme.primary}
            text="Blend one tap mobile /"
          />
        </Link>

        <Text
          size="Body"
          text="Prototyped high fidelity interactions via react to iterate and refine to provide assets for engineering as well as showcase demos."
        />
      </div>
      <div className="item-row">
        <Link to="wait-task-v2">
          <Text
            size="Body-bold"
            color={theme.primary}
            text="Blend Insurance Wait Task V2 /"
          />
        </Link>

        <Text
          size="Body"
          text="Prototyped a loading multi-step experience with css transitions and animations to flesh out microinteractions for handoff for engineering."
        />
      </div>
    </div>
  );
};
