import type { ISheet, TTheme } from '@/app/interfaces/environment';

export interface IUser {
  user_uuid: string;
  nick_name: string;
  email: string;
  favorite_color: TTheme;
  user_sheets: ISheet[];
}
export interface IUserSignForm {
  nick_name: string;
  email: string;
  favorite_color: TTheme;
  password: string;
}
