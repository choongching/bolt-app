// Comprehensive visa requirements database
// Last updated: December 2024
// Sources: Official government websites, embassy information, and travel advisories

export interface VisaRequirement {
  country: string;
  city: string;
  requirements: {
    us_citizens: string;
    eu_citizens: string;
    uk_citizens: string;
    canadian_citizens: string;
    australian_citizens: string;
    general: string;
  };
  duration_allowed: string;
  notes: string[];
  last_updated: string;
  sources: string[];
}

export const visaRequirements: VisaRequirement[] = [
  {
    country: 'Greece',
    city: 'Santorini',
    requirements: {
      us_citizens: 'No visa required for stays up to 90 days',
      eu_citizens: 'No visa required (freedom of movement)',
      uk_citizens: 'No visa required for stays up to 90 days',
      canadian_citizens: 'No visa required for stays up to 90 days',
      australian_citizens: 'No visa required for stays up to 90 days',
      general: 'Most tourists can visit visa-free for 90 days within 180-day period'
    },
    duration_allowed: '90 days within 180-day period',
    notes: [
      'Part of Schengen Area',
      'Passport must be valid for at least 3 months beyond departure',
      'Return ticket may be required',
      'Sufficient funds proof may be requested'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Greek Ministry of Foreign Affairs',
      'Schengen Visa Info'
    ]
  },
  {
    country: 'Japan',
    city: 'Kyoto',
    requirements: {
      us_citizens: 'No visa required for stays up to 90 days',
      eu_citizens: 'No visa required for stays up to 90 days (most EU countries)',
      uk_citizens: 'No visa required for stays up to 90 days',
      canadian_citizens: 'No visa required for stays up to 90 days',
      australian_citizens: 'No visa required for stays up to 90 days',
      general: 'Tourist visa waiver for most developed countries up to 90 days'
    },
    duration_allowed: '90 days',
    notes: [
      'Passport must be valid for duration of stay',
      'Return or onward ticket required',
      'Sufficient funds proof may be requested',
      'No work permitted on tourist status'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Japan National Tourism Organization',
      'Ministry of Foreign Affairs of Japan'
    ]
  },
  {
    country: 'Peru',
    city: 'Cusco',
    requirements: {
      us_citizens: 'No visa required for stays up to 90 days',
      eu_citizens: 'No visa required for stays up to 90 days',
      uk_citizens: 'No visa required for stays up to 90 days',
      canadian_citizens: 'No visa required for stays up to 90 days',
      australian_citizens: 'No visa required for stays up to 90 days',
      general: 'Most tourists can visit visa-free for up to 90 days'
    },
    duration_allowed: '90 days (extendable to 183 days)',
    notes: [
      'Passport must be valid for at least 6 months',
      'Return or onward ticket required',
      'Tourist card (TAM) issued on arrival',
      'Yellow fever vaccination recommended for jungle areas'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Embassy of Peru',
      'PROMPERÚ'
    ]
  },
  {
    country: 'Indonesia',
    city: 'Ubud',
    requirements: {
      us_citizens: 'Visa on arrival (30 days) or e-Visa',
      eu_citizens: 'Visa on arrival (30 days) or e-Visa for most EU countries',
      uk_citizens: 'Visa on arrival (30 days) or e-Visa',
      canadian_citizens: 'Visa on arrival (30 days) or e-Visa',
      australian_citizens: 'Visa on arrival (30 days) or e-Visa',
      general: 'Visa on arrival or e-Visa required for most countries'
    },
    duration_allowed: '30 days (extendable once for 30 days)',
    notes: [
      'Passport must be valid for at least 6 months',
      'At least 2 blank pages required',
      'Return or onward ticket required',
      'Visa fee: $35 USD',
      'e-Visa available online before travel'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Indonesian Ministry of Foreign Affairs',
      'Indonesia.travel'
    ]
  },
  {
    country: 'Iceland',
    city: 'Reykjavik',
    requirements: {
      us_citizens: 'No visa required for stays up to 90 days',
      eu_citizens: 'No visa required (freedom of movement)',
      uk_citizens: 'No visa required for stays up to 90 days',
      canadian_citizens: 'No visa required for stays up to 90 days',
      australian_citizens: 'No visa required for stays up to 90 days',
      general: 'Most tourists can visit visa-free for 90 days within 180-day period'
    },
    duration_allowed: '90 days within 180-day period',
    notes: [
      'Part of Schengen Area',
      'Passport must be valid for at least 3 months beyond departure',
      'Return ticket may be required',
      'Travel insurance recommended',
      'High cost of living - budget accordingly'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Directorate of Immigration Iceland',
      'Visit Iceland'
    ]
  },
  {
    country: 'UAE',
    city: 'Dubai',
    requirements: {
      us_citizens: 'Visa on arrival (30 days) - Free',
      eu_citizens: 'Visa on arrival (30 days) - Free for most EU countries',
      uk_citizens: 'Visa on arrival (30 days) - Free',
      canadian_citizens: 'Visa on arrival (30 days) - Free',
      australian_citizens: 'Visa on arrival (30 days) - Free',
      general: 'Free visa on arrival for many countries, others require advance visa'
    },
    duration_allowed: '30 days (extendable to 90 days)',
    notes: [
      'Passport must be valid for at least 6 months',
      'Return or onward ticket required',
      'Sufficient funds proof may be requested',
      'Alcohol and drug laws are strict',
      'Dress modestly in public areas'
    ],
    last_updated: '2024-12-23',
    sources: [
      'UAE Federal Authority for Identity and Citizenship',
      'Visit Dubai'
    ]
  },
  {
    country: 'New Zealand',
    city: 'Queenstown',
    requirements: {
      us_citizens: 'NZeTA (Electronic Travel Authority) required',
      eu_citizens: 'NZeTA (Electronic Travel Authority) required',
      uk_citizens: 'NZeTA (Electronic Travel Authority) required',
      canadian_citizens: 'NZeTA (Electronic Travel Authority) required',
      australian_citizens: 'No visa required (special category)',
      general: 'NZeTA required for most visa-waiver countries'
    },
    duration_allowed: '90 days within 18-month period',
    notes: [
      'NZeTA must be obtained before travel',
      'NZeTA fee: NZ$23 online or NZ$17 via app',
      'International Visitor Conservation and Tourism Levy: NZ$35',
      'Passport must be valid for at least 3 months beyond departure',
      'Return or onward ticket required'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Immigration New Zealand',
      'New Zealand Government'
    ]
  },
  {
    country: 'Morocco',
    city: 'Marrakech',
    requirements: {
      us_citizens: 'No visa required for stays up to 90 days',
      eu_citizens: 'No visa required for stays up to 90 days',
      uk_citizens: 'No visa required for stays up to 90 days',
      canadian_citizens: 'No visa required for stays up to 90 days',
      australian_citizens: 'No visa required for stays up to 90 days',
      general: 'Most tourists can visit visa-free for up to 90 days'
    },
    duration_allowed: '90 days',
    notes: [
      'Passport must be valid for at least 6 months',
      'Return or onward ticket may be required',
      'Entry stamp required - ensure passport is stamped',
      'Respect local customs and dress codes',
      'Friday is the holy day'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Moroccan Ministry of Foreign Affairs',
      'Morocco Tourism Board'
    ]
  }
];

// Helper functions for visa requirement lookups
export const getVisaRequirementByDestination = (country: string, city?: string): VisaRequirement | null => {
  return visaRequirements.find(req => 
    req.country.toLowerCase() === country.toLowerCase() && 
    (!city || req.city.toLowerCase() === city.toLowerCase())
  ) || null;
};

export const getVisaRequirementForCitizen = (country: string, citizenshipCountry: string): string => {
  const requirement = getVisaRequirementByDestination(country);
  if (!requirement) return 'Visa requirements not available - check with embassy';

  const citizenship = citizenshipCountry.toLowerCase();
  
  switch (citizenship) {
    case 'us':
    case 'usa':
    case 'united states':
      return requirement.requirements.us_citizens;
    case 'uk':
    case 'united kingdom':
    case 'britain':
      return requirement.requirements.uk_citizens;
    case 'canada':
      return requirement.requirements.canadian_citizens;
    case 'australia':
      return requirement.requirements.australian_citizens;
    default:
      // Check if it's an EU country
      const euCountries = [
        'austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czech republic',
        'denmark', 'estonia', 'finland', 'france', 'germany', 'greece',
        'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg',
        'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia',
        'slovenia', 'spain', 'sweden'
      ];
      
      if (euCountries.includes(citizenship)) {
        return requirement.requirements.eu_citizens;
      }
      
      return requirement.requirements.general;
  }
};

export const formatVisaRequirement = (requirement: VisaRequirement, userCountry?: string): string => {
  if (userCountry) {
    return getVisaRequirementForCitizen(requirement.country, userCountry);
  }
  return requirement.requirements.general;
};

// Get the most recent update date
export const getLastUpdateDate = (): string => {
  const dates = visaRequirements.map(req => new Date(req.last_updated));
  const mostRecent = new Date(Math.max(...dates.map(date => date.getTime())));
  return mostRecent.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};