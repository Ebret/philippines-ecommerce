'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Lock,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// Types for security dashboard
export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: 'auth' | 'payment' | 'data' | 'network' | 'system' | 'fraud' | 'access' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  userId?: string;
  ipAddress?: string;
  description: string;
  resolved: boolean;
}

export interface SecurityAlert {
  id: string;
  timestamp: number;
  eventId: string;
  alertType: 'threshold_exceeded' | 'anomaly_detected' | 'policy_violation' | 'threat_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface SecurityMetrics {
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

export interface SecurityDashboardProps {
  events?: SecurityEvent[];
  alerts?: SecurityAlert[];
  metrics?: SecurityMetrics;
  onRefresh?: () => void;
  onAcknowledgeAlert?: (alertId: string) => void;
  onResolveAlert?: (alertId: string) => void;
  className?: string;
}

// Severity badge colors
const severityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

// Event type icons
const eventTypeIcons: Record<string, React.ReactNode> = {
  auth: <Lock className="h-4 w-4" />,
  payment: <Shield className="h-4 w-4" />,
  data: <Eye className="h-4 w-4" />,
  network: <Activity className="h-4 w-4" />,
  system: <AlertTriangle className="h-4 w-4" />,
  fraud: <XCircle className="h-4 w-4" />,
  access: <CheckCircle className="h-4 w-4" />,
  validation: <Shield className="h-4 w-4" />,
};

export function SecurityDashboard({
  events = [],
  alerts = [],
  metrics,
  onRefresh,
  onAcknowledgeAlert,
  onResolveAlert,
  className = '',
}: SecurityDashboardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'events' | 'alerts'>('overview');

  // Calculate default metrics if not provided
  const defaultMetrics: SecurityMetrics = metrics || {
    totalEvents: events.length,
    eventsByType: events.reduce((acc, e) => ({ ...acc, [e.type]: (acc[e.type] || 0) + 1 }), {} as Record<string, number>),
    eventsBySeverity: events.reduce((acc, e) => ({ ...acc, [e.severity]: (acc[e.severity] || 0) + 1 }), {} as Record<string, number>),
    alertsGenerated: alerts.length,
    incidentsOpen: alerts.filter((a) => a.status === 'active').length,
    incidentsClosed: alerts.filter((a) => a.status === 'resolved').length,
    threatDetectionRate: events.length > 0 ? (alerts.length / events.length) * 100 : 0,
    averageResponseTime: 0,
    systemHealth: 100 - Math.min(alerts.filter((a) => a.status === 'active').length * 10, 50),
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const recentEvents = events.slice(-10).reverse();

  // Determine threat level based on system health
  const getThreatLevel = (health: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (health >= 75) return 'low';
    if (health >= 50) return 'medium';
    if (health >= 25) return 'high';
    return 'critical';
  };

  const threatLevel = getThreatLevel(defaultMetrics.systemHealth);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Security Dashboard</h2>
          <p className="text-muted-foreground">Real-time security monitoring and threat detection</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* System Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultMetrics.systemHealth.toFixed(0)}%</div>
            <div className="flex items-center mt-1">
              <Badge className={severityColors[threatLevel]}>{threatLevel.toUpperCase()}</Badge>
              {defaultMetrics.systemHealth >= 75 ? (
                <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 ml-2 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {defaultMetrics.incidentsClosed} resolved today
            </p>
          </CardContent>
        </Card>

        {/* Total Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultMetrics.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {defaultMetrics.eventsBySeverity['critical'] || 0} critical
            </p>
          </CardContent>
        </Card>

        {/* Threat Detection Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultMetrics.threatDetectionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg response: {defaultMetrics.averageResponseTime.toFixed(0)}min
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-border">
        {(['overview', 'events', 'alerts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Events by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(defaultMetrics.eventsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {eventTypeIcons[type] || <Activity className="h-4 w-4" />}
                      <span className="text-sm capitalize">{type}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(defaultMetrics.eventsByType).length === 0 && (
                  <p className="text-sm text-muted-foreground">No events recorded</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Events by Severity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Events by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(['critical', 'high', 'medium', 'low'] as const).map((severity) => (
                  <div key={severity} className="flex items-center justify-between">
                    <Badge className={severityColors[severity]}>{severity.toUpperCase()}</Badge>
                    <span className="text-sm font-medium">
                      {defaultMetrics.eventsBySeverity[severity] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'events' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-start space-x-3">
                    {eventTypeIcons[event.type] || <Activity className="h-4 w-4 mt-1" />}
                    <div>
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.source} • {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.ipAddress && (
                        <p className="text-xs text-muted-foreground">IP: {event.ipAddress}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={severityColors[event.severity]}>{event.severity}</Badge>
                </div>
              ))}
              {recentEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent events
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'alerts' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border-l-4 border-l-red-500"
                >
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.alertType.replace('_', ' ')} • {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={severityColors[alert.severity]}>{alert.severity}</Badge>
                    {onAcknowledgeAlert && alert.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {onResolveAlert && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onResolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {activeAlerts.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SecurityDashboard;

