import type { TTheme } from '@/app/interfaces/environment';

export interface IToggleButtonOption {
  label: string;
  value?: string | number | boolean;
  textColor?: TTheme;
  backgroundColor?: TTheme;
  isLabelHidden?: boolean;
  iconPos?: string;
  textStyle?: 'bold' | 'italic';
}
export interface ISliderOption {
  label: string;
  value: string | number;
  color?: string;
}
