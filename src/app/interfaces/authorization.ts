import type { ISheet, TTheme } from '@/app/interfaces/environment';

export interface IUser {
  user_uuid: string;
  nick_name: string;
  phone_number?: string;
  email: string;
  favorite_color: TTheme;
  user_sheets: ISheet[];
}
