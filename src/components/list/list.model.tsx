import { typeSizes } from '../../components/text/text.model';

export interface IListProps {
  ordered?: boolean;
  listItems: string[];
  size: typeSizes;
}
