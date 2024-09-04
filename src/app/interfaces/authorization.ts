import type { TColors } from '@/app/interfaces/environment';

export interface IUserData {
  user_uuid: string;
  nick_name: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email: string;
  phone_number?: string;
  settings: IUserSettings;
}
interface IUserSettings {
  favoriteColor: TColors;
}
