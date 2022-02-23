import { EVENT_TYPES, PULSE_CODES } from "../enums/all.enums";

export const APP_PRIMARY_COLOR: string = '#e35d5d';
export const APP_SECONDARY_COLOR: string = '#737680';

export const genderOptions = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Other', value: 0 },
];

// https://stackoverflow.com/questions/6903823/regex-for-youtube-id/6904504
export const youtube_regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

export const ratingOptions = Array(5).fill(0).map((k, i) => i + 1);

export const JWT_NAME = 'rmw-safestar-jwt';


// events that a user can/should listen for

export const user_conversation_events = [
  EVENT_TYPES.CONVERSATION_MEMBER_ADDED,
  EVENT_TYPES.CONVERSATION_MEMBER_REMOVED,
  EVENT_TYPES.CONVERSATION_MEMBER_REQUESTED,
  EVENT_TYPES.CONVERSATION_MEMBER_REQUEST_CANCELED,
  EVENT_TYPES.CONVERSATION_MEMBER_REQUEST_ACCEPTED,
  EVENT_TYPES.CONVERSATION_MEMBER_REQUEST_REJECTED,
];

export const user_watch_events = [
  EVENT_TYPES.WATCH_MEMBER_ADDED,
  EVENT_TYPES.WATCH_MEMBER_REMOVED,
  EVENT_TYPES.WATCH_MEMBER_REQUESTED,
  EVENT_TYPES.WATCH_MEMBER_REQUEST_CANCELED,
  EVENT_TYPES.WATCH_MEMBER_REQUEST_ACCEPTED,
  EVENT_TYPES.WATCH_MEMBER_REQUEST_REJECTED,
];

export const user_tracking_events = [
  EVENT_TYPES.NEW_TRACKER_REQUEST,
  EVENT_TYPES.NEW_TRACKER_REQUEST_CANCELED,
  EVENT_TYPES.NEW_TRACKER_REQUEST_ACCEPTED,
  EVENT_TYPES.NEW_TRACKER_REQUEST_REJECTED,
  EVENT_TYPES.STOP_TRACKER,
  EVENT_TYPES.STOP_TRACKING,
];

export const user_pulse_events = [
  EVENT_TYPES.NEW_PULSE,
];

export const user_checkpoint_events = [
  EVENT_TYPES.NEW_CHECKPOINT,
  EVENT_TYPES.NEW_CHECKPOINT_RESPONSE,
];

export const user_notification_events = [
  ...user_conversation_events,
  ...user_watch_events,
  ...user_tracking_events,
  ...user_pulse_events,
  ...user_checkpoint_events,
];



export const PULSE_CODES_GENERIC = [
  PULSE_CODES.OKAY,
  PULSE_CODES.WARNING,
  PULSE_CODES.IN_DANGER,
];
export const PULSE_CODES_OKAY = [
  PULSE_CODES.REACHED_HOME_SAFE,
  PULSE_CODES.REACHED_DESTINATION_SAFE,
];
export const PULSE_CODES_WARNING = [
  PULSE_CODES.UNKNOWN_AREA,
  PULSE_CODES.PHONE_NEAR_DEAD,
  PULSE_CODES.FEELS_UNSAFE,
  PULSE_CODES.OUTSIDE_ALONE,
];
export const PULSE_CODES_DANGER = [
  PULSE_CODES.ABUSER_NEARBY,
  PULSE_CODES.BEING_STALKED,
  PULSE_CODES.BEING_FOLLOWED,
  PULSE_CODES.APPROACHED_BY_STRANGER,
  PULSE_CODES.HARASSED_BY_STRANGER,
];
export const PULSE_CODES_ALL = [
  ...PULSE_CODES_GENERIC,
  ...PULSE_CODES_OKAY,
  ...PULSE_CODES_WARNING,
  ...PULSE_CODES_DANGER,
];