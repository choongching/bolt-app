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
  // Casual Adventure Destinations - UPDATED WITH ADVENTUROUS BUT POPULAR
  {
    country: 'Nepal',
    city: 'Kathmandu',
    requirements: {
      us_citizens: 'Visa on arrival or e-visa required',
      eu_citizens: 'Visa on arrival or e-visa required',
      uk_citizens: 'Visa on arrival or e-visa required',
      canadian_citizens: 'Visa on arrival or e-visa required',
      australian_citizens: 'Visa on arrival or e-visa required',
      general: 'Visa on arrival or e-visa required for most countries'
    },
    duration_allowed: '15, 30, or 90 days',
    notes: [
      'Visa fee: $30 (15 days), $50 (30 days), $125 (90 days)',
      'Passport must be valid for at least 6 months',
      'Two passport photos required',
      'e-visa available online before travel',
      'Trekking permits required for certain areas'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Nepal Department of Immigration',
      'Nepal Tourism Board'
    ]
  },
  {
    country: 'Jordan',
    city: 'Petra',
    requirements: {
      us_citizens: 'Visa on arrival or Jordan Pass available',
      eu_citizens: 'Visa on arrival or Jordan Pass available',
      uk_citizens: 'Visa on arrival or Jordan Pass available',
      canadian_citizens: 'Visa on arrival or Jordan Pass available',
      australian_citizens: 'Visa on arrival or Jordan Pass available',
      general: 'Visa on arrival or Jordan Pass recommended'
    },
    duration_allowed: '30 days (extendable)',
    notes: [
      'Visa fee: 40 JOD (waived with Jordan Pass)',
      'Jordan Pass includes visa and major attractions',
      'Passport must be valid for at least 6 months',
      'Return or onward ticket required',
      'Very tourist-friendly and safe'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Jordan Ministry of Tourism',
      'Jordan Pass Official'
    ]
  },
  {
    country: 'Chile',
    city: 'San Pedro de Atacama',
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
      'Return or onward ticket required',
      'Tourist card (PDI) issued on arrival',
      'Excellent infrastructure for adventure tourism',
      'High altitude in Atacama - acclimatization needed'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Chile Ministry of Foreign Affairs',
      'SERNATUR Chile'
    ]
  },
  {
    country: 'Tanzania',
    city: 'Moshi',
    requirements: {
      us_citizens: 'Visa on arrival or e-visa required',
      eu_citizens: 'Visa on arrival or e-visa required',
      uk_citizens: 'Visa on arrival or e-visa required',
      canadian_citizens: 'Visa on arrival or e-visa required',
      australian_citizens: 'Visa on arrival or e-visa required',
      general: 'Visa required for most countries'
    },
    duration_allowed: '90 days',
    notes: [
      'Visa fee: $50 USD (single entry)',
      'e-visa recommended before travel',
      'Passport must be valid for at least 6 months',
      'Yellow fever vaccination required',
      'Excellent safari infrastructure and guides'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Tanzania Immigration Services',
      'Tanzania Tourism Board'
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
      'Yellow fever vaccination recommended for jungle areas',
      'Excellent tour operators for Inca Trail'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Embassy of Peru',
      'PROMPERÚ'
    ]
  },

  // Offbeat Journey Destinations - UPDATED WITH DANGEROUS/OFF-BEATEN COUNTRIES
  {
    country: 'Afghanistan',
    city: 'Bamyan',
    requirements: {
      us_citizens: 'Visa required - tourism extremely restricted and dangerous',
      eu_citizens: 'Visa required - tourism extremely restricted and dangerous',
      uk_citizens: 'Visa required - tourism extremely restricted and dangerous',
      canadian_citizens: 'Visa required - tourism extremely restricted and dangerous',
      australian_citizens: 'Visa required - tourism extremely restricted and dangerous',
      general: 'Tourism not recommended - extremely dangerous security situation'
    },
    duration_allowed: 'Variable (if permitted)',
    notes: [
      'CRITICAL: Travel not recommended by all governments',
      'Ongoing conflict and terrorism risk',
      'No tourist infrastructure available',
      'Embassy services extremely limited',
      'Evacuation assistance not available'
    ],
    last_updated: '2024-12-23',
    sources: [
      'US State Department Travel Advisory',
      'UK Foreign Office'
    ]
  },
  {
    country: 'Somalia',
    city: 'Mogadishu',
    requirements: {
      us_citizens: 'Visa required - travel strongly discouraged',
      eu_citizens: 'Visa required - travel strongly discouraged',
      uk_citizens: 'Visa required - travel strongly discouraged',
      canadian_citizens: 'Visa required - travel strongly discouraged',
      australian_citizens: 'Visa required - travel strongly discouraged',
      general: 'Tourism not recommended - extremely dangerous'
    },
    duration_allowed: 'Variable (if permitted)',
    notes: [
      'CRITICAL: Highest travel risk level',
      'Ongoing civil war and terrorism',
      'Kidnapping and piracy risks',
      'No tourist infrastructure',
      'Medical facilities inadequate'
    ],
    last_updated: '2024-12-23',
    sources: [
      'US State Department Travel Advisory',
      'UN Security Reports'
    ]
  },
  {
    country: 'Libya',
    city: 'Al Khums',
    requirements: {
      us_citizens: 'Visa required - travel not recommended',
      eu_citizens: 'Visa required - travel not recommended',
      uk_citizens: 'Visa required - travel not recommended',
      canadian_citizens: 'Visa required - travel not recommended',
      australian_citizens: 'Visa required - travel not recommended',
      general: 'Tourism suspended due to civil conflict'
    },
    duration_allowed: 'Variable (if permitted)',
    notes: [
      'CRITICAL: Ongoing civil war',
      'Armed conflict throughout country',
      'Arbitrary detention risks',
      'No functioning tourist infrastructure',
      'Embassy services suspended'
    ],
    last_updated: '2024-12-23',
    sources: [
      'US State Department Travel Advisory',
      'EU External Action Service'
    ]
  },
  {
    country: 'North Korea',
    city: 'Pyongyang',
    requirements: {
      us_citizens: 'Special tourist visa through approved operators only - travel banned',
      eu_citizens: 'Special tourist visa through approved operators only',
      uk_citizens: 'Special tourist visa through approved operators only',
      canadian_citizens: 'Special tourist visa through approved operators only',
      australian_citizens: 'Special tourist visa through approved operators only',
      general: 'Highly restricted tourism through approved tour operators only'
    },
    duration_allowed: '3-10 days (tour groups only)',
    notes: [
      'US citizens banned from travel since 2017',
      'Must use approved tour operators',
      'Constant supervision required',
      'Photography restrictions strict',
      'Risk of arbitrary detention'
    ],
    last_updated: '2024-12-23',
    sources: [
      'US State Department',
      'Koryo Tours'
    ]
  },
  {
    country: 'Turkmenistan',
    city: 'Ashgabat',
    requirements: {
      us_citizens: 'Visa required - letter of invitation needed',
      eu_citizens: 'Visa required - letter of invitation needed',
      uk_citizens: 'Visa required - letter of invitation needed',
      canadian_citizens: 'Visa required - letter of invitation needed',
      australian_citizens: 'Visa required - letter of invitation needed',
      general: 'Tourist visa requires letter of invitation from approved tour operator'
    },
    duration_allowed: '5-30 days',
    notes: [
      'Letter of invitation required from approved operator',
      'Visa fee: $55-85 USD',
      'Guided tours mandatory for most areas',
      'Photography restrictions in many areas',
      'Limited independent travel allowed'
    ],
    last_updated: '2024-12-23',
    sources: [
      'Turkmenistan Embassy',
      'Turkmen Tour Operators'
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