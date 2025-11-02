import { describe, it, expect, beforeEach } from 'vitest';
import {
  createVulnerabilityStore,
  scanDependencyVulnerabilities,
  createAdvisoryStore,
  generateSecurityAdvisory,
  acknowledgeAdvisory,
  resolveAdvisory,
  createUpdateStore,
  trackDependencyUpdate,
  createLicenseStore,
  checkLicenseCompliance,
  createIntegrityStore,
  verifyPackageIntegrity,
  createRiskScoreStore,
  calculateRiskScore,
  createAuditLogStore,
  addAuditLog,
  getActiveAdvisories,
  getCriticalVulnerabilities,
  getRecommendedUpdates,
  getNonCompliantLicenses,
  getFailedIntegrityChecks,
  getHighRiskDependencies,
  generateDependencySecurityReport,
  Vulnerability,
} from '../lib/dependency-security';

describe('Dependency Security', () => {
  let vulnerabilityStore: Vulnerability[];
  let advisoryStore: ReturnType<typeof createAdvisoryStore>;
  let updateStore: ReturnType<typeof createUpdateStore>;
  let licenseStore: ReturnType<typeof createLicenseStore>;
  let integrityStore: ReturnType<typeof createIntegrityStore>;
  let riskScoreStore: ReturnType<typeof createRiskScoreStore>;
  let auditLogStore: ReturnType<typeof createAuditLogStore>;

  beforeEach(() => {
    vulnerabilityStore = createVulnerabilityStore();
    advisoryStore = createAdvisoryStore();
    updateStore = createUpdateStore();
    licenseStore = createLicenseStore();
    integrityStore = createIntegrityStore();
    riskScoreStore = createRiskScoreStore();
    auditLogStore = createAuditLogStore();
  });

  describe('Vulnerability Scanning', () => {
    it('should create vulnerability store', () => {
      expect(vulnerabilityStore).toBeDefined();
      expect(vulnerabilityStore).toHaveLength(0);
    });

    it('should scan dependency for vulnerabilities', () => {
      const knownVulnerabilities = {
        'lodash': [
          {
            id: 'vuln_1',
            dependencyName: 'lodash',
            severity: 'high' as const,
            affectedVersions: ['4.17.0', '4.17.1'],
            fixedVersion: '4.17.21',
            description: 'Prototype pollution vulnerability',
            discoveredAt: Date.now(),
            resolved: false,
          },
        ],
      };

      const vulns = scanDependencyVulnerabilities(
        vulnerabilityStore,
        'lodash',
        '4.17.0',
        knownVulnerabilities
      );

      expect(vulns).toHaveLength(1);
      expect(vulns[0].dependencyName).toBe('lodash');
      expect(vulns[0].severity).toBe('high');
      expect(vulnerabilityStore).toHaveLength(1);
    });

    it('should not find vulnerabilities for safe versions', () => {
      const knownVulnerabilities = {
        'lodash': [
          {
            id: 'vuln_1',
            dependencyName: 'lodash',
            severity: 'high' as const,
            affectedVersions: ['4.17.0', '4.17.1'],
            fixedVersion: '4.17.21',
            description: 'Prototype pollution vulnerability',
            discoveredAt: Date.now(),
            resolved: false,
          },
        ],
      };

      const vulns = scanDependencyVulnerabilities(
        vulnerabilityStore,
        'lodash',
        '4.17.21',
        knownVulnerabilities
      );

      expect(vulns).toHaveLength(0);
      expect(vulnerabilityStore).toHaveLength(0);
    });
  });

  describe('Security Advisories', () => {
    it('should create advisory store', () => {
      expect(advisoryStore).toBeDefined();
      expect(advisoryStore).toHaveLength(0);
    });

    it('should generate security advisory', () => {
      const advisory = generateSecurityAdvisory(
        advisoryStore,
        'vulnerability',
        'critical',
        'express',
        'Critical vulnerability in express',
        'Update to version 4.18.0 or later'
      );

      expect(advisory).toBeDefined();
      expect(advisory.dependencyName).toBe('express');
      expect(advisory.severity).toBe('critical');
      expect(advisory.status).toBe('active');
      expect(advisoryStore).toHaveLength(1);
    });

    it('should acknowledge advisory', () => {
      const advisory = generateSecurityAdvisory(
        advisoryStore,
        'vulnerability',
        'high',
        'react',
        'High severity issue',
        'Update react'
      );

      const result = acknowledgeAdvisory(advisoryStore, advisory.id);

      expect(result).toBe(true);
      expect(advisory.status).toBe('acknowledged');
    });

    it('should resolve advisory', () => {
      const advisory = generateSecurityAdvisory(
        advisoryStore,
        'deprecation',
        'medium',
        'old-lib',
        'Library is deprecated',
        'Migrate to new-lib'
      );

      const result = resolveAdvisory(advisoryStore, advisory.id);

      expect(result).toBe(true);
      expect(advisory.status).toBe('resolved');
    });

    it('should get active advisories', () => {
      generateSecurityAdvisory(advisoryStore, 'vulnerability', 'high', 'pkg1', 'msg1', 'rec1');
      const adv2 = generateSecurityAdvisory(advisoryStore, 'vulnerability', 'high', 'pkg2', 'msg2', 'rec2');
      generateSecurityAdvisory(advisoryStore, 'vulnerability', 'high', 'pkg3', 'msg3', 'rec3');

      resolveAdvisory(advisoryStore, adv2.id);

      const activeAdvisories = getActiveAdvisories(advisoryStore);

      expect(activeAdvisories).toHaveLength(2);
      expect(activeAdvisories.every((a) => a.status === 'active')).toBe(true);
    });
  });

  describe('Dependency Updates', () => {
    it('should create update store', () => {
      expect(updateStore).toBeDefined();
      expect(updateStore).toHaveLength(0);
    });

    it('should track dependency update', () => {
      const update = trackDependencyUpdate(
        updateStore,
        'typescript',
        '4.5.0',
        '4.6.0',
        false
      );

      expect(update).toBeDefined();
      expect(update.dependencyName).toBe('typescript');
      expect(update.currentVersion).toBe('4.5.0');
      expect(update.availableVersion).toBe('4.6.0');
      expect(update.updateType).toBe('minor');
      expect(updateStore).toHaveLength(1);
    });

    it('should mark security updates as recommended', () => {
      const update = trackDependencyUpdate(
        updateStore,
        'express',
        '4.17.0',
        '4.18.0',
        true
      );

      expect(update.securityUpdate).toBe(true);
      expect(update.recommended).toBe(true);
    });

    it('should get recommended updates', () => {
      trackDependencyUpdate(updateStore, 'pkg1', '1.0.0', '1.0.1', false);
      trackDependencyUpdate(updateStore, 'pkg2', '2.0.0', '2.1.0', true);
      trackDependencyUpdate(updateStore, 'pkg3', '3.0.0', '4.0.0', false);

      const recommended = getRecommendedUpdates(updateStore);

      expect(recommended.length).toBeGreaterThan(0);
      expect(recommended.every((u) => u.recommended)).toBe(true);
    });
  });

  describe('License Compliance', () => {
    it('should create license store', () => {
      expect(licenseStore).toBeDefined();
      expect(licenseStore).toHaveLength(0);
    });

    it('should check license compliance', () => {
      const license = checkLicenseCompliance(
        licenseStore,
        'react',
        'MIT'
      );

      expect(license).toBeDefined();
      expect(license.dependencyName).toBe('react');
      expect(license.license).toBe('MIT');
      expect(license.compliant).toBe(true);
      expect(licenseStore).toHaveLength(1);
    });

    it('should identify non-compliant licenses', () => {
      checkLicenseCompliance(licenseStore, 'pkg1', 'MIT');
      checkLicenseCompliance(licenseStore, 'pkg2', 'GPL-3.0');
      checkLicenseCompliance(licenseStore, 'pkg3', 'Apache-2.0');

      const nonCompliant = getNonCompliantLicenses(licenseStore);

      expect(nonCompliant.length).toBeGreaterThan(0);
      expect(nonCompliant.every((l) => !l.compliant)).toBe(true);
    });
  });

  describe('Package Integrity', () => {
    it('should create integrity store', () => {
      expect(integrityStore).toBeDefined();
      expect(integrityStore).toHaveLength(0);
    });

    it('should verify package integrity', () => {
      const integrity = verifyPackageIntegrity(
        integrityStore,
        'lodash',
        '4.17.21',
        'abc123def456',
        'abc123def456'
      );

      expect(integrity).toBeDefined();
      expect(integrity.packageName).toBe('lodash');
      expect(integrity.verified).toBe(true);
      expect(integrityStore).toHaveLength(1);
    });

    it('should detect integrity mismatches', () => {
      const integrity = verifyPackageIntegrity(
        integrityStore,
        'express',
        '4.18.0',
        'expected_hash',
        'actual_hash'
      );

      expect(integrity.verified).toBe(false);
    });

    it('should get failed integrity checks', () => {
      verifyPackageIntegrity(integrityStore, 'pkg1', '1.0.0', 'hash1', 'hash1');
      verifyPackageIntegrity(integrityStore, 'pkg2', '2.0.0', 'hash2', 'wrong_hash');
      verifyPackageIntegrity(integrityStore, 'pkg3', '3.0.0', 'hash3', 'hash3');

      const failed = getFailedIntegrityChecks(integrityStore);

      expect(failed).toHaveLength(1);
      expect(failed.every((i) => !i.verified)).toBe(true);
    });
  });

  describe('Risk Scoring', () => {
    it('should create risk score store', () => {
      expect(riskScoreStore).toBeDefined();
      expect(riskScoreStore).toHaveLength(0);
    });

    it('should calculate risk score for dependency', () => {
      const riskScore = calculateRiskScore(
        riskScoreStore,
        'lodash',
        '4.17.0',
        2,
        Date.now() - 30 * 24 * 60 * 60 * 1000,
        false
      );

      expect(riskScore).toBeDefined();
      expect(riskScore.dependencyName).toBe('lodash');
      expect(riskScore.score).toBeGreaterThan(0);
      expect(riskScore.riskLevel).toBeDefined();
      expect(riskScoreStore).toHaveLength(1);
    });

    it('should identify critical risk dependencies', () => {
      calculateRiskScore(riskScoreStore, 'pkg1', '1.0.0', 0, Date.now(), false);
      calculateRiskScore(riskScoreStore, 'pkg2', '2.0.0', 5, Date.now() - 400 * 24 * 60 * 60 * 1000, true);
      calculateRiskScore(riskScoreStore, 'pkg3', '3.0.0', 1, Date.now(), false);

      const highRisk = getHighRiskDependencies(riskScoreStore);

      expect(highRisk.length).toBeGreaterThan(0);
      expect(highRisk.every((r) => r.riskLevel === 'high' || r.riskLevel === 'critical')).toBe(true);
    });
  });

  describe('Audit Logging', () => {
    it('should create audit log store', () => {
      expect(auditLogStore).toBeDefined();
      expect(auditLogStore).toHaveLength(0);
    });

    it('should add audit log entry', () => {
      const log = addAuditLog(
        auditLogStore,
        'scan',
        { scannedDependencies: 50 },
        'success',
        'all'
      );

      expect(log).toBeDefined();
      expect(log.action).toBe('scan');
      expect(log.status).toBe('success');
      expect(auditLogStore).toHaveLength(1);
    });

    it('should log failed operations', () => {
      const log = addAuditLog(
        auditLogStore,
        'verify',
        { error: 'Network timeout' },
        'failure',
        'express'
      );

      expect(log.status).toBe('failure');
      expect(log.details.error).toBe('Network timeout');
    });
  });

  describe('Security Report Generation', () => {
    it('should generate dependency security report', () => {
      scanDependencyVulnerabilities(
        vulnerabilityStore,
        'lodash',
        '4.17.0',
        {
          'lodash': [
            {
              id: 'v1',
              dependencyName: 'lodash',
              severity: 'critical',
              affectedVersions: ['4.17.0'],
              fixedVersion: '4.17.21',
              description: 'test',
              discoveredAt: Date.now(),
              resolved: false,
            },
          ],
        }
      );

      const report = generateDependencySecurityReport(
        vulnerabilityStore,
        advisoryStore,
        updateStore,
        licenseStore,
        integrityStore,
        riskScoreStore
      );

      expect(report).toBeDefined();
      expect(report.timestamp).toBeDefined();
      expect(report.totalVulnerabilities).toBeGreaterThan(0);
      expect(report.overallRiskLevel).toBe('critical');
    });
  });
});

