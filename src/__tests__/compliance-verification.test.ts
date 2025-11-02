import { describe, it, expect, beforeEach } from 'vitest';
import {
  createComplianceStandard,
  createComplianceRequirement,
  createComplianceAuditLog,
  createSecurityCertification,
  checkCertificationExpiration,
  createRegulatoryComplianceCheck,
  createCompliancePolicy,
  createNonComplianceIssue,
  validateOWASPCompliance,
  validatePCIDSSCompliance,
  validateGDPRCompliance,
  validatePhilippinesDataProtection,
  calculateComplianceScore,
  getNonCompliantRequirements,
  getOpenNonComplianceIssues,
  getCriticalNonComplianceIssues,
  getExpiringCertifications,
  generateComplianceDashboardData,
  generateComplianceAuditTrail,
  generateComplianceReport,
  ComplianceStandard,
  ComplianceRequirement,
  SecurityCertification,
  NonComplianceIssue,
  ComplianceAuditLog,
} from '../lib/compliance-verification';

describe('Compliance Verification', () => {
  let standards: ComplianceStandard[] = [];
  let certifications: SecurityCertification[] = [];
  let issues: NonComplianceIssue[] = [];
  let auditLogs: ComplianceAuditLog[] = [];

  beforeEach(() => {
    standards = [];
    certifications = [];
    issues = [];
    auditLogs = [];
  });

  describe('Compliance Standard Management', () => {
    it('should create compliance standard', () => {
      const req = createComplianceRequirement('REQ1', 'Requirement 1', 'Description');
      const standard = createComplianceStandard('OWASP', '2021', [req]);

      expect(standard).toBeDefined();
      expect(standard.name).toBe('OWASP');
      expect(standard.version).toBe('2021');
      expect(standard.enabled).toBe(true);
      standards.push(standard);
    });

    it('should create compliance requirement', () => {
      const req = createComplianceRequirement('REQ1', 'Requirement 1', 'Description');

      expect(req).toBeDefined();
      expect(req.code).toBe('REQ1');
      expect(req.title).toBe('Requirement 1');
      expect(req.status).toBe('not_applicable');
    });

    it('should create compliance audit log', () => {
      const log = createComplianceAuditLog(
        'check',
        'OWASP',
        'REQ1',
        'pass',
        { result: 'passed' },
        'user123'
      );

      expect(log).toBeDefined();
      expect(log.action).toBe('check');
      expect(log.status).toBe('pass');
      auditLogs.push(log);
    });
  });

  describe('Security Certification Management', () => {
    it('should create security certification', () => {
      const cert = createSecurityCertification('ISO 27001', 'Issuer', 365);

      expect(cert).toBeDefined();
      expect(cert.name).toBe('ISO 27001');
      expect(cert.status).toBe('active');
      expect(cert.certificateNumber).toBeDefined();
      certifications.push(cert);
    });

    it('should check certification expiration', () => {
      const cert = createSecurityCertification('ISO 27001', 'Issuer', 365);

      expect(checkCertificationExpiration(cert)).toBe(true);
    });

    it('should mark expired certification', () => {
      const cert = createSecurityCertification('ISO 27001', 'Issuer', -1);

      expect(checkCertificationExpiration(cert)).toBe(false);
      expect(cert.status).toBe('expired');
    });

    it('should get expiring certifications', () => {
      certifications.push(createSecurityCertification('Cert 1', 'Issuer', 30));
      certifications.push(createSecurityCertification('Cert 2', 'Issuer', 120));
      certifications.push(createSecurityCertification('Cert 3', 'Issuer', 365));

      const expiring = getExpiringCertifications(certifications, 90);

      expect(expiring.length).toBeGreaterThan(0);
    });
  });

  describe('Regulatory Compliance', () => {
    it('should create regulatory compliance check', () => {
      const check = createRegulatoryComplianceCheck('PH', ['RA 10173', 'RA 10927']);

      expect(check).toBeDefined();
      expect(check.jurisdiction).toBe('PH');
      expect(check.regulations).toContain('RA 10173');
    });

    it('should validate Philippines data protection', () => {
      const requirements = validatePhilippinesDataProtection();

      expect(requirements).toBeDefined();
      expect(requirements.length).toBeGreaterThan(0);
      expect(requirements.every((r) => r.status === 'compliant')).toBe(true);
    });
  });

  describe('Compliance Policy Management', () => {
    it('should create compliance policy', () => {
      const policy = createCompliancePolicy(
        'Data Protection Policy',
        'Policy for data protection',
        ['Encrypt data', 'Audit logs'],
        'mandatory'
      );

      expect(policy).toBeDefined();
      expect(policy.name).toBe('Data Protection Policy');
      expect(policy.active).toBe(true);
      expect(policy.enforcementLevel).toBe('mandatory');
    });
  });

  describe('Non-Compliance Issue Management', () => {
    it('should create non-compliance issue', () => {
      const issue = createNonComplianceIssue(
        'OWASP',
        'A01',
        'critical',
        'Broken access control',
        'Implement proper access controls',
        30
      );

      expect(issue).toBeDefined();
      expect(issue.severity).toBe('critical');
      expect(issue.status).toBe('open');
      issues.push(issue);
    });

    it('should get open non-compliance issues', () => {
      issues.push(
        createNonComplianceIssue('OWASP', 'A01', 'high', 'Issue 1', 'Fix it', 30)
      );
      issues.push(
        createNonComplianceIssue('OWASP', 'A02', 'medium', 'Issue 2', 'Fix it', 30)
      );

      const openIssues = getOpenNonComplianceIssues(issues);

      expect(openIssues.length).toBeGreaterThan(0);
      expect(openIssues.every((i) => i.status === 'open')).toBe(true);
    });

    it('should get critical non-compliance issues', () => {
      issues.push(
        createNonComplianceIssue('OWASP', 'A01', 'critical', 'Critical', 'Fix it', 30)
      );
      issues.push(
        createNonComplianceIssue('OWASP', 'A02', 'high', 'High', 'Fix it', 30)
      );
      issues.push(
        createNonComplianceIssue('OWASP', 'A03', 'critical', 'Critical', 'Fix it', 30)
      );

      const critical = getCriticalNonComplianceIssues(issues);

      expect(critical.length).toBeGreaterThan(0);
      expect(critical.every((i) => i.severity === 'critical')).toBe(true);
    });
  });

  describe('Compliance Validation', () => {
    it('should validate OWASP compliance', () => {
      const requirements = validateOWASPCompliance();

      expect(requirements).toBeDefined();
      expect(requirements.length).toBeGreaterThan(0);
      expect(requirements.every((r) => r.status === 'compliant')).toBe(true);
    });

    it('should validate PCI DSS compliance', () => {
      const requirements = validatePCIDSSCompliance();

      expect(requirements).toBeDefined();
      expect(requirements.length).toBeGreaterThan(0);
      expect(requirements.every((r) => r.status === 'compliant')).toBe(true);
    });

    it('should validate GDPR compliance', () => {
      const requirements = validateGDPRCompliance();

      expect(requirements).toBeDefined();
      expect(requirements.length).toBeGreaterThan(0);
      expect(requirements.every((r) => r.status === 'compliant')).toBe(true);
    });
  });

  describe('Compliance Scoring', () => {
    it('should calculate compliance score', () => {
      const req1 = createComplianceRequirement('REQ1', 'Req 1', 'Desc');
      const req2 = createComplianceRequirement('REQ2', 'Req 2', 'Desc');
      const req3 = createComplianceRequirement('REQ3', 'Req 3', 'Desc');

      req1.status = 'compliant';
      req2.status = 'compliant';
      req3.status = 'non_compliant';

      const score = calculateComplianceScore([req1, req2, req3]);

      expect(score).toBe(67);
    });

    it('should get non-compliant requirements', () => {
      const req1 = createComplianceRequirement('REQ1', 'Req 1', 'Desc');
      const req2 = createComplianceRequirement('REQ2', 'Req 2', 'Desc');

      req1.status = 'compliant';
      req2.status = 'non_compliant';

      const nonCompliant = getNonCompliantRequirements([req1, req2]);

      expect(nonCompliant).toHaveLength(1);
      expect(nonCompliant[0].status).toBe('non_compliant');
    });
  });

  describe('Compliance Dashboard', () => {
    it('should generate compliance dashboard data', () => {
      const req = createComplianceRequirement('REQ1', 'Req 1', 'Desc');
      req.status = 'compliant';

      const standard = createComplianceStandard('OWASP', '2021', [req]);
      standards.push(standard);

      const cert = createSecurityCertification('ISO 27001', 'Issuer', 365);
      certifications.push(cert);

      const dashboard = generateComplianceDashboardData(standards, certifications, auditLogs, issues);

      expect(dashboard).toBeDefined();
      expect(dashboard.timestamp).toBeDefined();
      expect(dashboard.overallComplianceScore).toBeGreaterThanOrEqual(0);
      expect(dashboard.standardsStatus).toBeDefined();
    });
  });

  describe('Compliance Audit Trail', () => {
    it('should generate compliance audit trail', () => {
      auditLogs.push(
        createComplianceAuditLog('check', 'OWASP', 'REQ1', 'pass', {})
      );
      auditLogs.push(
        createComplianceAuditLog('check', 'OWASP', 'REQ2', 'fail', {})
      );
      auditLogs.push(
        createComplianceAuditLog('check', 'OWASP', 'REQ3', 'warning', {})
      );

      const trail = generateComplianceAuditTrail(auditLogs);

      expect(trail).toBeDefined();
      expect(trail.totalAudits).toBe(3);
      expect(trail.passedAudits).toBe(1);
      expect(trail.failedAudits).toBe(1);
      expect(trail.warnings).toBe(1);
    });
  });

  describe('Compliance Report', () => {
    it('should generate compliance report', () => {
      const req = createComplianceRequirement('REQ1', 'Req 1', 'Desc');
      req.status = 'compliant';

      const standard = createComplianceStandard('OWASP', '2021', [req]);
      standards.push(standard);

      const cert = createSecurityCertification('ISO 27001', 'Issuer', 365);
      certifications.push(cert);

      issues.push(
        createNonComplianceIssue('OWASP', 'A01', 'high', 'Issue', 'Fix it', 30)
      );

      const report = generateComplianceReport(standards, certifications, issues);

      expect(report).toBeDefined();
      expect(report.timestamp).toBeDefined();
      expect(report.overallComplianceScore).toBeGreaterThanOrEqual(0);
      expect(report.standards).toBeDefined();
      expect(report.certifications).toBeDefined();
      expect(report.nonComplianceIssues).toBeDefined();
    });
  });
});

