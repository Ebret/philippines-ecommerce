/**
 * Security Monitoring & Logging
 * Real-time security event monitoring, incident tracking, and threat detection
 */

import crypto from 'crypto';

export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: 'auth' | 'payment' | 'data' | 'network' | 'system' | 'fraud' | 'access' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  userId?: string;
  ipAddress?: string;
  description: string;
  details?: Record<string, unknown>;
  resolved: boolean;
}

export interface SecurityAlert {
  id: string;
  timestamp: number;
  eventId: string;
  alertType: 'threshold_exceeded' | 'anomaly_detected' | 'policy_violation' | 'threat_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actionRequired: boolean;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface SecurityIncident {
  id: string;
  timestamp: number;
  eventIds: string[];
  incidentType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: number;
}

export interface SecurityMetrics {
  timestamp: number;
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  alertsGenerated: number;
  incidentsOpen: number;
  incidentsClosed: number;
  threatDetectionRate: number;
  averageResponseTime: number;
  systemHealth: number;
}

export interface ThreatDetectionResult {
  isThreat: boolean;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threatFactors: string[];
  confidence: number;
  recommendation: string;
}

export interface SecurityDashboardData {
  timestamp: number;
  totalEvents: number;
  activeAlerts: number;
  openIncidents: number;
  systemHealth: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  recentEvents: SecurityEvent[];
  topThreats: string[];
  metrics: SecurityMetrics;
}

/**
 * Create security event store
 */
export function createSecurityEventStore(): SecurityEvent[] {
  return [];
}

/**
 * Log security event
 */
export function logSecurityEvent(
  store: SecurityEvent[],
  type: SecurityEvent['type'],
  severity: SecurityEvent['severity'],
  source: string,
  description: string,
  userId?: string,
  ipAddress?: string,
  details?: Record<string, unknown>
): SecurityEvent {
  const event: SecurityEvent = {
    id: `evt_${crypto.randomBytes(8).toString('hex')}`,
    timestamp: Date.now(),
    type,
    severity,
    source,
    userId,
    ipAddress,
    description,
    details,
    resolved: false,
  };

  store.push(event);
  return event;
}

/**
 * Create alert store
 */
export function createAlertStore(): SecurityAlert[] {
  return [];
}

/**
 * Generate security alert
 */
export function generateSecurityAlert(
  alertStore: SecurityAlert[],
  eventId: string,
  alertType: SecurityAlert['alertType'],
  severity: SecurityAlert['severity'],
  message: string,
  actionRequired: boolean = false
): SecurityAlert {
  const alert: SecurityAlert = {
    id: `alert_${crypto.randomBytes(8).toString('hex')}`,
    timestamp: Date.now(),
    eventId,
    alertType,
    severity,
    message,
    actionRequired,
    status: 'active',
  };

  alertStore.push(alert);
  return alert;
}

/**
 * Acknowledge alert
 */
export function acknowledgeAlert(alertStore: SecurityAlert[], alertId: string): boolean {
  const alert = alertStore.find((a) => a.id === alertId);
  if (alert) {
    alert.status = 'acknowledged';
    return true;
  }
  return false;
}

/**
 * Resolve alert
 */
export function resolveAlert(alertStore: SecurityAlert[], alertId: string): boolean {
  const alert = alertStore.find((a) => a.id === alertId);
  if (alert) {
    alert.status = 'resolved';
    return true;
  }
  return false;
}

/**
 * Create incident store
 */
export function createIncidentStore(): SecurityIncident[] {
  return [];
}

/**
 * Create security incident
 */
export function createSecurityIncident(
  incidentStore: SecurityIncident[],
  eventIds: string[],
  incidentType: string,
  severity: SecurityIncident['severity'],
  description: string
): SecurityIncident {
  const incident: SecurityIncident = {
    id: `inc_${crypto.randomBytes(8).toString('hex')}`,
    timestamp: Date.now(),
    eventIds,
    incidentType,
    severity,
    description,
    status: 'open',
  };

  incidentStore.push(incident);
  return incident;
}

/**
 * Update incident status
 */
export function updateIncidentStatus(
  incidentStore: SecurityIncident[],
  incidentId: string,
  status: SecurityIncident['status'],
  resolution?: string
): boolean {
  const incident = incidentStore.find((i) => i.id === incidentId);
  if (incident) {
    incident.status = status;
    if (resolution) {
      incident.resolution = resolution;
      incident.resolvedAt = Date.now();
    }
    return true;
  }
  return false;
}

/**
 * Detect threats using multiple factors
 */
export function detectThreats(
  event: SecurityEvent,
  recentEvents: SecurityEvent[]
): ThreatDetectionResult {
  const threatFactors: string[] = [];
  let threatScore = 0;

  // Check severity
  if (event.severity === 'critical') {
    threatFactors.push('Critical severity event');
    threatScore += 40;
  } else if (event.severity === 'high') {
    threatFactors.push('High severity event');
    threatScore += 25;
  }

  // Check event frequency
  const recentSimilarEvents = recentEvents.filter(
    (e) => e.type === event.type && Date.now() - e.timestamp < 300000 // 5 minutes
  );
  if (recentSimilarEvents.length > 5) {
    threatFactors.push('High event frequency detected');
    threatScore += 30;
  }

  // Check for multiple event types
  const eventTypes = new Set(recentEvents.map((e) => e.type));
  if (eventTypes.size > 4) {
    threatFactors.push('Multiple event types detected');
    threatScore += 15;
  }

  // Check for multiple IPs
  const ips = new Set(recentEvents.filter((e) => e.ipAddress).map((e) => e.ipAddress));
  if (ips.size > 3) {
    threatFactors.push('Multiple IP addresses detected');
    threatScore += 25;
  }

  const threatLevel =
    threatScore >= 50 ? 'critical' : threatScore >= 35 ? 'high' : threatScore >= 20 ? 'medium' : 'low';

  return {
    isThreat: threatScore >= 20,
    threatLevel,
    threatFactors,
    confidence: Math.min(threatScore / 100, 1),
    recommendation: threatScore >= 50 ? 'Block immediately' : threatScore >= 35 ? 'Review and monitor' : 'Monitor',
  };
}

/**
 * Calculate security metrics
 */
export function calculateSecurityMetrics(
  eventStore: SecurityEvent[],
  alertStore: SecurityAlert[],
  incidentStore: SecurityIncident[]
): SecurityMetrics {
  const eventsByType: Record<string, number> = {};
  const eventsBySeverity: Record<string, number> = {};

  eventStore.forEach((event) => {
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
  });

  const openIncidents = incidentStore.filter((i) => i.status !== 'resolved').length;
  const closedIncidents = incidentStore.filter((i) => i.status === 'resolved').length;

  const threatDetectionRate = eventStore.length > 0 ? (openIncidents / eventStore.length) * 100 : 0;

  const responseTimes = incidentStore
    .filter((i) => i.resolvedAt)
    .map((i) => (i.resolvedAt! - i.timestamp) / 1000 / 60); // in minutes
  const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b) / responseTimes.length : 0;

  // Calculate system health based on events and incidents
  let systemHealth = 100;
  if (eventStore.length > 0) {
    systemHealth -= Math.min(threatDetectionRate, 50);
    systemHealth -= Math.min(openIncidents * 5, 30);
  }

  return {
    timestamp: Date.now(),
    totalEvents: eventStore.length,
    eventsByType,
    eventsBySeverity,
    alertsGenerated: alertStore.length,
    incidentsOpen: openIncidents,
    incidentsClosed: closedIncidents,
    threatDetectionRate,
    averageResponseTime,
    systemHealth: Math.max(0, Math.min(systemHealth, 100)),
  };
}

/**
 * Get events by type
 */
export function getEventsByType(store: SecurityEvent[], type: SecurityEvent['type']): SecurityEvent[] {
  return store.filter((e) => e.type === type);
}

/**
 * Get events by severity
 */
export function getEventsBySeverity(store: SecurityEvent[], severity: SecurityEvent['severity']): SecurityEvent[] {
  return store.filter((e) => e.severity === severity);
}

/**
 * Get events by user
 */
export function getEventsByUser(store: SecurityEvent[], userId: string): SecurityEvent[] {
  return store.filter((e) => e.userId === userId);
}

/**
 * Get events by IP address
 */
export function getEventsByIP(store: SecurityEvent[], ipAddress: string): SecurityEvent[] {
  return store.filter((e) => e.ipAddress === ipAddress);
}

/**
 * Get events by date range
 */
export function getEventsByDateRange(store: SecurityEvent[], startTime: number, endTime: number): SecurityEvent[] {
  return store.filter((e) => e.timestamp >= startTime && e.timestamp <= endTime);
}

/**
 * Get active alerts
 */
export function getActiveAlerts(store: SecurityAlert[]): SecurityAlert[] {
  return store.filter((a) => a.status === 'active');
}

/**
 * Get open incidents
 */
export function getOpenIncidents(store: SecurityIncident[]): SecurityIncident[] {
  return store.filter((i) => i.status !== 'resolved');
}

/**
 * Generate security dashboard data
 */
export function generateSecurityDashboardData(
  eventStore: SecurityEvent[],
  alertStore: SecurityAlert[],
  incidentStore: SecurityIncident[]
): SecurityDashboardData {
  const metrics = calculateSecurityMetrics(eventStore, alertStore, incidentStore);
  const activeAlerts = getActiveAlerts(alertStore);
  const openIncidents = getOpenIncidents(incidentStore);

  const recentEvents = eventStore.slice(-10);
  const threatCounts: Record<string, number> = {};
  eventStore.forEach((e) => {
    threatCounts[e.type] = (threatCounts[e.type] || 0) + 1;
  });
  const topThreats = Object.entries(threatCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((e) => e[0]);

  const threatLevel =
    metrics.systemHealth < 30 ? 'critical' : metrics.systemHealth < 50 ? 'high' : metrics.systemHealth < 75 ? 'medium' : 'low';

  return {
    timestamp: Date.now(),
    totalEvents: metrics.totalEvents,
    activeAlerts: activeAlerts.length,
    openIncidents: openIncidents.length,
    systemHealth: metrics.systemHealth,
    threatLevel,
    recentEvents,
    topThreats,
    metrics,
  };
}

