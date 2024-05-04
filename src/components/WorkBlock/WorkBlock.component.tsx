import theme from "../../colors";
import { IWorkBlockProps } from "./WorkBlock.model";
import { Text } from "../text/text.component";
import "./workblock.style.scss";

export const WorkBlock = ({ detail }: IWorkBlockProps) => {
  return (
    <div className="work-block">
      <div className="work-block-header">
        <Text size="Header" color={theme.primary} text={detail.project} />
        <Text size="Header" color={theme.primary} text={detail.company} />
      </div>
      <div className="work-block-body">
        <div className="work-block-details">
          <div className="work-block-detail-row">
            <Text size="Body-bold" color={theme.primary} text="Role/" />
            <Text size="Body-bold" color={theme.primary} text={detail.role} />
          </div>
          <div className="work-block-detail-row">
            <Text size="Body-bold" color={theme.primary} text="Duration/" />
            <Text
              size="Body-bold"
              color={theme.primary}
              text={detail.duration}
            />
          </div>
          <div className="work-block-detail-row">
            <Text
              size="Body-bold"
              color={theme.primary}
              text={detail.description}
            />
          </div>
        </div>
        <div className="work-img">
          <img src={detail.img} alt={detail.alt} />
        </div>
      </div>
    </div>
  );
};
