import { Link } from "react-router-dom";
import { Text } from "../text/text.component";
import theme from "../../colors";

export const ToolingBlock = () => {
  return (
    <div className="work-short-block" id="tooling-block">
      <Text size="Header" text="Tooling" />

      <Link className="item-row" to="sapling">
        <Text size="Body-bold" color={theme.primary} text="Sapling /" />
        <Text
          size="Body"
          color={theme.primary}
          text="Sapling is a figma plugin that creates a set page structure and cover page for new figma files. Think of it as a figma file initializer."
        />
      </Link>

      <Link className="item-row" to="haven">
        <Text size="Body-bold" color={theme.primary} text="Haven /" />
        <Text
          size="Body"
          color={theme.primary}
          text="Haven is a figma plugin I built to help product designers document and protect their explorations and archived screens as well as tagging screens for better handoff. Haven was a small side project and an opportunity to explore tooling for the Product design team within Figma."
        />
      </Link>

      <Link className="item-row" to="abstract-migrate">
        <Text
          size="Body-bold"
          color={theme.primary}
          text="Abstract migrate /"
        />
        <Text
          size="Body"
          color={theme.primary}
          text="During the days of sunsetting Sketch + Abstract to move on to Figma, I wrote a script leveraging Abstract's API to migrate ~750 legacy files off of the platform, thus saving 100s of hours doing it manually."
        />
      </Link>
    </div>
  );
};
