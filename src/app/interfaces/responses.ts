import type { TTheme } from '@/app/interfaces/environment';

export interface IUserDB {
  user_uuid: string;
  nick_name: string;
  phone_number?: string;
  email: string;
  favorite_color: TTheme;
  user_sheets: JSON;
}
