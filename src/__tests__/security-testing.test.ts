import { describe, it, expect, beforeEach } from 'vitest';
import {
  createSecurityTest,
  createTestResult,
  createVulnerabilityFinding,
  createSecurityTestSuite,
  runSecurityTest,
  runTestSuite,
  testSQLInjection,
  testXSSVulnerability,
  testCSRFTokenValidation,
  testAuthenticationBypass,
  testPrivilegeEscalation,
  testInputValidation,
  generateFuzzingPayloads,
  testFuzzingPayload,
  createComplianceCheckResult,
  validateOWASPCompliance,
  validatePCIDSSCompliance,
  detectSecurityRegression,
  getFailedSecurityTests,
  getCriticalVulnerabilities,
  generateSecurityTestReport,
  SecurityTest,
  TestResult,
  VulnerabilityFinding,
} from '../lib/security-testing';

describe('Security Testing & Validation', () => {
  let tests: SecurityTest[] = [];
  let results: TestResult[] = [];
  let findings: VulnerabilityFinding[] = [];

  beforeEach(() => {
    tests = [];
    results = [];
    findings = [];
  });

  describe('Security Test Management', () => {
    it('should create security test', () => {
      const test = createSecurityTest(
        'SQL Injection Test',
        'injection',
        'critical',
        'Test for SQL injection vulnerabilities',
        'testSQLInjection'
      );

      expect(test).toBeDefined();
      expect(test.name).toBe('SQL Injection Test');
      expect(test.category).toBe('injection');
      expect(test.enabled).toBe(true);
      tests.push(test);
    });

    it('should create test result', () => {
      const result = createTestResult(
        'test_123',
        true,
        150,
        { testName: 'SQL Injection Test' }
      );

      expect(result).toBeDefined();
      expect(result.passed).toBe(true);
      expect(result.duration).toBe(150);
      results.push(result);
    });

    it('should create vulnerability finding', () => {
      const finding = createVulnerabilityFinding(
        'test_123',
        'sql_injection',
        'critical',
        'SQL injection vulnerability found',
        'Use parameterized queries',
        '/api/users'
      );

      expect(finding).toBeDefined();
      expect(finding.type).toBe('sql_injection');
      expect(finding.severity).toBe('critical');
      findings.push(finding);
    });

    it('should create security test suite', () => {
      const test1 = createSecurityTest('Test 1', 'injection', 'high', 'Test 1', 'test1');
      const test2 = createSecurityTest('Test 2', 'xss', 'high', 'Test 2', 'test2');

      const suite = createSecurityTestSuite('Security Test Suite', [test1, test2]);

      expect(suite).toBeDefined();
      expect(suite.totalTests).toBe(2);
      expect(suite.tests).toHaveLength(2);
    });
  });

  describe('SQL Injection Testing', () => {
    it('should detect SQL injection in input', () => {
      const maliciousInput = "' OR '1'='1";
      const result = testSQLInjection(maliciousInput);

      expect(result).toBe(false);
    });

    it('should allow safe SQL input', () => {
      const safeInput = 'john_doe';
      const result = testSQLInjection(safeInput);

      expect(result).toBe(true);
    });

    it('should detect UNION-based SQL injection', () => {
      const maliciousInput = "' UNION SELECT * FROM users--";
      const result = testSQLInjection(maliciousInput);

      expect(result).toBe(false);
    });
  });

  describe('XSS Testing', () => {
    it('should detect XSS in input', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const result = testXSSVulnerability(maliciousInput);

      expect(result).toBe(false);
    });

    it('should allow safe HTML input', () => {
      const safeInput = 'Hello World';
      const result = testXSSVulnerability(safeInput);

      expect(result).toBe(true);
    });

    it('should detect event handler XSS', () => {
      const maliciousInput = '<img src=x onerror="alert(\'XSS\')">';
      const result = testXSSVulnerability(maliciousInput);

      expect(result).toBe(false);
    });
  });

  describe('CSRF Testing', () => {
    it('should validate CSRF token', () => {
      const token = 'abc123def456';
      const result = testCSRFTokenValidation(token, token);

      expect(result).toBe(true);
    });

    it('should reject invalid CSRF token', () => {
      const result = testCSRFTokenValidation('token1', 'token2');

      expect(result).toBe(false);
    });

    it('should reject empty CSRF token', () => {
      const result = testCSRFTokenValidation('', 'token');

      expect(result).toBe(false);
    });
  });

  describe('Authentication Testing', () => {
    it('should detect authentication bypass attempts', () => {
      const bypassAttempt = { username: 'admin', password: '1=1' };
      const validCredentials = { username: 'admin', password: 'password123' };

      const result = testAuthenticationBypass(bypassAttempt, validCredentials);

      expect(result).toBe(false);
    });

    it('should allow valid credentials', () => {
      const credentials = { username: 'admin', password: 'password123' };
      const validCredentials = { username: 'admin', password: 'password123' };

      const result = testAuthenticationBypass(credentials, validCredentials);

      expect(result).toBe(true);
    });

    it('should reject invalid credentials', () => {
      const credentials = { username: 'admin', password: 'wrongpassword' };
      const validCredentials = { username: 'admin', password: 'password123' };

      const result = testAuthenticationBypass(credentials, validCredentials);

      expect(result).toBe(false);
    });
  });

  describe('Authorization Testing', () => {
    it('should detect privilege escalation', () => {
      const result = testPrivilegeEscalation('user', 'admin', ['user', 'moderator']);

      expect(result).toBe(false);
    });

    it('should allow valid role assignment', () => {
      const result = testPrivilegeEscalation('admin', 'moderator', ['user', 'moderator', 'admin']);

      expect(result).toBe(true);
    });

    it('should prevent unauthorized role access', () => {
      const result = testPrivilegeEscalation('user', 'superadmin', ['user']);

      expect(result).toBe(false);
    });
  });

  describe('Input Validation Testing', () => {
    it('should validate input length', () => {
      const result = testInputValidation('test', {
        minLength: 2,
        maxLength: 10,
      });

      expect(result).toBe(true);
    });

    it('should reject input below minimum length', () => {
      const result = testInputValidation('a', {
        minLength: 2,
        maxLength: 10,
      });

      expect(result).toBe(false);
    });

    it('should validate input pattern', () => {
      const result = testInputValidation('user@example.com', {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      });

      expect(result).toBe(true);
    });
  });

  describe('Fuzzing Testing', () => {
    it('should generate fuzzing payloads', () => {
      const payloads = generateFuzzingPayloads();

      expect(payloads).toBeDefined();
      expect(payloads.length).toBeGreaterThan(0);
      expect(payloads[0].payload).toBeDefined();
    });

    it('should detect fuzzing payload in input', () => {
      const payloads = generateFuzzingPayloads();
      const sqlPayload = payloads.find((p) => p.category === 'sql_injection');

      if (sqlPayload) {
        const result = testFuzzingPayload("' OR '1'='1", sqlPayload);
        expect(result).toBe(false);
      }
    });

    it('should allow safe input against fuzzing payloads', () => {
      const payloads = generateFuzzingPayloads();
      const sqlPayload = payloads.find((p) => p.category === 'sql_injection');

      if (sqlPayload) {
        const result = testFuzzingPayload('john_doe', sqlPayload);
        expect(result).toBe(true);
      }
    });
  });

  describe('Compliance Testing', () => {
    it('should validate OWASP compliance', () => {
      const result = validateOWASPCompliance();

      expect(result).toBeDefined();
      expect(result.standard).toBe('OWASP');
      expect(result.checksPassed).toBeGreaterThan(0);
    });

    it('should validate PCI DSS compliance', () => {
      const result = validatePCIDSSCompliance();

      expect(result).toBeDefined();
      expect(result.standard).toBe('PCI_DSS');
      expect(result.checksPassed).toBeGreaterThan(0);
    });

    it('should create compliance check result', () => {
      const result = createComplianceCheckResult(
        'OWASP',
        10,
        0,
        { checks: 'all passed' }
      );

      expect(result).toBeDefined();
      expect(result.passed).toBe(true);
      expect(result.checksFailed).toBe(0);
    });
  });

  describe('Regression Testing', () => {
    it('should detect security regression', () => {
      const previousResult = createTestResult('test_1', true, 100, {});
      const currentResult = createTestResult('test_1', false, 150, {});

      const regression = detectSecurityRegression(previousResult, currentResult);

      expect(regression.regressionDetected).toBe(true);
    });

    it('should not detect regression when test still passes', () => {
      const previousResult = createTestResult('test_1', true, 100, {});
      const currentResult = createTestResult('test_1', true, 120, {});

      const regression = detectSecurityRegression(previousResult, currentResult);

      expect(regression.regressionDetected).toBe(false);
    });
  });

  describe('Test Execution', () => {
    it('should run security test', () => {
      const test = createSecurityTest(
        'SQL Injection Test',
        'injection',
        'critical',
        'Test for SQL injection',
        'testSQLInjection'
      );

      const result = runSecurityTest(test, () => testSQLInjection('safe_input'));

      expect(result).toBeDefined();
      expect(result.passed).toBe(true);
      results.push(result);
    });

    it('should run test suite', () => {
      const test1 = createSecurityTest('Test 1', 'injection', 'high', 'Test 1', 'test1');
      const test2 = createSecurityTest('Test 2', 'xss', 'high', 'Test 2', 'test2');

      const suite = createSecurityTestSuite('Suite', [test1, test2]);

      const testLogics = {
        [test1.id]: () => testSQLInjection('safe_input'),
        [test2.id]: () => testXSSVulnerability('safe_input'),
      };

      const results = runTestSuite(suite, testLogics);

      expect(results).toHaveLength(2);
      expect(suite.lastRunAt).toBeDefined();
    });
  });

  describe('Test Analysis', () => {
    it('should get failed security tests', () => {
      results.push(createTestResult('test_1', true, 100, {}));
      results.push(createTestResult('test_2', false, 150, {}, 'Test failed'));
      results.push(createTestResult('test_3', false, 120, {}, 'Test failed'));

      const failed = getFailedSecurityTests(results);

      expect(failed).toHaveLength(2);
      expect(failed.every((r) => !r.passed)).toBe(true);
    });

    it('should get critical vulnerabilities', () => {
      findings.push(createVulnerabilityFinding('test_1', 'sql_injection', 'critical', 'Critical', 'Fix it'));
      findings.push(createVulnerabilityFinding('test_2', 'xss', 'high', 'High', 'Fix it'));
      findings.push(createVulnerabilityFinding('test_3', 'csrf', 'critical', 'Critical', 'Fix it'));

      const critical = getCriticalVulnerabilities(findings);

      expect(critical).toHaveLength(2);
      expect(critical.every((f) => f.severity === 'critical')).toBe(true);
    });
  });

  describe('Security Test Report', () => {
    it('should generate security test report', () => {
      results.push(createTestResult('test_1', true, 100, {}));
      results.push(createTestResult('test_2', false, 150, {}));
      findings.push(createVulnerabilityFinding('test_1', 'sql_injection', 'critical', 'Critical', 'Fix it'));

      const complianceResults = [validateOWASPCompliance()];

      const report = generateSecurityTestReport(results, findings, complianceResults);

      expect(report).toBeDefined();
      expect(report.timestamp).toBeDefined();
      expect(report.totalTests).toBe(2);
      expect(report.failedTests).toBe(1);
      expect(report.totalVulnerabilities).toBe(1);
    });
  });
});

