// Application constants
export const APP_CONFIG = {
  name: 'GlobeWander Zap',
  description: 'Spin the globe and discover your next adventure',
  version: '1.0.0'
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
  USER_PREFERENCES: 'travel_preferences',
  RECENT_DESTINATIONS: 'recent_destinations'
} as const;