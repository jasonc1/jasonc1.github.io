import { JsxElement } from "typescript";

export interface IWorkBlockProps {
  link: string;
  detail: {
    project: string;
    company: string;
    role: string;
    duration: string;
    description: string;
    img: string;
    alt: string;
  };
}
