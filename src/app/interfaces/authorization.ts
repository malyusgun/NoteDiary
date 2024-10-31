import type { ISheet, TColors } from '@/app/interfaces/environment';
import type { IParagraph } from '@/app/interfaces/entities';

export interface IUser {
  user_uuid: string;
  nick_name: string;
  phone_number?: string;
  email: string;
  settings: IUserSettings;
  sheets: string[];
}
export interface ISignUp {
  createdUser: IUser;
  homeSheet: ISheet;
  startEntity: IParagraph;
}
interface IUserSettings {
  favoriteColor: TColors;
}
