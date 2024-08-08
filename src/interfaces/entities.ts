export interface ITable {
  type: 'table';
  uuid: string;
  title?: string;
  columns: ITableColumn[];
  data: {
    [key: string]: any;
  }[];
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

export interface IText {
  type: 'text';
  uuid: string;
  text: string;
  title?: string;
}

export interface IImage {
  type: 'image';
  uuid: string;
  name: string;
  url: string;
  width: number;
  height: number;
}
