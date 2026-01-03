import { describe, it, expect, beforeEach } from 'vitest';
import {
  createDefaultConsent,
  validateCookieConsent,
  isConsentExpired,
  isConsentOutdated,
  needsConsentRenewal,
  serializeConsent,
  deserializeConsent,
  generateConsentCookieHeader,
  createDefaultPrivacyPreferences,
  checkDoNotTrack,
  stripTrackingParams,
  maskIPAddress,
  generateAnonymousId,
  hasTrackingCookies,
  createDataSubjectRequest,
  validateDataSubjectRequest,
  getRetentionDays,
  shouldDeleteData,
  generatePrivacyComplianceReport,
  getRequiredConsentCategories,
  hasRequiredConsent,
  anonymizeUserData,
  defaultPrivacyConfig,
  type CookieConsent,
  type PrivacyPreferences,
} from '../lib/privacy-protection';

describe('Privacy Protection', () => {
  describe('Cookie Consent', () => {
    it('should create default consent', () => {
      const consent = createDefaultConsent();
      expect(consent.necessary).toBe(true);
      expect(consent.functional).toBe(false);
      expect(consent.analytics).toBe(false);
      expect(consent.marketing).toBe(false);
      expect(consent.timestamp).toBeGreaterThan(0);
    });

    it('should validate valid consent', () => {
      const consent = createDefaultConsent();
      const result = validateCookieConsent(consent);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject consent with necessary=false', () => {
      const consent = { ...createDefaultConsent(), necessary: false };
      const result = validateCookieConsent(consent);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('necessary cookies must always be true');
    });

    it('should reject consent without timestamp', () => {
      const consent = { ...createDefaultConsent(), timestamp: 0 };
      const result = validateCookieConsent(consent);
      expect(result.valid).toBe(false);
    });
  });

  describe('Consent Expiry', () => {
    it('should detect expired consent', () => {
      const oldConsent: CookieConsent = {
        ...createDefaultConsent(),
        timestamp: Date.now() - (400 * 24 * 60 * 60 * 1000), // 400 days ago
      };
      expect(isConsentExpired(oldConsent)).toBe(true);
    });

    it('should not flag fresh consent as expired', () => {
      const freshConsent = createDefaultConsent();
      expect(isConsentExpired(freshConsent)).toBe(false);
    });

    it('should detect outdated consent version', () => {
      const oldVersionConsent: CookieConsent = {
        ...createDefaultConsent(),
        version: '0.9.0',
      };
      expect(isConsentOutdated(oldVersionConsent)).toBe(true);
    });

    it('should not flag current version as outdated', () => {
      const currentConsent: CookieConsent = {
        ...createDefaultConsent(),
        version: defaultPrivacyConfig.cookieConsentVersion,
      };
      expect(isConsentOutdated(currentConsent)).toBe(false);
    });
  });

  describe('Consent Renewal', () => {
    it('should require renewal for null consent', () => {
      expect(needsConsentRenewal(null)).toBe(true);
    });

    it('should require renewal for expired consent', () => {
      const expired: CookieConsent = {
        ...createDefaultConsent(),
        timestamp: Date.now() - (400 * 24 * 60 * 60 * 1000),
      };
      expect(needsConsentRenewal(expired)).toBe(true);
    });

    it('should not require renewal for valid consent', () => {
      const valid: CookieConsent = {
        ...createDefaultConsent(),
        version: defaultPrivacyConfig.cookieConsentVersion,
      };
      expect(needsConsentRenewal(valid)).toBe(false);
    });
  });

  describe('Consent Serialization', () => {
    it('should serialize and deserialize consent', () => {
      const original = createDefaultConsent();
      const serialized = serializeConsent(original);
      const deserialized = deserializeConsent(serialized);
      
      expect(deserialized).not.toBeNull();
      expect(deserialized?.necessary).toBe(original.necessary);
      expect(deserialized?.functional).toBe(original.functional);
    });

    it('should return null for invalid serialized data', () => {
      const result = deserializeConsent('invalid-base64-data!!!');
      expect(result).toBeNull();
    });

    it('should generate valid cookie header', () => {
      const consent = createDefaultConsent();
      const header = generateConsentCookieHeader(consent);
      expect(header).toContain('cookie_consent=');
      expect(header).toContain('Max-Age=');
      expect(header).toContain('SameSite=Lax');
      expect(header).toContain('Secure');
    });
  });

  describe('Privacy Preferences', () => {
    it('should create default preferences', () => {
      const prefs = createDefaultPrivacyPreferences();
      expect(prefs.doNotTrack).toBe(false);
      expect(prefs.doNotSell).toBe(false);
      expect(prefs.retentionPeriod).toBe('3years');
    });
  });

  describe('Do Not Track', () => {
    it('should detect DNT header', () => {
      const headers = new Headers({ 'DNT': '1' });
      expect(checkDoNotTrack(headers)).toBe(true);
    });

    it('should detect GPC header', () => {
      const headers = new Headers({ 'Sec-GPC': '1' });
      expect(checkDoNotTrack(headers)).toBe(true);
    });

    it('should return false when no tracking headers', () => {
      const headers = new Headers();
      expect(checkDoNotTrack(headers)).toBe(false);
    });
  });

  describe('Tracking Prevention', () => {
    it('should strip UTM parameters', () => {
      const url = 'https://example.com/page?utm_source=google&utm_medium=cpc&id=123';
      const cleaned = stripTrackingParams(url);
      expect(cleaned).not.toContain('utm_source');
      expect(cleaned).not.toContain('utm_medium');
      expect(cleaned).toContain('id=123');
    });

    it('should strip Facebook click ID', () => {
      const url = 'https://example.com/page?fbclid=abc123&product=test';
      const cleaned = stripTrackingParams(url);
      expect(cleaned).not.toContain('fbclid');
      expect(cleaned).toContain('product=test');
    });

    it('should strip Google click ID', () => {
      const url = 'https://example.com/page?gclid=xyz789';
      const cleaned = stripTrackingParams(url);
      expect(cleaned).not.toContain('gclid');
    });

    it('should handle invalid URLs gracefully', () => {
      const invalid = 'not-a-valid-url';
      const result = stripTrackingParams(invalid);
      expect(result).toBe(invalid);
    });
  });

  describe('IP Masking', () => {
    it('should mask IPv4 address', () => {
      const masked = maskIPAddress('192.168.1.100');
      expect(masked).toBe('192.168.0.0');
    });

    it('should mask IPv6 address', () => {
      const masked = maskIPAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
      expect(masked).toContain('2001');
      expect(masked).toContain('0:0:0:0:0');
    });

    it('should handle invalid IP', () => {
      const masked = maskIPAddress('invalid');
      expect(masked).toBe('0.0.0.0');
    });
  });

  describe('Anonymous ID', () => {
    it('should generate unique anonymous IDs', () => {
      const id1 = generateAnonymousId();
      const id2 = generateAnonymousId();
      expect(id1).not.toBe(id2);
    });

    it('should start with anon_ prefix', () => {
      const id = generateAnonymousId();
      expect(id.startsWith('anon_')).toBe(true);
    });
  });

  describe('Tracking Cookie Detection', () => {
    it('should detect Google Analytics cookies', () => {
      const cookies = '_ga=GA1.2.123456789.1234567890; session=abc';
      expect(hasTrackingCookies(cookies)).toBe(true);
    });

    it('should detect Facebook cookies', () => {
      const cookies = '_fbp=fb.1.1234567890.123456789; user=test';
      expect(hasTrackingCookies(cookies)).toBe(true);
    });

    it('should not flag non-tracking cookies', () => {
      const cookies = 'session=abc123; theme=dark';
      expect(hasTrackingCookies(cookies)).toBe(false);
    });
  });

  describe('Data Subject Requests', () => {
    it('should create data subject request', () => {
      const request = createDataSubjectRequest('access', 'user123', 'user@example.com');
      expect(request.id).toContain('dsr_');
      expect(request.type).toBe('access');
      expect(request.status).toBe('pending');
    });

    it('should validate valid request', () => {
      const request = createDataSubjectRequest('erasure', 'user456', 'test@test.com');
      const result = validateDataSubjectRequest(request);
      expect(result.valid).toBe(true);
    });

    it('should reject request without email', () => {
      const request = createDataSubjectRequest('access', 'user789', '');
      const result = validateDataSubjectRequest(request);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });
  });

  describe('Data Retention', () => {
    it('should return correct retention days', () => {
      expect(getRetentionDays('30days')).toBe(30);
      expect(getRetentionDays('90days')).toBe(90);
      expect(getRetentionDays('1year')).toBe(365);
      expect(getRetentionDays('3years')).toBe(1095);
      expect(getRetentionDays('indefinite')).toBe(-1);
    });

    it('should determine if data should be deleted', () => {
      const oldData = Date.now() - (100 * 24 * 60 * 60 * 1000); // 100 days ago
      expect(shouldDeleteData(oldData, '30days')).toBe(true);
      expect(shouldDeleteData(oldData, '1year')).toBe(false);
    });

    it('should never delete indefinite retention data', () => {
      const veryOldData = Date.now() - (10 * 365 * 24 * 60 * 60 * 1000); // 10 years ago
      expect(shouldDeleteData(veryOldData, 'indefinite')).toBe(false);
    });
  });

  describe('Privacy Compliance Report', () => {
    it('should report compliant status', () => {
      const consent: CookieConsent = {
        ...createDefaultConsent(),
        version: defaultPrivacyConfig.cookieConsentVersion,
      };
      const prefs = createDefaultPrivacyPreferences();
      const report = generatePrivacyComplianceReport(consent, prefs);
      expect(report.compliant).toBe(true);
      expect(report.issues).toHaveLength(0);
    });

    it('should report missing consent', () => {
      const prefs = createDefaultPrivacyPreferences();
      const report = generatePrivacyComplianceReport(null, prefs);
      expect(report.compliant).toBe(false);
      expect(report.issues).toContain('Cookie consent not obtained');
    });

    it('should add recommendations for DNT', () => {
      const consent = createDefaultConsent();
      const prefs: PrivacyPreferences = {
        ...createDefaultPrivacyPreferences(),
        doNotTrack: true,
      };
      const report = generatePrivacyComplianceReport(consent, prefs);
      expect(report.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Consent Categories', () => {
    it('should return required categories for features', () => {
      expect(getRequiredConsentCategories('basic_functionality')).toEqual(['necessary']);
      expect(getRequiredConsentCategories('analytics')).toContain('analytics');
      expect(getRequiredConsentCategories('advertising')).toContain('marketing');
    });

    it('should check if user has required consent', () => {
      const fullConsent: CookieConsent = {
        ...createDefaultConsent(),
        functional: true,
        analytics: true,
        marketing: true,
      };
      expect(hasRequiredConsent(fullConsent, ['necessary', 'analytics'])).toBe(true);
    });

    it('should detect missing consent', () => {
      const minimalConsent = createDefaultConsent();
      expect(hasRequiredConsent(minimalConsent, ['necessary', 'marketing'])).toBe(false);
    });
  });

  describe('Data Anonymization', () => {
    it('should anonymize sensitive fields', () => {
      const userData = {
        id: '123',
        email: 'user@example.com',
        name: 'John Doe',
        phone: '1234567890',
        preferences: { theme: 'dark' },
      };
      const anonymized = anonymizeUserData(userData);
      expect(anonymized.email).toBe('[REDACTED]');
      expect(anonymized.name).toBe('[REDACTED]');
      expect(anonymized.phone).toBe('[REDACTED]');
      expect(anonymized.id).toBe('123');
      expect(anonymized.preferences).toEqual({ theme: 'dark' });
    });

    it('should preserve non-sensitive fields', () => {
      const userData = {
        productId: 'prod123',
        category: 'electronics',
        quantity: 5,
      };
      const anonymized = anonymizeUserData(userData);
      expect(anonymized).toEqual(userData);
    });
  });
});

