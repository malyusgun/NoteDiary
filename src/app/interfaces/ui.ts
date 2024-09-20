import type { TTheme } from '@/app/interfaces/environment';

export interface IToggleButtonItem {
  label: string;
  textColor?: TTheme;
  backgroundColor?: TTheme;
  isLabelHidden?: boolean;
  iconPos?: string;
  textStyle?: 'bold' | 'italic';
}
export interface ISliderOption {
  label: string;
  value: number;
  color?: string;
}
