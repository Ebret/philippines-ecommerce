import React, { useState } from 'react';
import { Download, FileText, File } from 'lucide-react';

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

export interface ExportFunctionalityProps {
  data: Record<string, any>[];
  columns: ExportColumn[];
  filename?: string;
  formats?: ('csv' | 'pdf')[];
  onExport?: (format: 'csv' | 'pdf', filename: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ExportFunctionality: React.FC<ExportFunctionalityProps> = ({
  data,
  columns,
  filename = 'export',
  formats = ['csv', 'pdf'],
  onExport,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf'>('csv');
  const [customFilename, setCustomFilename] = useState(filename);
  const [isExporting, setIsExporting] = useState(false);

  const generateCSV = (): string => {
    const headers = columns.map((col) => `"${col.label}"`).join(',');
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key];
          const formatted = col.format ? col.format(value) : value;
          return `"${String(formatted).replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const generatePDF = (): string => {
    // Simplified PDF generation - in production, use a library like jsPDF
    const headers = columns.map((col) => col.label).join(' | ');
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key];
          return col.format ? col.format(value) : value;
        })
        .join(' | ')
    );
    return [headers, ...rows].join('\n');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let content = '';
      let mimeType = '';
      let extension = '';

      if (selectedFormat === 'csv') {
        content = generateCSV();
        mimeType = 'text/csv;charset=utf-8;';
        extension = '.csv';
      } else {
        content = generatePDF();
        mimeType = 'application/pdf;charset=utf-8;';
        extension = '.pdf';
      }

      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${customFilename}${extension}`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onExport?.(selectedFormat, `${customFilename}${extension}`);
      setIsOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || data.length === 0}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Export data"
      >
        <Download size={18} />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card text-card-foreground rounded-lg shadow-lg border border-border z-50 p-4">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Export Data</h3>

          {/* Format Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Format
            </label>
            <div className="flex gap-2">
              {formats.map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                    selectedFormat === format
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-foreground hover:border-primary/50'
                  }`}
                >
                  {format === 'csv' ? (
                    <FileText size={16} className="mx-auto mb-1" />
                  ) : (
                    <File size={16} className="mx-auto mb-1" />
                  )}
                  <span className="text-xs font-medium">{format.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filename Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Filename
            </label>
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder="Enter filename"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Data Summary */}
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{data.length}</strong> rows, <strong className="text-foreground">{columns.length}</strong> columns
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors font-medium"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportFunctionality;

