import React from 'react';
import { IProjectsProps } from './prose.model';
import { Text } from '../../text/text.component';
import { Footer } from '../../footer/footer.component';
import { theme } from '../../../colors.js';
import './prose.style.scss';

export const Prose = ({ content, date, summary, title }: IProjectsProps) => {
  return (
    <div className="prose">
      <div className="prose-block">
        <Text
          size="display-1"
          color={theme.black}
          text={title}
          marginBottom={16}
        />
        <i>
          <Text
            size="body-1"
            color={theme.black}
            text={date}
            marginBottom={16}
          />
        </i>
        <Text
          size="body-1"
          color={theme.black}
          text={summary}
          marginBottom={8}
        />
      </div>
      {content.map((c) => {
        if (c.section && c.content) {
          return (
            <div className="prose-block">
              <Text
                size="display-2"
                color={theme.black}
                text={c.section}
                marginBottom={16}
              />
              {c.content.map((contentBlock) => {
                if (contentBlock && contentBlock.type === 'div') {
                  return (
                    <Text
                      size="body-1"
                      color={theme.black}
                      text={contentBlock}
                      marginBottom={16}
                    />
                  );
                } else if (contentBlock && contentBlock.type === 'img') {
                  return contentBlock;
                } else {
                  return contentBlock;
                }
              })}
            </div>
          );
        } else {
          return null;
        }
      })}
      <Footer color={theme.black} marginTop={80} />
    </div>
  );
};

export default Prose;
