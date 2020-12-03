export type contentElement = {
  section: string;
  content: JSX.Element[];
};

export interface IProjectsProps {
  title: string;
  date: string;
  summary: JSX.Element;
  content: contentElement[];
}
