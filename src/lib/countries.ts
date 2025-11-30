/**
 * Complete list of Apple App Store country/region codes
 * Source: Apple App Store Connect & iTunes RSS feeds
 * Total: 175 countries/regions
 */

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  region: 'americas' | 'europe' | 'asia-pacific' | 'middle-east-africa';
}

// All 175 App Store countries/regions
export const ALL_COUNTRIES: CountryInfo[] = [
  // Americas (35)
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'americas' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'americas' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'americas' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'americas' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'americas' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'americas' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'americas' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'americas' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'americas' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', region: 'americas' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', region: 'americas' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', region: 'americas' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', region: 'americas' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', region: 'americas' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', region: 'americas' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', region: 'americas' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', region: 'americas' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', region: 'americas' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', region: 'americas' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', region: 'americas' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'americas' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', region: 'americas' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'americas' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', region: 'americas' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', region: 'americas' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', region: 'americas' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', region: 'americas' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', region: 'americas' },
  { code: 'AI', name: 'Anguilla', flag: '🇦🇮', region: 'americas' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬', region: 'americas' },
  { code: 'VG', name: 'British Virgin Islands', flag: '🇻🇬', region: 'americas' },
  { code: 'KY', name: 'Cayman Islands', flag: '🇰🇾', region: 'americas' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲', region: 'americas' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩', region: 'americas' },
  { code: 'MS', name: 'Montserrat', flag: '🇲🇸', region: 'americas' },

  // Europe (44)
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'europe' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'europe' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'europe' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', region: 'europe' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', region: 'europe' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', region: 'europe' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', region: 'europe' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', region: 'europe' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', region: 'europe' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', region: 'europe' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', region: 'europe' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', region: 'europe' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', region: 'europe' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', region: 'europe' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', region: 'europe' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', region: 'europe' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'europe' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', region: 'europe' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'europe' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', region: 'europe' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', region: 'europe' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', region: 'europe' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', region: 'europe' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', region: 'europe' },
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰', region: 'europe' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', region: 'europe' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', region: 'europe' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', region: 'europe' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', region: 'europe' },

  // Asia Pacific (51)
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'asia-pacific' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'asia-pacific' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'asia-pacific' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'asia-pacific' },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'asia-pacific' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'asia-pacific' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', region: 'asia-pacific' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'asia-pacific' },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'asia-pacific' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'asia-pacific' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'asia-pacific' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'asia-pacific' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'asia-pacific' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'asia-pacific' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'asia-pacific' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'asia-pacific' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', region: 'asia-pacific' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', region: 'asia-pacific' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', region: 'asia-pacific' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', region: 'asia-pacific' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', region: 'asia-pacific' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', region: 'asia-pacific' },
  { code: 'MO', name: 'Macau', flag: '🇲🇴', region: 'asia-pacific' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', region: 'asia-pacific' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', region: 'asia-pacific' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', region: 'asia-pacific' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', region: 'asia-pacific' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', region: 'asia-pacific' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', region: 'asia-pacific' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', region: 'asia-pacific' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', region: 'asia-pacific' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', region: 'asia-pacific' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', region: 'asia-pacific' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', region: 'asia-pacific' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', region: 'asia-pacific' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧', region: 'asia-pacific' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', region: 'asia-pacific' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', region: 'asia-pacific' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', region: 'asia-pacific' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲', region: 'asia-pacific' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼', region: 'asia-pacific' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷', region: 'asia-pacific' },
  { code: 'GU', name: 'Guam', flag: '🇬🇺', region: 'asia-pacific' },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨', region: 'asia-pacific' },
  { code: 'PF', name: 'French Polynesia', flag: '🇵🇫', region: 'asia-pacific' },
  { code: 'CK', name: 'Cook Islands', flag: '🇨🇰', region: 'asia-pacific' },
  { code: 'NU', name: 'Niue', flag: '🇳🇺', region: 'asia-pacific' },
  { code: 'TK', name: 'Tokelau', flag: '🇹🇰', region: 'asia-pacific' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', region: 'asia-pacific' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮', region: 'asia-pacific' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭', region: 'asia-pacific' },

  // Middle East & Africa (45)
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'middle-east-africa' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'middle-east-africa' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'middle-east-africa' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'middle-east-africa' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'middle-east-africa' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'middle-east-africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'middle-east-africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'middle-east-africa' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', region: 'middle-east-africa' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', region: 'middle-east-africa' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', region: 'middle-east-africa' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', region: 'middle-east-africa' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', region: 'middle-east-africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'middle-east-africa' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', region: 'middle-east-africa' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', region: 'middle-east-africa' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', region: 'middle-east-africa' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', region: 'middle-east-africa' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', region: 'middle-east-africa' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', region: 'middle-east-africa' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', region: 'middle-east-africa' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', region: 'middle-east-africa' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', region: 'middle-east-africa' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', region: 'middle-east-africa' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', region: 'middle-east-africa' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', region: 'middle-east-africa' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', region: 'middle-east-africa' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', region: 'middle-east-africa' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', region: 'middle-east-africa' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', region: 'middle-east-africa' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'middle-east-africa' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'middle-east-africa' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', region: 'middle-east-africa' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', region: 'middle-east-africa' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', region: 'middle-east-africa' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', region: 'middle-east-africa' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', region: 'middle-east-africa' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', region: 'middle-east-africa' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', region: 'middle-east-africa' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', region: 'middle-east-africa' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', region: 'middle-east-africa' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', region: 'middle-east-africa' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', region: 'middle-east-africa' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', region: 'middle-east-africa' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', region: 'middle-east-africa' },
];

// Create lookup maps for quick access
export const COUNTRY_BY_CODE = new Map<string, CountryInfo>(
  ALL_COUNTRIES.map(c => [c.code, c])
);

export const ALL_COUNTRY_CODES = ALL_COUNTRIES.map(c => c.code);

// Default 5 countries for quick scan
export const DEFAULT_COUNTRIES = ['US', 'IN', 'GB', 'CA', 'AU'];

// Top 20 major markets for faster "popular markets" scan
export const MAJOR_MARKETS = [
  'US', 'GB', 'CA', 'AU', 'IN',  // English-speaking
  'DE', 'FR', 'IT', 'ES', 'NL',  // Western Europe
  'JP', 'KR', 'CN', 'TW', 'HK',  // East Asia
  'BR', 'MX', 'AR',              // Latin America
  'RU', 'TR',                     // Eastern Europe
];

/**
 * Get country info by code
 */
export function getCountryInfo(code: string): CountryInfo | undefined {
  return COUNTRY_BY_CODE.get(code.toUpperCase());
}

/**
 * Get flag emoji for a country code
 */
export function getCountryFlag(code: string): string {
  return COUNTRY_BY_CODE.get(code.toUpperCase())?.flag || '🏳️';
}

/**
 * Get country name for a country code
 */
export function getCountryName(code: string): string {
  return COUNTRY_BY_CODE.get(code.toUpperCase())?.name || code;
}

