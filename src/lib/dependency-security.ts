/**
 * Dependency Security
 * Handles dependency vulnerability scanning, security advisories, and supply chain security
 */

import crypto from 'crypto';

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development' | 'peer';
  installed: boolean;
  lastUpdated?: number;
}

export interface Vulnerability {
  id: string;
  dependencyName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedVersions: string[];
  fixedVersion?: string;
  description: string;
  cveId?: string;
  discoveredAt: number;
  resolved: boolean;
}

export interface SecurityAdvisory {
  id: string;
  timestamp: number;
  advisoryType: 'vulnerability' | 'deprecation' | 'license' | 'supply_chain';
  severity: 'low' | 'medium' | 'high' | 'critical';
  dependencyName: string;
  message: string;
  recommendation: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface DependencyUpdate {
  id: string;
  timestamp: number;
  dependencyName: string;
  currentVersion: string;
  availableVersion: string;
  updateType: 'patch' | 'minor' | 'major';
  securityUpdate: boolean;
  changelogUrl?: string;
  recommended: boolean;
}

export interface LicenseInfo {
  dependencyName: string;
  license: string;
  licenseType: 'permissive' | 'copyleft' | 'proprietary' | 'unknown';
  compliant: boolean;
  restrictions?: string[];
}

export interface PackageIntegrity {
  id: string;
  packageName: string;
  version: string;
  expectedHash: string;
  actualHash: string;
  verified: boolean;
  timestamp: number;
}

export interface RiskScore {
  dependencyName: string;
  version: string;
  score: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  lastAssessed: number;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action: 'scan' | 'update' | 'verify' | 'remediate' | 'review';
  dependencyName?: string;
  details: Record<string, unknown>;
  status: 'success' | 'failure';
}

/**
 * Create vulnerability store
 */
export function createVulnerabilityStore(): Vulnerability[] {
  return [];
}

/**
 * Scan dependency for vulnerabilities
 */
export function scanDependencyVulnerabilities(
  store: Vulnerability[],
  dependencyName: string,
  version: string,
  knownVulnerabilities: Record<string, Vulnerability[]>
): Vulnerability[] {
  const vulnerabilities = knownVulnerabilities[dependencyName] || [];
  const foundVulnerabilities: Vulnerability[] = [];

  vulnerabilities.forEach((vuln) => {
    if (vuln.affectedVersions.includes(version)) {
      const newVuln: Vulnerability = {
        ...vuln,
        id: `vuln_${crypto.randomBytes(8).toString('hex')}`,
        discoveredAt: Date.now(),
        resolved: false,
      };
      store.push(newVuln);
      foundVulnerabilities.push(newVuln);
    }
  });

  return foundVulnerabilities;
}

/**
 * Create advisory store
 */
export function createAdvisoryStore(): SecurityAdvisory[] {
  return [];
}

/**
 * Generate security advisory
 */
export function generateSecurityAdvisory(
  store: SecurityAdvisory[],
  advisoryType: SecurityAdvisory['advisoryType'],
  severity: SecurityAdvisory['severity'],
  dependencyName: string,
  message: string,
  recommendation: string
): SecurityAdvisory {
  const advisory: SecurityAdvisory = {
    id: `adv_${crypto.randomBytes(8).toString('hex')}`,
    timestamp: Date.now(),
    advisoryType,
    severity,
    dependencyName,
    message,
    recommendation,
    status: 'active',
  };

  store.push(advisory);
  return advisory;
}

/**
 * Acknowledge advisory
 */
export function acknowledgeAdvisory(store: SecurityAdvisory[], advisoryId: string): boolean {
  const advisory = store.find((a) => a.id === advisoryId);
  if (advisory) {
    advisory.status = 'acknowledged';
    return true;
  }
  return false;
}

/**
 * Resolve advisory
 */
export function resolveAdvisory(store: SecurityAdvisory[], advisoryId: string): boolean {
  const advisory = store.find((a) => a.id === advisoryId);
  if (advisory) {
    advisory.status = 'resolved';
    return true;
  }
  return false;
}

/**
 * Create update store
 */
export function createUpdateStore(): DependencyUpdate[] {
  return [];
}

/**
 * Track dependency update
 */
export function trackDependencyUpdate(
  store: DependencyUpdate[],
  dependencyName: string,
  currentVersion: string,
  availableVersion: string,
  securityUpdate: boolean = false
): DependencyUpdate {
  const updateType = determineUpdateType(currentVersion, availableVersion);
  const update: DependencyUpdate = {
    id: `upd_${crypto.randomBytes(8).toString('hex')}`,
    timestamp: Date.now(),
    dependencyName,
    currentVersion,
    availableVersion,
    updateType,
    securityUpdate,
    recommended: securityUpdate || updateType === 'patch',
  };

  store.push(update);
  return update;
}

/**
 * Determine update type (patch, minor, major)
 */
function determineUpdateType(
  current: string,
  available: string
): 'patch' | 'minor' | 'major' {
  const [currMajor, currMinor, currPatch] = current.split('.').map(Number);
  const [availMajor, availMinor, availPatch] = available.split('.').map(Number);

  if (availMajor > currMajor) return 'major';
  if (availMinor > currMinor) return 'minor';
  return 'patch';
}

/**
 * Create license store
 */
export function createLicenseStore(): LicenseInfo[] {
  return [];
}

/**
 * Check license compliance
 */
export function checkLicenseCompliance(
  store: LicenseInfo[],
  dependencyName: string,
  license: string,
  allowedLicenses: string[] = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC']
): LicenseInfo {
  const licenseType = determineLicenseType(license);
  const compliant = allowedLicenses.includes(license);

  const licenseInfo: LicenseInfo = {
    dependencyName,
    license,
    licenseType,
    compliant,
    restrictions: licenseType === 'copyleft' ? ['Must disclose source code'] : undefined,
  };

  store.push(licenseInfo);
  return licenseInfo;
}

/**
 * Determine license type
 */
function determineLicenseType(
  license: string
): 'permissive' | 'copyleft' | 'proprietary' | 'unknown' {
  const permissiveLicenses = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC', 'Unlicense'];
  const copyleftLicenses = ['GPL-2.0', 'GPL-3.0', 'AGPL-3.0'];

  if (permissiveLicenses.includes(license)) return 'permissive';
  if (copyleftLicenses.includes(license)) return 'copyleft';
  if (license === 'Proprietary') return 'proprietary';
  return 'unknown';
}

/**
 * Create integrity store
 */
export function createIntegrityStore(): PackageIntegrity[] {
  return [];
}

/**
 * Verify package integrity
 */
export function verifyPackageIntegrity(
  store: PackageIntegrity[],
  packageName: string,
  version: string,
  expectedHash: string,
  actualHash: string
): PackageIntegrity {
  const integrity: PackageIntegrity = {
    id: `int_${crypto.randomBytes(8).toString('hex')}`,
    packageName,
    version,
    expectedHash,
    actualHash,
    verified: expectedHash === actualHash,
    timestamp: Date.now(),
  };

  store.push(integrity);
  return integrity;
}

/**
 * Create risk score store
 */
export function createRiskScoreStore(): RiskScore[] {
  return [];
}

/**
 * Calculate dependency risk score
 */
export function calculateRiskScore(
  store: RiskScore[],
  dependencyName: string,
  version: string,
  vulnerabilityCount: number,
  lastUpdated: number,
  isDeprecated: boolean = false
): RiskScore {
  let score = 0;
  const factors: string[] = [];

  // Vulnerability factor (0-40 points)
  if (vulnerabilityCount > 0) {
    score += Math.min(vulnerabilityCount * 10, 40);
    factors.push(`${vulnerabilityCount} known vulnerabilities`);
  }

  // Age factor (0-30 points)
  const ageInDays = (Date.now() - lastUpdated) / (1000 * 60 * 60 * 24);
  if (ageInDays > 365) {
    score += 30;
    factors.push('Not updated in over a year');
  } else if (ageInDays > 180) {
    score += 20;
    factors.push('Not updated in over 6 months');
  } else if (ageInDays > 90) {
    score += 10;
    factors.push('Not updated in over 3 months');
  }

  // Deprecation factor (0-30 points)
  if (isDeprecated) {
    score += 30;
    factors.push('Package is deprecated');
  }

  const riskLevel =
    score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 30 ? 'medium' : 'low';

  const riskScore: RiskScore = {
    dependencyName,
    version,
    score: Math.min(score, 100),
    riskLevel,
    factors,
    lastAssessed: Date.now(),
  };

  store.push(riskScore);
  return riskScore;
}

/**
 * Create audit log store
 */
export function createAuditLogStore(): AuditLog[] {
  return [];
}

/**
 * Add audit log entry
 */
export function addAuditLog(
  store: AuditLog[],
  action: AuditLog['action'],
  details: Record<string, unknown>,
  status: 'success' | 'failure' = 'success',
  dependencyName?: string
): AuditLog {
  const log: AuditLog = {
    id: `log_${crypto.randomBytes(8).toString('hex')}`,
    timestamp: Date.now(),
    action,
    dependencyName,
    details,
    status,
  };

  store.push(log);
  return log;
}

/**
 * Get active advisories
 */
export function getActiveAdvisories(store: SecurityAdvisory[]): SecurityAdvisory[] {
  return store.filter((a) => a.status === 'active');
}

/**
 * Get critical vulnerabilities
 */
export function getCriticalVulnerabilities(store: Vulnerability[]): Vulnerability[] {
  return store.filter((v) => v.severity === 'critical' && !v.resolved);
}

/**
 * Get recommended updates
 */
export function getRecommendedUpdates(store: DependencyUpdate[]): DependencyUpdate[] {
  return store.filter((u) => u.recommended);
}

/**
 * Get non-compliant licenses
 */
export function getNonCompliantLicenses(store: LicenseInfo[]): LicenseInfo[] {
  return store.filter((l) => !l.compliant);
}

/**
 * Get failed integrity checks
 */
export function getFailedIntegrityChecks(store: PackageIntegrity[]): PackageIntegrity[] {
  return store.filter((i) => !i.verified);
}

/**
 * Get high-risk dependencies
 */
export function getHighRiskDependencies(store: RiskScore[]): RiskScore[] {
  return store.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical');
}

/**
 * Generate dependency security report
 */
export function generateDependencySecurityReport(
  vulnerabilityStore: Vulnerability[],
  advisoryStore: SecurityAdvisory[],
  updateStore: DependencyUpdate[],
  licenseStore: LicenseInfo[],
  integrityStore: PackageIntegrity[],
  riskScoreStore: RiskScore[]
): Record<string, unknown> {
  return {
    timestamp: Date.now(),
    totalVulnerabilities: vulnerabilityStore.length,
    criticalVulnerabilities: getCriticalVulnerabilities(vulnerabilityStore).length,
    activeAdvisories: getActiveAdvisories(advisoryStore).length,
    recommendedUpdates: getRecommendedUpdates(updateStore).length,
    nonCompliantLicenses: getNonCompliantLicenses(licenseStore).length,
    failedIntegrityChecks: getFailedIntegrityChecks(integrityStore).length,
    highRiskDependencies: getHighRiskDependencies(riskScoreStore).length,
    overallRiskLevel:
      getCriticalVulnerabilities(vulnerabilityStore).length > 0 ? 'critical' : 'medium',
  };
}

