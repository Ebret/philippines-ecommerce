/**
 * SSL/TLS Security Configuration
 * Handles HTTPS enforcement, certificate management, and secure communication
 */

export interface SSLCertificate {
  id: string;
  domain: string;
  issuer: string;
  issuedAt: number;
  expiresAt: number;
  autoRenew: boolean;
  status: 'valid' | 'expiring' | 'expired' | 'renewal_pending';
  certificatePath: string;
  keyPath: string;
  chainPath?: string;
}

export interface SSLConfiguration {
  id: string;
  enabled: boolean;
  enforceHTTPS: boolean;
  hstsEnabled: boolean;
  hstsMaxAge: number;
  hstsIncludeSubdomains: boolean;
  hstsPreload: boolean;
  minTLSVersion: '1.0' | '1.1' | '1.2' | '1.3';
  cipherSuites: string[];
  certificates: SSLCertificate[];
  redirectHTTPToHTTPS: boolean;
  mixedContentPolicy: 'block' | 'upgrade' | 'allow';
  certificateAutoRenewal: boolean;
  renewalDaysBeforeExpiry: number;
  createdAt: number;
  updatedAt: number;
}

export interface SecureCookieConfig {
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
  maxAge?: number;
  domain?: string;
  path?: string;
}

export interface TLSHandshakeMetrics {
  timestamp: number;
  duration: number;
  tlsVersion: string;
  cipherSuite: string;
  certificateChainLength: number;
  sessionReused: boolean;
}

/**
 * Initialize SSL configuration
 */
export function initializeSSLConfiguration(
  domain: string,
  enforceHTTPS: boolean = true,
  hstsEnabled: boolean = true
): SSLConfiguration {
  return {
    id: `ssl_${Date.now()}`,
    enabled: true,
    enforceHTTPS,
    hstsEnabled,
    hstsMaxAge: 31536000, // 1 year
    hstsIncludeSubdomains: true,
    hstsPreload: true,
    minTLSVersion: '1.2',
    cipherSuites: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-CHACHA20-POLY1305',
      'ECDHE-RSA-AES128-GCM-SHA256',
    ],
    certificates: [],
    redirectHTTPToHTTPS: true,
    mixedContentPolicy: 'block',
    certificateAutoRenewal: true,
    renewalDaysBeforeExpiry: 30,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Initialize SSL certificate
 */
export function initializeSSLCertificate(
  domain: string,
  issuer: string = 'Let\'s Encrypt',
  validityDays: number = 90
): SSLCertificate {
  const now = Date.now();
  const expiresAt = now + validityDays * 24 * 60 * 60 * 1000;

  return {
    id: `cert_${Date.now()}`,
    domain,
    issuer,
    issuedAt: now,
    expiresAt,
    autoRenew: true,
    status: 'valid',
    certificatePath: `/etc/letsencrypt/live/${domain}/fullchain.pem`,
    keyPath: `/etc/letsencrypt/live/${domain}/privkey.pem`,
    chainPath: `/etc/letsencrypt/live/${domain}/chain.pem`,
  };
}

/**
 * Add certificate to SSL configuration
 */
export function addCertificateToSSL(
  config: SSLConfiguration,
  certificate: SSLCertificate
): SSLConfiguration {
  return {
    ...config,
    certificates: [...config.certificates, certificate],
    updatedAt: Date.now(),
  };
}

/**
 * Check certificate expiration status
 */
export function checkCertificateExpiration(certificate: SSLCertificate): SSLCertificate {
  const now = Date.now();
  const daysUntilExpiry = (certificate.expiresAt - now) / (24 * 60 * 60 * 1000);

  let status: SSLCertificate['status'] = 'valid';
  if (daysUntilExpiry <= 0) {
    status = 'expired';
  } else if (daysUntilExpiry <= 30) {
    status = 'expiring';
  }

  return {
    ...certificate,
    status,
  };
}

/**
 * Generate HSTS header
 */
export function generateHSTSHeader(config: SSLConfiguration): string {
  if (!config.hstsEnabled) {
    return '';
  }

  let header = `max-age=${config.hstsMaxAge}`;

  if (config.hstsIncludeSubdomains) {
    header += '; includeSubDomains';
  }

  if (config.hstsPreload) {
    header += '; preload';
  }

  return header;
}

/**
 * Initialize secure cookie configuration
 */
export function initializeSecureCookieConfig(
  sameSite: 'Strict' | 'Lax' | 'None' = 'Lax',
  maxAge: number = 7 * 24 * 60 * 60 // 7 days
): SecureCookieConfig {
  return {
    secure: true, // HTTPS only
    httpOnly: true, // Not accessible via JavaScript
    sameSite,
    maxAge,
    path: '/',
  };
}

/**
 * Generate secure cookie header
 */
export function generateSecureCookieHeader(
  name: string,
  value: string,
  config: SecureCookieConfig
): string {
  let header = `${name}=${value}`;

  if (config.secure) {
    header += '; Secure';
  }

  if (config.httpOnly) {
    header += '; HttpOnly';
  }

  header += `; SameSite=${config.sameSite}`;

  if (config.maxAge) {
    header += `; Max-Age=${config.maxAge}`;
  }

  if (config.domain) {
    header += `; Domain=${config.domain}`;
  }

  if (config.path) {
    header += `; Path=${config.path}`;
  }

  return header;
}

/**
 * Validate TLS version
 */
export function validateTLSVersion(
  tlsVersion: string,
  minVersion: string = '1.2'
): boolean {
  const versionMap: Record<string, number> = {
    '1.0': 1,
    '1.1': 2,
    '1.2': 3,
    '1.3': 4,
  };

  const tlsNum = versionMap[tlsVersion] || 0;
  const minNum = versionMap[minVersion] || 3;

  return tlsNum >= minNum;
}

/**
 * Initialize TLS handshake metrics
 */
export function initializeTLSHandshakeMetrics(
  tlsVersion: string,
  cipherSuite: string,
  duration: number = 0,
  certificateChainLength: number = 1,
  sessionReused: boolean = false
): TLSHandshakeMetrics {
  return {
    timestamp: Date.now(),
    duration,
    tlsVersion,
    cipherSuite,
    certificateChainLength,
    sessionReused,
  };
}

/**
 * Check mixed content
 */
export function checkMixedContent(
  resourceUrl: string,
  pageProtocol: string = 'https'
): boolean {
  const resourceProtocol = resourceUrl.startsWith('https') ? 'https' : 'http';
  return pageProtocol === 'https' && resourceProtocol === 'http';
}

/**
 * Get SSL configuration summary
 */
export function getSSLConfigurationSummary(config: SSLConfiguration): {
  summary: string;
  certificateStatus: string;
  securityScore: number;
  recommendations: string[];
} {
  const validCerts = config.certificates.filter((c) => c.status === 'valid').length;
  const expiringCerts = config.certificates.filter((c) => c.status === 'expiring').length;
  const expiredCerts = config.certificates.filter((c) => c.status === 'expired').length;

  const recommendations: string[] = [];

  if (!config.enforceHTTPS) {
    recommendations.push('Enable HTTPS enforcement');
  }

  if (!config.hstsEnabled) {
    recommendations.push('Enable HSTS header');
  }

  if (config.minTLSVersion < '1.2') {
    recommendations.push('Upgrade minimum TLS version to 1.2 or higher');
  }

  if (expiringCerts > 0) {
    recommendations.push(`${expiringCerts} certificate(s) expiring soon - schedule renewal`);
  }

  if (expiredCerts > 0) {
    recommendations.push(`${expiredCerts} certificate(s) expired - renew immediately`);
  }

  let securityScore = 100;
  if (!config.enforceHTTPS) securityScore -= 20;
  if (!config.hstsEnabled) securityScore -= 15;
  if (config.minTLSVersion < '1.2') securityScore -= 25;
  if (expiringCerts > 0) securityScore -= 10;
  if (expiredCerts > 0) securityScore -= 30;

  return {
    summary: `SSL/TLS Configuration: ${validCerts} valid, ${expiringCerts} expiring, ${expiredCerts} expired`,
    certificateStatus: expiredCerts > 0 ? 'CRITICAL' : expiringCerts > 0 ? 'WARNING' : 'HEALTHY',
    securityScore: Math.max(0, securityScore),
    recommendations,
  };
}

/**
 * Generate SSL security report
 */
export function generateSSLSecurityReport(config: SSLConfiguration): {
  timestamp: number;
  configuration: SSLConfiguration;
  summary: ReturnType<typeof getSSLConfigurationSummary>;
  certificateDetails: SSLCertificate[];
} {
  const certificateDetails = config.certificates.map((cert) => checkCertificateExpiration(cert));

  return {
    timestamp: Date.now(),
    configuration: config,
    summary: getSSLConfigurationSummary({ ...config, certificates: certificateDetails }),
    certificateDetails,
  };
}

