// Application constants
export const APP_CONFIG = {
  name: 'WanderSpin',
  description: 'Spin the globe, pick your style, and unlock your next adventure - Built with Bolt',
  version: '1.0.0',
  platform: 'Bolt'
} as const;

export const ANIMATION_DURATIONS = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  reveal: 1.0
} as const;

export const TRAVEL_STYLES = {
  SOLO: 'Solo',
  ROMANTIC: 'Romantic', 
  FAMILY: 'Family'
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'wanderspin_travel_preferences',
  RECENT_DESTINATIONS: 'wanderspin_recent_destinations',
  BOLT_SESSION: 'wanderspin_bolt_session'
} as const;