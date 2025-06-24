import { TravelStyle, TravelerType } from '@/types';

// Helper functions
export const getTravelerTypeFromStyle = (style: TravelStyle): TravelerType => {
  const mapping: { [key in TravelStyle]: TravelerType } = {
    'Romantic': 'couple',
    'Family': 'family',
    'Solo': 'solo'
  };
  return mapping[style];
};

export const getTravelStyleDisplay = (style: TravelStyle): string => {
  const mapping: { [key in TravelStyle]: string } = {
    'Solo': 'Chill Trip',
    'Romantic': 'Casual Adventure',
    'Family': 'Offbeat Journey'
  };
  return mapping[style] || 'Adventure';
};

export const getTravelerTypeDisplay = (type: TravelerType): string => {
  const mapping: { [key in TravelerType]: string } = {
    'solo': 'Chill Trip',
    'couple': 'Casual Adventure',
    'family': 'Offbeat Journey',
    'friends': 'Group Adventure',
    'business': 'Business Travel'
  };
  return mapping[type] || 'Adventure';
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};