import type { TDarkness, TSize, TThemeColor } from '@/app/interfaces/index';
import {
  ITableColumn,
  TTableColumnType
} from '@d.malygin/UI_storybook/src/common/interfaces/componentsProp';

export interface IDivider {
  entity_uuid?: string;
  entity_user?: string;
  user_nick_name?: string;
  entity_order?: number;
  entity_type: 'divider';
  divider_height: number;
  divider_type: 'solid' | 'dashed' | 'dotted';
}

export interface IParagraph {
  entity_uuid?: string;
  entity_user?: string;
  user_nick_name?: string;
  entity_order?: number;
  entity_type: 'paragraph';
  title?: string | null;
  text: string;
  font_size?: '16' | '20' | '24' | '40' | '64';
  paragraph_size?: 'full' | 'half';
  entity_title_position?: 'left' | 'center' | 'right';
  entity_position: 'left' | 'center' | 'right';
}

export interface IImage {
  entity_uuid?: string;
  entity_user?: string;
  user_nick_name?: string;
  entity_order?: number;
  entity_type: 'image';
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
  entity_title_position?: 'left' | 'center' | 'right';
  entity_position: 'left' | 'center' | 'right';
}

export interface ITable {
  entity_uuid?: string;
  entity_user?: string;
  user_nick_name?: string;
  entity_order?: number;
  entity_type: 'table';
  title?: string | null;
  entity_title_position?: 'left' | 'center' | 'right';
  entity_position: 'left' | 'center' | 'right';
  table_columns?: ITableColumn[];
  table_data?: unknown[][];
  multipleSort?: boolean;
  gap?: string;
  size?: TSize;
  showAllLines?: boolean;
  stripedRows?: boolean;
  center?: boolean;
  fontSize?: string;
  theme?: TThemeColor;
  textColor?: TThemeColor;
  darknessTheme?: TDarkness;
  darknessTextColor?: TDarkness;
  paginator?: boolean;
  editable?: boolean;
  noEditingSettings?: {
    columns?: number[];
    rows?: number[];
    cells?: [number, number][];
  };
  handlers?: {
    cell: [number, number];
    handler?: () => void;
  }[];
}

export { ITableColumn, TTableColumnType };
