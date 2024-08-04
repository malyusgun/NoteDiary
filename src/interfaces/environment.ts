export type TThemes =
  | 'green-blue'
  | 'red-yellow'
  | 'darkBlue-pink-orange'
  | 'pink-lightBlue-green'
  | 'pink-red-orange'
  | 'pink-purple'
  | 'purple-pink';

export interface IImage {
  uuid: string;
  name: string;
  url: string;
  width: number;
  height: number;
}
