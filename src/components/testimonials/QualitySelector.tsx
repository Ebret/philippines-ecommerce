/**
 * QualitySelector Component
 * Video quality selection dropdown
 */

'use client';

import { useState } from 'react';

interface QualitySelectorProps {
  availableQualities: ('360p' | '720p' | '1080p')[];
  selectedQuality: string;
  onQualityChange: (quality: string) => void;
  disabled?: boolean;
}

export function QualitySelector({
  availableQualities,
  selectedQuality,
  onQualityChange,
  disabled = false,
}: QualitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getQualityLabel = (quality: string) => {
    const labels: Record<string, string> = {
      '360p': '360p (Low)',
      '720p': '720p (HD)',
      '1080p': '1080p (Full HD)',
    };
    return labels[quality] || quality;
  };

  const getQualityDescription = (quality: string) => {
    const descriptions: Record<string, string> = {
      '360p': 'Best for slow connections',
      '720p': 'Recommended for most devices',
      '1080p': 'Best quality (requires fast connection)',
    };
    return descriptions[quality] || '';
  };

  return (
    <div className="relative inline-block w-full max-w-xs">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-2 bg-card border border-border rounded-lg text-left flex items-center justify-between text-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-medium">{getQualityLabel(selectedQuality)}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
          {availableQualities.map((quality) => (
            <button
              key={quality}
              onClick={() => {
                onQualityChange(quality);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 ${
                selectedQuality === quality ? 'bg-primary/10 border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{getQualityLabel(quality)}</p>
                  <p className="text-xs text-muted-foreground">{getQualityDescription(quality)}</p>
                </div>
                {selectedQuality === quality && (
                  <span className="text-primary font-bold">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Info Text */}
      <p className="mt-2 text-xs text-muted-foreground">
        Current: {getQualityDescription(selectedQuality)}
      </p>
    </div>
  );
}

