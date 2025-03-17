import { JSX } from "react";

export type contentElement = {
  section: string;
  content: React.ReactNode[];
};
export interface IProjectsProps {
  title: string;
  date: string;
  image?: string;
  image_caption?: string;
  summary: string | JSX.Element;
  content: contentElement[];
}
