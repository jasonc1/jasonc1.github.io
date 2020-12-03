import React from 'react';
import { IProjectsProps } from './projects.model';
import { Text } from '../../text/text.component';
import { theme } from '../../../colors.js';

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
                console.log(contentBlock);
                if (contentBlock) {
                  return (
                    <Text
                      size="body-1"
                      color={theme.black}
                      text={contentBlock}
                      marginBottom={8}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Prose;
