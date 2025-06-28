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
  // Casual Adventure Destinations
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
    country: 'Italy',
    city: 'Venice',
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
      'Tourist tax may apply in Venice'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Italian Ministry of Foreign Affairs',
      'Schengen Visa Info'
    ]
  },
  {
    country: 'France',
    city: 'Paris',
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
      'French Ministry of Foreign Affairs',
      'Schengen Visa Info'
    ]
  },
  {
    country: 'Maldives',
    city: 'Malé',
    requirements: {
      us_citizens: 'Free visa on arrival (30 days)',
      eu_citizens: 'Free visa on arrival (30 days)',
      uk_citizens: 'Free visa on arrival (30 days)',
      canadian_citizens: 'Free visa on arrival (30 days)',
      australian_citizens: 'Free visa on arrival (30 days)',
      general: 'Free visa on arrival for most countries'
    },
    duration_allowed: '30 days (extendable)',
    notes: [
      'Passport must be valid for at least 6 months',
      'Return or onward ticket required',
      'Confirmed accommodation booking required',
      'Sufficient funds proof may be requested',
      'No alcohol allowed except in resorts'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Maldives Immigration',
      'Visit Maldives'
    ]
  },

  // Offbeat Journey Destinations
  {
    country: 'United States',
    city: 'Orlando',
    requirements: {
      us_citizens: 'No visa required (domestic travel)',
      eu_citizens: 'ESTA or B-2 visa required',
      uk_citizens: 'ESTA or B-2 visa required',
      canadian_citizens: 'No visa required for stays up to 90 days',
      australian_citizens: 'ESTA or B-2 visa required',
      general: 'ESTA or tourist visa required for most countries'
    },
    duration_allowed: '90 days (ESTA) or as per visa',
    notes: [
      'ESTA must be obtained before travel',
      'ESTA fee: $21 USD',
      'Passport must be valid for at least 6 months',
      'Return or onward ticket required'
    ],
    last_updated: '2024-12-23',
    sources: [
      'U.S. Department of State',
      'CBP.gov'
    ]
  },
  {
    country: 'Australia',
    city: 'Sydney',
    requirements: {
      us_citizens: 'ETA or eVisitor required',
      eu_citizens: 'ETA or eVisitor required',
      uk_citizens: 'ETA or eVisitor required',
      canadian_citizens: 'ETA or eVisitor required',
      australian_citizens: 'No visa required (domestic travel)',
      general: 'ETA, eVisitor, or tourist visa required'
    },
    duration_allowed: '90 days (ETA/eVisitor)',
    notes: [
      'ETA fee: AUD $20',
      'eVisitor is free for eligible EU citizens',
      'Passport must be valid for at least 6 months',
      'Return or onward ticket required'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Australian Department of Home Affairs',
      'Australia.gov.au'
    ]
  },
  {
    country: 'Canada',
    city: 'Calgary',
    requirements: {
      us_citizens: 'No visa required for stays up to 180 days',
      eu_citizens: 'eTA required for air travel',
      uk_citizens: 'eTA required for air travel',
      canadian_citizens: 'No visa required (domestic travel)',
      australian_citizens: 'eTA required for air travel',
      general: 'eTA or visitor visa required for most countries'
    },
    duration_allowed: '180 days (eTA)',
    notes: [
      'eTA fee: CAD $7',
      'eTA must be obtained before travel',
      'Passport must be valid for duration of stay',
      'Return or onward ticket may be required'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Immigration, Refugees and Citizenship Canada',
      'Canada.ca'
    ]
  },
  {
    country: 'Singapore',
    city: 'Singapore',
    requirements: {
      us_citizens: 'No visa required for stays up to 90 days',
      eu_citizens: 'No visa required for stays up to 90 days',
      uk_citizens: 'No visa required for stays up to 90 days',
      canadian_citizens: 'No visa required for stays up to 90 days',
      australian_citizens: 'No visa required for stays up to 90 days',
      general: 'Visa-free for most countries (30-90 days depending on nationality)'
    },
    duration_allowed: '30-90 days depending on nationality',
    notes: [
      'Passport must be valid for at least 6 months',
      'Return or onward ticket required',
      'Sufficient funds proof may be requested',
      'Very strict drug laws'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Immigration & Checkpoints Authority Singapore',
      'VisitSingapore.com'
    ]
  },

  // Chill Trip Destinations - UPDATED LIST
  {
    country: 'Portugal',
    city: 'Lisbon',
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
      'Excellent value for money destination'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Portuguese Ministry of Foreign Affairs',
      'Schengen Visa Info'
    ]
  },
  {
    country: 'Slovenia',
    city: 'Bled',
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
      'Hidden gem with fewer crowds than other European destinations'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Slovenian Ministry of Foreign Affairs',
      'Schengen Visa Info'
    ]
  },
  {
    country: 'Uruguay',
    city: 'Montevideo',
    requirements: {
      us_citizens: 'No visa required for stays up to 90 days',
      eu_citizens: 'No visa required for stays up to 90 days',
      uk_citizens: 'No visa required for stays up to 90 days',
      canadian_citizens: 'No visa required for stays up to 90 days',
      australian_citizens: 'No visa required for stays up to 90 days',
      general: 'Most tourists can visit visa-free for up to 90 days'
    },
    duration_allowed: '90 days (extendable to 180 days)',
    notes: [
      'Passport must be valid for at least 6 months',
      'Return or onward ticket may be required',
      'One of South America\'s safest countries',
      'Progressive and peaceful society'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Uruguay Ministry of Foreign Affairs',
      'Uruguay Tourism'
    ]
  },
  {
    country: 'Malta',
    city: 'Valletta',
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
      'English widely spoken',
      'Compact size makes it easy to explore'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Malta Tourism Authority',
      'Schengen Visa Info'
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