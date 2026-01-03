/**
 * Privacy Protection Module
 * 
 * Provides comprehensive privacy protection including cookie consent management,
 * GDPR/Data Privacy Act compliance, user tracking prevention, and data privacy controls
 * for the Philippines E-Commerce Platform.
 * 
 * Compliant with:
 * - Philippines Data Privacy Act of 2012 (RA 10173)
 * - GDPR (General Data Protection Regulation)
 * - CCPA (California Consumer Privacy Act)
 * 
 * @module privacy-protection
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface CookieConsent {
  necessary: boolean; // Always true, required for site functionality
  functional: boolean; // Preferences, language settings
  analytics: boolean; // Analytics and performance tracking
  marketing: boolean; // Advertising and marketing cookies
  timestamp: number;
  version: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface PrivacyPreferences {
  doNotTrack: boolean;
  doNotSell: boolean; // CCPA requirement
  limitDataProcessing: boolean;
  optOutTargetedAds: boolean;
  allowDataSharing: boolean;
  retentionPeriod: DataRetentionPeriod;
}

export type DataRetentionPeriod = '30days' | '90days' | '1year' | '3years' | 'indefinite';

export interface DataSubjectRequest {
  id: string;
  type: DataRequestType;
  userId: string;
  email: string;
  status: RequestStatus;
  requestedAt: number;
  processedAt?: number;
  completedAt?: number;
  notes?: string;
}

export type DataRequestType = 
  | 'access' // Right to access personal data
  | 'rectification' // Right to correct data
  | 'erasure' // Right to be forgotten
  | 'portability' // Right to data portability
  | 'restriction' // Right to restrict processing
  | 'objection'; // Right to object

export type RequestStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface PrivacyConfig {
  cookieConsentRequired: boolean;
  cookieConsentVersion: string;
  cookieExpiryDays: number;
  dataRetentionDays: number;
  enableDoNotTrack: boolean;
  enableGPC: boolean; // Global Privacy Control
  privacyPolicyUrl: string;
  cookiePolicyUrl: string;
  dataProtectionOfficerEmail: string;
}

export interface TrackingPreventionConfig {
  blockThirdPartyCookies: boolean;
  blockFingerprinting: boolean;
  blockCrossSiteTracking: boolean;
  stripTrackingParams: boolean;
  maskIPAddress: boolean;
}

// ============================================================================
// Default Configurations
// ============================================================================

export const defaultPrivacyConfig: PrivacyConfig = {
  cookieConsentRequired: true,
  cookieConsentVersion: '1.0.0',
  cookieExpiryDays: 365,
  dataRetentionDays: 1095, // 3 years
  enableDoNotTrack: true,
  enableGPC: true,
  privacyPolicyUrl: '/privacy-policy',
  cookiePolicyUrl: '/cookie-policy',
  dataProtectionOfficerEmail: 'dpo@extremelifeherbal.com',
};

export const defaultTrackingPreventionConfig: TrackingPreventionConfig = {
  blockThirdPartyCookies: true,
  blockFingerprinting: true,
  blockCrossSiteTracking: true,
  stripTrackingParams: true,
  maskIPAddress: true,
};

export const defaultCookieConsent: CookieConsent = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: 0,
  version: '1.0.0',
};

// ============================================================================
// Tracking Parameters to Strip
// ============================================================================

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'gclsrc', 'dclid',
  'msclkid', 'twclid', 'igshid',
  'mc_cid', 'mc_eid',
  '_ga', '_gl', '_hsenc', '_hsmi',
  'ref', 'ref_src', 'ref_url',
  'source', 'src',
];

// ============================================================================
// Cookie Consent Functions
// ============================================================================

/**
 * Create default cookie consent object
 */
export function createDefaultConsent(version: string = '1.0.0'): CookieConsent {
  return {
    ...defaultCookieConsent,
    version,
    timestamp: Date.now(),
  };
}

/**
 * Validate cookie consent object
 */
export function validateCookieConsent(consent: CookieConsent): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (typeof consent.necessary !== 'boolean') {
    errors.push('necessary must be a boolean');
  }
  if (consent.necessary !== true) {
    errors.push('necessary cookies must always be true');
  }
  if (typeof consent.functional !== 'boolean') {
    errors.push('functional must be a boolean');
  }
  if (typeof consent.analytics !== 'boolean') {
    errors.push('analytics must be a boolean');
  }
  if (typeof consent.marketing !== 'boolean') {
    errors.push('marketing must be a boolean');
  }
  if (!consent.timestamp || consent.timestamp <= 0) {
    errors.push('timestamp must be a positive number');
  }
  if (!consent.version) {
    errors.push('version is required');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Check if consent is expired
 */
export function isConsentExpired(
  consent: CookieConsent,
  config: PrivacyConfig = defaultPrivacyConfig
): boolean {
  const expiryMs = config.cookieExpiryDays * 24 * 60 * 60 * 1000;
  return Date.now() - consent.timestamp > expiryMs;
}

/**
 * Check if consent version is outdated
 */
export function isConsentOutdated(
  consent: CookieConsent,
  config: PrivacyConfig = defaultPrivacyConfig
): boolean {
  return consent.version !== config.cookieConsentVersion;
}

/**
 * Check if consent needs renewal
 */
export function needsConsentRenewal(
  consent: CookieConsent | null,
  config: PrivacyConfig = defaultPrivacyConfig
): boolean {
  if (!consent) return true;
  if (isConsentExpired(consent, config)) return true;
  if (isConsentOutdated(consent, config)) return true;
  return false;
}

/**
 * Serialize consent for cookie storage
 */
export function serializeConsent(consent: CookieConsent): string {
  return Buffer.from(JSON.stringify(consent)).toString('base64');
}

/**
 * Deserialize consent from cookie
 */
export function deserializeConsent(encoded: string): CookieConsent | null {
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const consent = JSON.parse(decoded) as CookieConsent;
    const validation = validateCookieConsent(consent);
    return validation.valid ? consent : null;
  } catch {
    return null;
  }
}

/**
 * Generate consent cookie header
 */
export function generateConsentCookieHeader(
  consent: CookieConsent,
  config: PrivacyConfig = defaultPrivacyConfig
): string {
  const value = serializeConsent(consent);
  const maxAge = config.cookieExpiryDays * 24 * 60 * 60;

  return `cookie_consent=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;
}

// ============================================================================
// Privacy Preferences Functions
// ============================================================================

/**
 * Create default privacy preferences
 */
export function createDefaultPrivacyPreferences(): PrivacyPreferences {
  return {
    doNotTrack: false,
    doNotSell: false,
    limitDataProcessing: false,
    optOutTargetedAds: false,
    allowDataSharing: false,
    retentionPeriod: '3years',
  };
}

/**
 * Check Do Not Track header
 */
export function checkDoNotTrack(headers: Headers): boolean {
  const dnt = headers.get('DNT');
  const secGpc = headers.get('Sec-GPC');

  return dnt === '1' || secGpc === '1';
}

/**
 * Apply privacy preferences to response headers
 */
export function applyPrivacyHeaders(
  headers: Headers,
  preferences: PrivacyPreferences
): void {
  // P3P header (legacy but still used by some systems)
  headers.set('P3P', 'CP="NOI ADM DEV PSAi COM NAV OUR OTRo STP IND DEM"');

  // Permissions Policy for privacy
  const permissionsPolicy = [
    'interest-cohort=()', // Disable FLoC
    'browsing-topics=()', // Disable Topics API
    'attribution-reporting=()', // Disable Attribution Reporting
  ];

  if (preferences.doNotTrack) {
    permissionsPolicy.push('geolocation=()');
  }

  headers.set('Permissions-Policy', permissionsPolicy.join(', '));

  // Referrer Policy for privacy
  if (preferences.doNotTrack) {
    headers.set('Referrer-Policy', 'no-referrer');
  }
}

// ============================================================================
// Tracking Prevention Functions
// ============================================================================

/**
 * Strip tracking parameters from URL
 */
export function stripTrackingParams(url: string): string {
  try {
    const urlObj = new URL(url);

    for (const param of TRACKING_PARAMS) {
      urlObj.searchParams.delete(param);
    }

    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Mask IP address for privacy
 */
export function maskIPAddress(ip: string): string {
  // IPv4
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.0.0`;
    }
  }

  // IPv6
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return `${parts[0]}:${parts[1]}:${parts[2]}:0:0:0:0:0`;
    }
  }

  return '0.0.0.0';
}

/**
 * Generate anonymous user ID
 */
export function generateAnonymousId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `anon_${timestamp}_${random}`;
}

/**
 * Check if request contains tracking cookies
 */
export function hasTrackingCookies(cookies: string): boolean {
  const trackingCookiePatterns = [
    '_ga', '_gid', '_gat', // Google Analytics
    '_fbp', '_fbc', // Facebook
    '_gcl_au', // Google Ads
    '_uetsid', '_uetvid', // Microsoft Ads
    '__utma', '__utmb', '__utmc', '__utmz', // Legacy GA
  ];

  return trackingCookiePatterns.some(pattern => cookies.includes(pattern));
}

// ============================================================================
// Data Subject Request Functions
// ============================================================================

/**
 * Create data subject request
 */
export function createDataSubjectRequest(
  type: DataRequestType,
  userId: string,
  email: string
): DataSubjectRequest {
  return {
    id: `dsr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type,
    userId,
    email,
    status: 'pending',
    requestedAt: Date.now(),
  };
}

/**
 * Validate data subject request
 */
export function validateDataSubjectRequest(request: DataSubjectRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!request.id) errors.push('Request ID is required');
  if (!request.type) errors.push('Request type is required');
  if (!request.userId) errors.push('User ID is required');
  if (!request.email) errors.push('Email is required');

  const validTypes: DataRequestType[] = [
    'access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'
  ];
  if (!validTypes.includes(request.type)) {
    errors.push('Invalid request type');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get data retention period in days
 */
export function getRetentionDays(period: DataRetentionPeriod): number {
  const periods: Record<DataRetentionPeriod, number> = {
    '30days': 30,
    '90days': 90,
    '1year': 365,
    '3years': 1095,
    'indefinite': -1,
  };
  return periods[period];
}

/**
 * Check if data should be deleted based on retention period
 */
export function shouldDeleteData(
  createdAt: number,
  retentionPeriod: DataRetentionPeriod
): boolean {
  const retentionDays = getRetentionDays(retentionPeriod);
  if (retentionDays === -1) return false; // Indefinite retention

  const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
  return Date.now() - createdAt > retentionMs;
}

// ============================================================================
// Privacy Compliance Functions
// ============================================================================

/**
 * Generate privacy compliance report
 */
export function generatePrivacyComplianceReport(
  consent: CookieConsent | null,
  preferences: PrivacyPreferences,
  config: PrivacyConfig = defaultPrivacyConfig
): {
  compliant: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check consent
  if (config.cookieConsentRequired && !consent) {
    issues.push('Cookie consent not obtained');
  }

  if (consent && isConsentExpired(consent, config)) {
    issues.push('Cookie consent has expired');
  }

  if (consent && isConsentOutdated(consent, config)) {
    issues.push('Cookie consent version is outdated');
  }

  // Check preferences
  if (preferences.doNotTrack) {
    recommendations.push('User has enabled Do Not Track - ensure tracking is disabled');
  }

  if (preferences.doNotSell) {
    recommendations.push('User has opted out of data sale - ensure compliance with CCPA');
  }

  // Data retention
  const retentionDays = getRetentionDays(preferences.retentionPeriod);
  if (retentionDays > config.dataRetentionDays) {
    issues.push('User retention preference exceeds configured maximum');
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Get required consent categories for a feature
 */
export function getRequiredConsentCategories(feature: string): (keyof CookieConsent)[] {
  const featureConsent: Record<string, (keyof CookieConsent)[]> = {
    'basic_functionality': ['necessary'],
    'user_preferences': ['necessary', 'functional'],
    'analytics': ['necessary', 'analytics'],
    'personalization': ['necessary', 'functional', 'analytics'],
    'advertising': ['necessary', 'marketing'],
    'social_sharing': ['necessary', 'functional', 'marketing'],
    'third_party_integrations': ['necessary', 'functional', 'analytics', 'marketing'],
  };

  return featureConsent[feature] || ['necessary'];
}

/**
 * Check if user has consented to required categories
 */
export function hasRequiredConsent(
  consent: CookieConsent,
  requiredCategories: (keyof CookieConsent)[]
): boolean {
  for (const category of requiredCategories) {
    if (category === 'timestamp' || category === 'version' ||
        category === 'ipAddress' || category === 'userAgent') {
      continue;
    }
    if (!consent[category]) {
      return false;
    }
  }
  return true;
}

/**
 * Export user data for portability request
 */
export function formatDataForExport(userData: Record<string, unknown>): string {
  return JSON.stringify(userData, null, 2);
}

/**
 * Anonymize user data
 */
export function anonymizeUserData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = [
    'email', 'phone', 'address', 'name', 'firstName', 'lastName',
    'ip', 'ipAddress', 'creditCard', 'ssn', 'password',
  ];

  const anonymized = { ...data };

  for (const field of sensitiveFields) {
    if (field in anonymized) {
      anonymized[field] = '[REDACTED]';
    }
  }

  return anonymized;
}

