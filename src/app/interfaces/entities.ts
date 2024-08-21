import type { IEntity } from '@/app/interfaces/environment';

export interface ITable extends IEntity {
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

export interface IText extends IEntity {
  entity_type: 'text';
  entity_uuid: string;
  title?: string;
  text: string;
  font_size?: '16' | '20' | '24' | '40' | '64';
  paragraph_size?: 'full' | 'half';
  entity_title_position: 'left' | 'center' | 'right';
  entity_position: 'left' | 'center' | 'right';
}

export interface IImage extends IEntity {
  entity_type: 'image';
  entity_uuid: string;
  title?: string;
  text?: string;
  font_size?: '16' | '20' | '24' | '40' | '64';
  paragraph_size?: 'full' | 'half';
  text_position?: 'left' | 'right';
  image_url: string;
  image_width: number;
  image_height: number;
  image_scale: string;
  entity_title_position: 'left' | 'center' | 'right';
  entity_position: 'left' | 'center' | 'right';
}
