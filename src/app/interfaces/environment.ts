import type { ITableColumn } from '@/app/interfaces/entities';

export interface ISheet {
  sheet_uuid: string;
  sheet_title: string;
  sheet_icon: string;
  sheet_navigation_order: string;
  background_path?: string;
  sheet_entities?: string;
}

export interface IEntity {
  entity_uuid?: string;
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
  image_buffer?: string | ArrayBuffer;
  image_url_initial?: string;
  image_width_initial?: number;
  file_width_initial?: number;
  file_height_initial?: number;
  image_url?: string;
  image_width?: number;
  file_width?: number;
  file_height?: number;
  entity_position?: string;
  entity_title_position?: string;
  image_scale?: string;
  table_columns?: ITableColumn[];
  table_data?: {
    [key: string]: never;
  }[];
}

export type TTheme =
  | 'slate'
  | 'blue'
  | 'sky'
  | 'teal'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'pink'
  | 'fuchsia'
  | 'purple'
  | 'indigo'
  | 'rose'
  | 'red';
