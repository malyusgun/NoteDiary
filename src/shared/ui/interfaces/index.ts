export type TThemeColor =
  | 'white'
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
  | 'red'
  | 'black';

export interface ITableItem {
  label: string;
  link?: string;
  color?: string;
  iconBefore?: string;
  iconAfter?: string;
  iconColor?: string;
  children?: ITableItem[];
}
