import type { IImage, TThemes } from '@/interfaces/environment';

export interface IUserData {
  uuid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  settings: IUserSettings;
}
interface IUserSettings {
  theme: TThemes;
  background: IImage;
}
