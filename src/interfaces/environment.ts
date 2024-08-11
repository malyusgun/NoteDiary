import type { IImage, ITable, IText } from '@/interfaces/entities';

export interface ISheet {
  uuid: string;
  title: string;
  address: string;
  entities: IEntity[];
}

export type IEntity = IText | ITable | IImage;

export type TThemes =
  | 'green-blue'
  | 'red-yellow'
  | 'darkBlue-pink-orange'
  | 'pink-lightBlue-green'
  | 'pink-red-orange'
  | 'pink-purple'
  | 'purple-pink';
