import { Text } from "../text/text.component";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Text size="Header" text={`© JASON CHEN ${currentYear}`} />
    </footer>
  );
};
