/** Available user's roles */
export enum UserRole {
  admin = "admin",
  user = "user",
  moderator = "moderator",
}
/** User's status, for requests availability */

export enum UserStatus {
  available = "available",
  do_not_disturb = "do_not_disturb",
}
/** Kind of available things that user is willing / interested in doing */

export interface IAvailability {
  mods: boolean;
  guest_diffs: boolean;
  playtesting: boolean;
}
/** Gamemodes that user prefers to do */

export interface IUserPreferences {
  std: boolean;
  taiko: boolean;
  ctb: boolean;
  mania: boolean;
}

export interface IUserNotificationPreferences {
  email: boolean;
  app_notification: boolean;
}
/** Basic User interface, with main properties */

export interface IUser {
  id: string;
  osu_id: string;
  name: string;
  active: boolean;
  avatar_url: string;
  banner_url?: string;
  availability: IAvailability;
  // journeys?: IJourney[];
  community_role: string;
  role: UserRole;
  preferences: IUserPreferences;
  status: UserStatus;
  description?: string;
  // queue?: IJourney[];
  email: string;
  token_version: string;
  notification_preferences: IUserNotificationPreferences;
  follows: string[];
}
