'use client';

/**
 * Audit Log Viewer Component
 * Phase 26.1.3: Inventory History & Audit Logs
 * 
 * Detailed audit log viewer for compliance and tracking purposes.
 * Shows all inventory-related actions with full context.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, Search, Download, Filter, ChevronLeft, ChevronRight,
  User, Clock, MapPin, Package, FileText, RefreshCw
} from 'lucide-react';

// Types for audit log
export interface AuditLogEntry {
  id: string;
  entityType: 'INVENTORY' | 'PRODUCT' | 'VARIANT' | 'LOCATION' | 'ALERT';
  entityId: string;
  action: string;
  changes: Record<string, { old: any; new: any }>;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  user: { name: string | null; email: string; role: string };
  createdAt: string;
}

interface AuditLogViewerProps {
  entityType?: string;
  entityId?: string;
  userId?: string;
  className?: string;
}

export function AuditLogViewer({
  entityType,
  entityId,
  userId,
  className,
}: AuditLogViewerProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEntity, setFilterEntity] = useState<string>(entityType || 'all');

  // Fetch audit logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filterEntity !== 'all' && { entityType: filterEntity }),
        ...(entityId && { entityId }),
        ...(userId && { userId }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/inventory/audit-logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      
      const data = await response.json();
      setLogs(data.logs || []);
      setTotalPages(data.pagination?.pages || 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [page, filterEntity, entityId, userId, searchQuery]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Get entity badge color
  const getEntityBadge = (type: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'secondary'> = {
      INVENTORY: 'default',
      PRODUCT: 'success',
      VARIANT: 'secondary',
      LOCATION: 'warning',
      ALERT: 'error',
    };
    return <Badge variant={colors[type] || 'secondary'}>{type}</Badge>;
  };

  // Export audit logs
  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Entity Type', 'Entity ID', 'Action', 'User', 'Changes'].join(','),
      ...logs.map(log => [
        log.createdAt,
        log.entityType,
        log.entityId,
        log.action,
        log.user?.email || '',
        JSON.stringify(log.changes).replace(/,/g, ';'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Audit Log</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-border p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by action or entity ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Entities</option>
          <option value="INVENTORY">Inventory</option>
          <option value="PRODUCT">Product</option>
          <option value="VARIANT">Variant</option>
          <option value="LOCATION">Location</option>
          <option value="ALERT">Alert</option>
        </select>
      </div>

      {/* Log Entries */}
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">{error}</div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Shield className="mb-2 h-8 w-8" />
            <p>No audit logs found</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getEntityBadge(log.entityType)}
                    <span className="font-medium text-foreground">{log.action}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {log.entityId.substring(0, 8)}...
                    </span>
                  </div>

                  {/* Changes */}
                  {Object.keys(log.changes).length > 0 && (
                    <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                      {Object.entries(log.changes).map(([field, change]) => (
                        <div key={field} className="flex gap-2">
                          <span className="font-medium">{field}:</span>
                          <span className="text-red-600 line-through">{String(change.old)}</span>
                          <span>→</span>
                          <span className="text-green-600">{String(change.new)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(log.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {log.user?.name || log.user?.email}
                    </span>
                    {log.user?.role && (
                      <Badge variant="outline" className="text-xs">{log.user.role}</Badge>
                    )}
                    {log.ipAddress && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {log.ipAddress}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

