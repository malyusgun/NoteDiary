export interface ISheet {
  sheet_uuid: string;
  title: string;
  address: string;
  entities: IEntity[];
}

export interface IEntity {
  entity_uuid: string;
  entity_user?: string;
  user_nick_name?: string;
  entity_order?: number;
  entity_type: string;
  title?: string;
  text?: string;
  font_size?: string;
  paragraph_size?: string;
  text_position?: string;
  image_blob?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  entity_position?: string;
  entity_title_position?: string;
  image_scale?: string;
  table_columns?: string;
  table_data?: string;
}

export type TThemes =
  | 'green-blue'
  | 'red-yellow'
  | 'darkBlue-pink-orange'
  | 'pink-lightBlue-green'
  | 'pink-red-orange'
  | 'pink-purple'
  | 'purple-pink';
