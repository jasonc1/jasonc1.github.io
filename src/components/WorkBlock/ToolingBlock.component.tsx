import { Text } from "../text/text.component";

export const ToolingBlock = () => {
  return (
    <div className="work-short-block" id="tooling-block">
      <Text size="Header" text="Tooling" />
      <div className="item-row">
        <Text size="Body-bold" text="Sapling /" />
        <Text
          size="Body"
          text="Sapling is a figma plugin that creates a set page structure and cover page for new figma files. Think of it as a figma file initializer."
        />
      </div>
      <div className="item-row">
        <Text size="Body-bold" text="Haven /" />
        <Text
          size="Body"
          text="Haven is a figma plugin I built to help product designers document and protect their explorations and archived screens as well as tagging screens for better handoff. Haven was a small side project and an opportunity to explore tooling for the Product design team within Figma."
        />
      </div>
      <div className="item-row">
        <Text size="Body-bold" text="Abstract migrate /" />
        <Text
          size="Body"
          text="During the days of sunsetting Sketch + Abstract to move on to Figma, I wrote a script leveraging Abstract's API to migrate ~750 legacy files off of the platform, thus saving 100s of hours doing it manually."
        />
      </div>
    </div>
  );
};
