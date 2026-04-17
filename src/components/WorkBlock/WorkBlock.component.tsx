import theme from "../../colors";
import { IWorkBlockProps } from "./WorkBlock.model";
import { Text } from "../text/text.component";
import "./workblock.style.scss";
import { Link } from "react-router-dom";

export const WorkBlock = ({ detail, link }: IWorkBlockProps) => {
  return (
    <Link to={link} viewTransition>
      <div className="work-block">
        <div className="block-header">
          <Text
            size="Header"
            color={theme.primary}
            text={detail.project}
            caps
            weight="medium"
          />
          <Text
            size="Header"
            color={theme.primary}
            text={detail.company}
            caps
            weight="medium"
          />
        </div>
        <div className="work-block-body">
          <div className="work-block-details">
            <div className="work-block-detail-row">
              <Text size="Body" color={theme.primary} text="Role /" weight="regular" />
              <Text
                size="Body"
                color={theme.primary}
                text={detail.role}
                weight="light"
              />
            </div>
            <div className="work-block-detail-row">
              <Text size="Body" color={theme.primary} text="Duration /" weight="regular" />
              <Text
                size="Body"
                color={theme.primary}
                text={detail.duration}
                weight="light"
              />
            </div>
            <div className="work-block-detail-description">
              <Text
                size="Body"
                color={theme.primary}
                text={detail.description}
                weight="light"
              />
            </div>
          </div>
          <div className="work-img">
            <img src={detail.img} alt={detail.alt} />
          </div>
        </div>
      </div>
    </Link>
  );
};
