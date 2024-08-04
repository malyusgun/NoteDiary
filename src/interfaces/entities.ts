export interface ITable {
  uuid: string;
  name: string;
  columns: ITableColumn[];
  data: {
    [key: string]: any;
  };
}
interface ITableColumn {
  name: string;
  type: ITableColumnTypes;
}
type ITableColumnTypes =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'status'
  | 'rating'
  | 'knob';
