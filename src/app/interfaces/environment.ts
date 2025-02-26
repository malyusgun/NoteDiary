import type { IDivider, IImage, IParagraph, ITable } from '@/app/interfaces/entities';

export interface ISheet {
  sheet_uuid: string;
  sheet_title: string;
  sheet_icon: string;
  sheet_children: string[];
  background_path?: string;
  sheet_entities?: string;
}

export type TEntity = IDivider | IParagraph | IImage | ITable;

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
