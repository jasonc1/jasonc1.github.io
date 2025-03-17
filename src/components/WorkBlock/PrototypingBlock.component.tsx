import { Link } from "react-router-dom";
import { Text } from "../text/text.component";
import theme from "../../colors";

export const PrototypingBlock = () => {
  return (
    <div className="work-short-block" id="prototyping-block">
      <Text size="Header" text="Prototyping" />
      <Link className="item-row" to="carta-employee-onboarding">
        <Text
          size="Body-bold"
          color={theme.primary}
          text="Carta employee onboarding /"
        />

        <Text
          size="Body"
          color={theme.primary}
          text="Three end to end prototypes were created to test a new 2FA flow and subsequently leveraged for user tests."
        />
      </Link>
      <Link className="item-row" to="carta-exercise-status">
        <Text
          size="Body-bold"
          color={theme.primary}
          text="Carta exercise status /"
        />

        <Text
          size="Body"
          color={theme.primary}
          text="The task was to revamp the exercise status for more transparency behind the status as opposed to simply saying 'pending' or 'cancelled.'"
        />
      </Link>
      <Link className="item-row" to="otm">
        <Text
          size="Body-bold"
          color={theme.primary}
          text="Blend one tap mobile /"
        />

        <Text
          size="Body"
          color={theme.primary}
          text="Prototyped high fidelity interactions via react to iterate and refine to provide assets for engineering as well as showcase demos."
        />
      </Link>
      <Link className="item-row" to="wait-task-v2">
        <Text
          size="Body-bold"
          color={theme.primary}
          text="Blend Insurance Wait Task V2 /"
        />

        <Text
          size="Body"
          color={theme.primary}
          text="Prototyped a loading multi-step experience with css transitions and animations to flesh out microinteractions for handoff for engineering."
        />
      </Link>
    </div>
  );
};
