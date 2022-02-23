import { ICommonModel } from './_common.interface';

export interface IUser extends ICommonModel {
  gender: number, // Unknown/Other or 0, Male or 1, Female or 2
  
  firstname: string,
  middlename: string,
  lastname: string,

  username: string,
  email: string,
  password: string,

  phone: string,
  bio: string,
  icon_link: string,
  icon_id: string,
  photo_id_link: string,
  photo_id_id: string,
  wallpaper_link: string,
  wallpaper_id: string,

  latest_lat: number,
  latest_lng: number,
  latlng_last_updated: string,

  is_public: boolean,
  
  person_verified: boolean,
  email_verified: boolean,
  phone_verified: boolean,
  allow_messaging: boolean,
  allow_conversations: boolean,
  allow_watches: boolean,
  notifications_last_opened: string,
  uuid: string,
  push_notification_token: string,
}

export interface IUserLocationUpdate extends ICommonModel {
  user_id:          number,
  automated:        boolean,
  device:           string,
  ip_addr:          string,
  user_agent:       string,
  lat:              number,
  lng:              number,
  uuid:             string,
}