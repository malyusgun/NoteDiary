import type { TThemes } from '@/app/interfaces/environment';
import type { IImage } from '@/app/interfaces/entities';

export interface IUserData {
  user_uuid: string;
  nick_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone_number: string;
  settings: IUserSettings;
}
interface IUserSettings {
  theme: TThemes;
  background: IImage;
}
