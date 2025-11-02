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
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        aria-label="Export data"
      >
        <Download size={18} />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
          <h3 className="text-lg font-semibold mb-4">Export Data</h3>

          {/* Format Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <div className="flex gap-2">
              {formats.map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                    selectedFormat === format
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder="Enter filename"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Data Summary */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>{data.length}</strong> rows, <strong>{columns.length}</strong> columns
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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

