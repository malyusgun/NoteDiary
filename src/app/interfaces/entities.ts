export interface ITable {
  entity_type: 'table';
  entity_uuid: string;
  title?: string;
  text?: string;
  table_columns: ITableColumn[];
  table_data: {
    [key: string]: any;
  }[];
}
interface ITableColumn {
  column_uuid: string;
  name: string;
  type: ITableColumnTypes;
  data: any;
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
  entity_type: 'text';
  entity_uuid: string;
  title?: string;
  text: string;
}

export interface IImage {
  entity_type: 'image';
  entity_uuid: string;
  title?: string;
  text?: string;
  image_data: string;
  image_width: number;
  image_height: number;
  image_position: 'left' | 'center' | 'right';
}
