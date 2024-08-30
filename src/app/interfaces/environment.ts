import type { ITableColumn } from '@/app/interfaces/entities';

export interface ISheet {
  sheet_uuid: string;
  title: string;
  address: string;
  entities: IEntity[];
}

export interface IEntity {
  entity_uuid: string;
  entity_user?: string;
  user_nick_name?: string;
  entity_order?: number;
  entity_type: string;
  divider_height?: number;
  divider_type?: 'solid' | 'dashed' | 'dotted';
  title?: string | null;
  text?: string | null;
  font_size?: string | null;
  paragraph_size?: string | null;
  text_position?: string | null;
  image_buffer?: string;
  imageUrl?: string;
  image_width?: number;
  image_height?: number;
  entity_position?: string;
  entity_title_position?: string;
  image_scale?: string;
  table_columns?: ITableColumn[];
  table_data?: {
    [key: string]: never;
  }[];
}

export type TThemes =
  | 'green-blue'
  | 'red-yellow'
  | 'darkBlue-pink-orange'
  | 'pink-lightBlue-green'
  | 'pink-red-orange'
  | 'pink-purple'
  | 'purple-pink';
