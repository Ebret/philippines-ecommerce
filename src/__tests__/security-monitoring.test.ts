import { describe, it, expect, beforeEach } from 'vitest';
import {
  createSecurityEventStore,
  logSecurityEvent,
  createAlertStore,
  generateSecurityAlert,
  acknowledgeAlert,
  resolveAlert,
  createIncidentStore,
  createSecurityIncident,
  updateIncidentStatus,
  detectThreats,
  calculateSecurityMetrics,
  getEventsByType,
  getEventsBySeverity,
  getEventsByUser,
  getEventsByIP,
  getEventsByDateRange,
  getActiveAlerts,
  getOpenIncidents,
  generateSecurityDashboardData,
  SecurityEvent,
} from '../lib/security-monitoring';

describe('Security Monitoring & Logging', () => {
  let eventStore: SecurityEvent[];
  let alertStore: ReturnType<typeof createAlertStore>;
  let incidentStore: ReturnType<typeof createIncidentStore>;

  beforeEach(() => {
    eventStore = createSecurityEventStore();
    alertStore = createAlertStore();
    incidentStore = createIncidentStore();
  });

  describe('Security Event Logging', () => {
    it('should create security event store', () => {
      expect(eventStore).toBeDefined();
      expect(eventStore).toHaveLength(0);
    });

    it('should log security event', () => {
      const event = logSecurityEvent(
        eventStore,
        'auth',
        'high',
        'login_module',
        'Failed login attempt',
        'user123',
        '192.168.1.1'
      );

      expect(event).toBeDefined();
      expect(event.type).toBe('auth');
      expect(event.severity).toBe('high');
      expect(event.source).toBe('login_module');
      expect(event.userId).toBe('user123');
      expect(event.ipAddress).toBe('192.168.1.1');
      expect(eventStore).toHaveLength(1);
    });

    it('should log multiple security events', () => {
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      logSecurityEvent(eventStore, 'payment', 'critical', 'payment', 'Fraud detected');
      logSecurityEvent(eventStore, 'data', 'medium', 'database', 'Unauthorized access');

      expect(eventStore).toHaveLength(3);
    });

    it('should get events by type', () => {
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      logSecurityEvent(eventStore, 'auth', 'medium', 'login', 'Suspicious activity');
      logSecurityEvent(eventStore, 'payment', 'critical', 'payment', 'Fraud detected');

      const authEvents = getEventsByType(eventStore, 'auth');

      expect(authEvents).toHaveLength(2);
      expect(authEvents.every((e) => e.type === 'auth')).toBe(true);
    });

    it('should get events by severity', () => {
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      logSecurityEvent(eventStore, 'payment', 'critical', 'payment', 'Fraud detected');
      logSecurityEvent(eventStore, 'data', 'low', 'database', 'Info access');

      const criticalEvents = getEventsBySeverity(eventStore, 'critical');

      expect(criticalEvents).toHaveLength(1);
      expect(criticalEvents[0].severity).toBe('critical');
    });

    it('should get events by user', () => {
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login', 'user123');
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login', 'user456');
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login', 'user123');

      const userEvents = getEventsByUser(eventStore, 'user123');

      expect(userEvents).toHaveLength(2);
      expect(userEvents.every((e) => e.userId === 'user123')).toBe(true);
    });

    it('should get events by IP address', () => {
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login', undefined, '192.168.1.1');
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login', undefined, '192.168.1.2');
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login', undefined, '192.168.1.1');

      const ipEvents = getEventsByIP(eventStore, '192.168.1.1');

      expect(ipEvents).toHaveLength(2);
      expect(ipEvents.every((e) => e.ipAddress === '192.168.1.1')).toBe(true);
    });

    it('should get events by date range', () => {
      const now = Date.now();
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');

      const rangeEvents = getEventsByDateRange(eventStore, now - 1000, now + 1000);

      expect(rangeEvents.length).toBeGreaterThan(0);
    });
  });

  describe('Security Alerts', () => {
    it('should create alert store', () => {
      expect(alertStore).toBeDefined();
      expect(alertStore).toHaveLength(0);
    });

    it('should generate security alert', () => {
      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const alert = generateSecurityAlert(alertStore, event.id, 'threshold_exceeded', 'high', 'Too many failed logins');

      expect(alert).toBeDefined();
      expect(alert.eventId).toBe(event.id);
      expect(alert.alertType).toBe('threshold_exceeded');
      expect(alert.severity).toBe('high');
      expect(alert.status).toBe('active');
      expect(alertStore).toHaveLength(1);
    });

    it('should acknowledge alert', () => {
      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const alert = generateSecurityAlert(alertStore, event.id, 'threshold_exceeded', 'high', 'Too many failed logins');

      const acknowledged = acknowledgeAlert(alertStore, alert.id);

      expect(acknowledged).toBe(true);
      expect(alert.status).toBe('acknowledged');
    });

    it('should resolve alert', () => {
      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const alert = generateSecurityAlert(alertStore, event.id, 'threshold_exceeded', 'high', 'Too many failed logins');

      const resolved = resolveAlert(alertStore, alert.id);

      expect(resolved).toBe(true);
      expect(alert.status).toBe('resolved');
    });

    it('should get active alerts', () => {
      const event1 = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const event2 = logSecurityEvent(eventStore, 'payment', 'critical', 'payment', 'Fraud detected');

      const alert1 = generateSecurityAlert(alertStore, event1.id, 'threshold_exceeded', 'high', 'Too many failed logins');
      const alert2 = generateSecurityAlert(alertStore, event2.id, 'threat_detected', 'critical', 'Fraud detected');

      resolveAlert(alertStore, alert1.id);

      const activeAlerts = getActiveAlerts(alertStore);

      expect(activeAlerts).toHaveLength(1);
      expect(activeAlerts[0].id).toBe(alert2.id);
    });
  });

  describe('Security Incidents', () => {
    it('should create incident store', () => {
      expect(incidentStore).toBeDefined();
      expect(incidentStore).toHaveLength(0);
    });

    it('should create security incident', () => {
      const event1 = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const event2 = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');

      const incident = createSecurityIncident(
        incidentStore,
        [event1.id, event2.id],
        'brute_force_attack',
        'high',
        'Multiple failed login attempts detected'
      );

      expect(incident).toBeDefined();
      expect(incident.incidentType).toBe('brute_force_attack');
      expect(incident.severity).toBe('high');
      expect(incident.status).toBe('open');
      expect(incidentStore).toHaveLength(1);
    });

    it('should update incident status', () => {
      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const incident = createSecurityIncident(incidentStore, [event.id], 'brute_force_attack', 'high', 'Attack detected');

      const updated = updateIncidentStatus(incidentStore, incident.id, 'investigating');

      expect(updated).toBe(true);
      expect(incident.status).toBe('investigating');
    });

    it('should resolve incident with resolution', () => {
      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const incident = createSecurityIncident(incidentStore, [event.id], 'brute_force_attack', 'high', 'Attack detected');

      const resolved = updateIncidentStatus(
        incidentStore,
        incident.id,
        'resolved',
        'IP address blocked and user notified'
      );

      expect(resolved).toBe(true);
      expect(incident.status).toBe('resolved');
      expect(incident.resolution).toBe('IP address blocked and user notified');
      expect(incident.resolvedAt).toBeDefined();
    });

    it('should get open incidents', () => {
      const event1 = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const event2 = logSecurityEvent(eventStore, 'payment', 'critical', 'payment', 'Fraud detected');

      const incident1 = createSecurityIncident(incidentStore, [event1.id], 'brute_force', 'high', 'Attack 1');
      const incident2 = createSecurityIncident(incidentStore, [event2.id], 'fraud', 'critical', 'Attack 2');

      updateIncidentStatus(incidentStore, incident1.id, 'resolved');

      const openIncidents = getOpenIncidents(incidentStore);

      expect(openIncidents).toHaveLength(1);
      expect(openIncidents[0].id).toBe(incident2.id);
    });
  });

  describe('Threat Detection', () => {
    it('should detect low-threat event', () => {
      const event = logSecurityEvent(eventStore, 'access', 'low', 'api', 'Normal access');

      const result = detectThreats(event, []);

      expect(result.isThreat).toBe(false);
      expect(result.threatLevel).toBe('low');
      expect(result.confidence).toBeLessThan(0.3);
    });

    it('should detect high-threat event', () => {
      const event = logSecurityEvent(eventStore, 'fraud', 'critical', 'payment', 'Fraud detected');

      const result = detectThreats(event, []);

      expect(result.isThreat).toBe(true);
      expect(result.threatLevel).toBe('high');
      expect(result.threatFactors.length).toBeGreaterThan(0);
    });

    it('should detect threat from event frequency', () => {
      const baseEvent = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');

      for (let i = 0; i < 6; i++) {
        logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      }

      const result = detectThreats(baseEvent, eventStore);

      expect(result.isThreat).toBe(true);
      expect(result.threatLevel).toBe('critical');
      expect(result.threatFactors.some((f) => f.includes('frequency'))).toBe(true);
    });

    it('should detect threat from multiple IPs', () => {
      const baseEvent = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login', undefined, '192.168.1.1');

      for (let i = 0; i < 4; i++) {
        logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login', undefined, `192.168.1.${i + 2}`);
      }

      const result = detectThreats(baseEvent, eventStore);

      expect(result.isThreat).toBe(true);
      expect(result.threatLevel).toBe('critical');
      expect(result.threatFactors.some((f) => f.includes('IP'))).toBe(true);
    });
  });

  describe('Security Metrics', () => {
    it('should calculate security metrics', () => {
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      logSecurityEvent(eventStore, 'payment', 'critical', 'payment', 'Fraud detected');
      logSecurityEvent(eventStore, 'data', 'low', 'database', 'Info access');

      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      createSecurityIncident(incidentStore, [event.id], 'brute_force', 'high', 'Attack');

      const metrics = calculateSecurityMetrics(eventStore, alertStore, incidentStore);

      expect(metrics.totalEvents).toBe(4);
      expect(metrics.eventsByType['auth']).toBe(2);
      expect(metrics.eventsBySeverity['critical']).toBe(1);
      expect(metrics.systemHealth).toBeGreaterThanOrEqual(0);
      expect(metrics.systemHealth).toBeLessThanOrEqual(100);
    });

    it('should calculate system health', () => {
      for (let i = 0; i < 10; i++) {
        logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      }

      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      createSecurityIncident(incidentStore, [event.id], 'brute_force', 'high', 'Attack');

      const metrics = calculateSecurityMetrics(eventStore, alertStore, incidentStore);

      expect(metrics.systemHealth).toBeLessThan(100);
      expect(metrics.systemHealth).toBeGreaterThanOrEqual(0);
    });

    it('should calculate average response time', () => {
      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      const incident = createSecurityIncident(incidentStore, [event.id], 'brute_force', 'high', 'Attack');

      updateIncidentStatus(incidentStore, incident.id, 'resolved');

      const metrics = calculateSecurityMetrics(eventStore, alertStore, incidentStore);

      expect(metrics.averageResponseTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Security Dashboard', () => {
    it('should generate security dashboard data', () => {
      logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      logSecurityEvent(eventStore, 'payment', 'critical', 'payment', 'Fraud detected');

      const event = logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      generateSecurityAlert(alertStore, event.id, 'threshold_exceeded', 'high', 'Too many failed logins');

      const dashboard = generateSecurityDashboardData(eventStore, alertStore, incidentStore);

      expect(dashboard).toBeDefined();
      expect(dashboard.totalEvents).toBe(3);
      expect(dashboard.activeAlerts).toBe(1);
      expect(dashboard.systemHealth).toBeGreaterThanOrEqual(0);
      expect(dashboard.threatLevel).toBeDefined();
      expect(dashboard.recentEvents.length).toBeGreaterThan(0);
    });

    it('should identify top threats', () => {
      for (let i = 0; i < 5; i++) {
        logSecurityEvent(eventStore, 'auth', 'high', 'login', 'Failed login');
      }
      for (let i = 0; i < 3; i++) {
        logSecurityEvent(eventStore, 'payment', 'critical', 'payment', 'Fraud detected');
      }
      logSecurityEvent(eventStore, 'data', 'low', 'database', 'Info access');

      const dashboard = generateSecurityDashboardData(eventStore, alertStore, incidentStore);

      expect(dashboard.topThreats).toContain('auth');
      expect(dashboard.topThreats[0]).toBe('auth');
    });

    it('should calculate threat level based on system health', () => {
      for (let i = 0; i < 20; i++) {
        logSecurityEvent(eventStore, 'auth', 'critical', 'login', 'Critical event');
      }

      const dashboard = generateSecurityDashboardData(eventStore, alertStore, incidentStore);

      expect(dashboard.threatLevel).toBeDefined();
      expect(['low', 'medium', 'high', 'critical']).toContain(dashboard.threatLevel);
    });
  });
});

