import React from 'react';
import { IListProps } from './list.model';
import { Text } from '../../components/text/text.component';
import './list.style.scss';

export const List = ({ ordered = false, listItems, size }: IListProps) => {
  const ol = (
    <ol>
      {listItems.map((l) => {
        return (
          <li>
            <Text size={size} text={l} />
          </li>
        );
      })}
    </ol>
  );

  const ul = (
    <ul>
      {listItems.map((l) => {
        return (
          <li>
            <Text size={size} text={l} />
          </li>
        );
      })}
    </ul>
  );

  return <div className="list">{ordered ? ol : ul}</div>;
};

export default List;
