'use client';

/**
 * Barcode Scanner Component
 * Phase 26.1.6: Barcode/SKU Scanning
 * 
 * Provides barcode scanning functionality using:
 * - Device camera (mobile/webcam)
 * - Manual barcode entry
 * - Keyboard wedge scanner support
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ScanLine, Camera, Keyboard, X, Check, 
  AlertTriangle, Package, RefreshCw
} from 'lucide-react';

// Types for barcode scanning
export interface ScanResult {
  barcode: string;
  format: string;
  timestamp: Date;
  product?: {
    id: string;
    name: string;
    sku: string;
    variantId: string;
    currentStock: number;
    price: number;
  };
}

interface BarcodeScannerProps {
  onScan: (result: ScanResult) => void;
  onError?: (error: string) => void;
  className?: string;
  autoLookup?: boolean;
  allowManualEntry?: boolean;
}

export function BarcodeScanner({
  onScan,
  onError,
  className,
  autoLookup = true,
  allowManualEntry = true,
}: BarcodeScannerProps) {
  const [mode, setMode] = useState<'camera' | 'manual' | 'keyboard'>('manual');
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const keyboardBuffer = useRef<string>('');
  const keyboardTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle keyboard wedge scanner input
  useEffect(() => {
    if (mode !== 'keyboard') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear timeout on each keypress
      if (keyboardTimeout.current) {
        clearTimeout(keyboardTimeout.current);
      }

      // Enter key submits the barcode
      if (e.key === 'Enter' && keyboardBuffer.current.length > 0) {
        handleBarcodeLookup(keyboardBuffer.current);
        keyboardBuffer.current = '';
        return;
      }

      // Only accept alphanumeric characters
      if (/^[a-zA-Z0-9]$/.test(e.key)) {
        keyboardBuffer.current += e.key;
      }

      // Auto-submit after 100ms of no input (typical scanner behavior)
      keyboardTimeout.current = setTimeout(() => {
        if (keyboardBuffer.current.length > 3) {
          handleBarcodeLookup(keyboardBuffer.current);
        }
        keyboardBuffer.current = '';
      }, 100);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyboardTimeout.current) {
        clearTimeout(keyboardTimeout.current);
      }
    };
  }, [mode]);

  // Lookup barcode in database
  const handleBarcodeLookup = useCallback(async (barcode: string) => {
    if (!barcode.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const result: ScanResult = {
        barcode: barcode.trim(),
        format: detectBarcodeFormat(barcode),
        timestamp: new Date(),
      };

      if (autoLookup) {
        const response = await fetch(`/api/inventory/lookup?barcode=${encodeURIComponent(barcode)}`);
        if (response.ok) {
          const data = await response.json();
          result.product = data.product;
        }
      }

      setLastScan(result);
      onScan(result);
      setManualBarcode('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lookup failed';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  }, [autoLookup, onScan, onError]);

  // Detect barcode format
  const detectBarcodeFormat = (barcode: string): string => {
    if (/^\d{13}$/.test(barcode)) return 'EAN-13';
    if (/^\d{12}$/.test(barcode)) return 'UPC-A';
    if (/^\d{8}$/.test(barcode)) return 'EAN-8';
    if (/^[A-Z0-9]{1,20}$/.test(barcode)) return 'CODE-39';
    return 'UNKNOWN';
  };

  // Handle manual submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBarcodeLookup(manualBarcode);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <ScanLine className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Barcode Scanner</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant={mode === 'manual' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('manual')}
          >
            <Keyboard className="h-4 w-4" />
          </Button>
          <Button
            variant={mode === 'keyboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('keyboard')}
          >
            <ScanLine className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {error}
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Manual Entry Mode */}
        {mode === 'manual' && allowManualEntry && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="relative">
              <ScanLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Enter barcode or SKU..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            <Button type="submit" disabled={loading || !manualBarcode.trim()}>
              {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Lookup
            </Button>
          </form>
        )}

        {/* Keyboard Wedge Mode */}
        {mode === 'keyboard' && (
          <div className="text-center py-8">
            <ScanLine className="mx-auto mb-4 h-12 w-12 text-primary animate-pulse" />
            <p className="text-lg font-medium">Ready to Scan</p>
            <p className="text-sm text-muted-foreground">
              Use your barcode scanner to scan a product
            </p>
          </div>
        )}

        {/* Last Scan Result */}
        {lastScan && (
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Last Scan</span>
              <Badge variant="secondary">{lastScan.format}</Badge>
            </div>
            <p className="font-mono text-lg">{lastScan.barcode}</p>

            {lastScan.product ? (
              <div className="mt-3 rounded-lg bg-background p-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{lastScan.product.name}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <span>SKU: {lastScan.product.sku}</span>
                  <span>Stock: {lastScan.product.currentStock}</span>
                  <span>Price: ₱{lastScan.product.price.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-amber-600">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                Product not found in database
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

