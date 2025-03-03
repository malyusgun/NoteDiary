import type { IEntity } from '@/app/interfaces/environment';

export interface ITable extends IEntity {
  entity_type: 'table';
  entity_uuid: string;
  title?: string | null;
  text?: string | null;
  table_columns: ITableColumn[];
  table_data: {
    [key: string]: never;
  }[];
}
export interface ITableColumn {
  column_uuid?: string;
  name: string;
  type: ITableColumnTypes;
  data?: never;
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

export interface IDivider extends IEntity {
  entity_type: 'divider';
  entity_uuid: string;
  divider_height: number;
  divider_type: 'solid' | 'dashed' | 'dotted';
}

export interface IParagraph extends IEntity {
  entity_type: 'paragraph';
  entity_uuid: string;
  title?: string | null;
  text: string;
  font_size?: '16' | '20' | '24' | '40' | '64';
  paragraph_size?: 'full' | 'half';
  entity_title_position: 'left' | 'center' | 'right';
  entity_position: 'left' | 'center' | 'right';
}

export interface IImage extends IEntity {
  entity_type: 'image';
  entity_uuid: string;
  title?: string | null;
  text?: string | null;
  font_size?: '16' | '20' | '24' | '40' | '64' | null;
  paragraph_size?: 'full' | 'half' | null;
  text_position?: 'left' | 'right' | null;
  image_url_initial: string;
  image_width_initial: number;
  file_width_initial: number;
  file_height_initial: number;
  image_buffer?: string[] | ArrayBuffer[];
  image_url: string;
  image_width: number;
  file_width: number;
  file_height: number;
  image_scale: string;
  entity_title_position: 'left' | 'center' | 'right';
  entity_position: 'left' | 'center' | 'right';
}
