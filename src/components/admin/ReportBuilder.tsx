'use client';

import React, { useState } from 'react';

interface ReportBuilderProps {
  onGenerateReport?: (config: ReportConfig) => void;
  onExportReport?: (config: ReportConfig, format: ExportFormat) => void;
  isLoading?: boolean;
  className?: string;
}

export interface ReportConfig {
  reportType: 'sales' | 'revenue' | 'customers' | 'products';
  startDate?: string;
  endDate?: string;
  vendor?: string;
  category?: string;
  status?: string;
  exportFormat?: ExportFormat;
}

export type ExportFormat = 'csv' | 'json' | 'pdf';

const ReportBuilder = React.forwardRef<HTMLDivElement, ReportBuilderProps>(
  ({ onGenerateReport, onExportReport, isLoading = false, className = '' }, ref) => {
    const [config, setConfig] = useState<ReportConfig>({
      reportType: 'sales',
      startDate: '',
      endDate: '',
      vendor: '',
      category: '',
      status: '',
    });

    const handleChange = (field: keyof ReportConfig, value: string) => {
      setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateReport = () => {
      onGenerateReport?.(config);
    };

    const handleExport = (format: ExportFormat) => {
      onExportReport?.({ ...config, exportFormat: format }, format);
    };

    return (
      <div ref={ref} className={`bg-white p-6 rounded-lg shadow ${className}`}>
        <h2 className="text-2xl font-bold mb-6">Report Builder</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Report Type</label>
            <select
              value={config.reportType}
              onChange={(e) => handleChange('reportType', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sales">Sales Report</option>
              <option value="revenue">Revenue Report</option>
              <option value="customers">Customers Report</option>
              <option value="products">Products Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Start Date</label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">End Date</label>
            <input
              type="date"
              value={config.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Vendor</label>
            <input
              type="text"
              placeholder="Filter by vendor"
              value={config.vendor}
              onChange={(e) => handleChange('vendor', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <input
              type="text"
              placeholder="Filter by category"
              value={config.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Status</label>
            <select
              value={config.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-primary-foreground font-semibold py-2 px-6 rounded transition"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isLoading}
            className="bg-success hover:bg-success/90 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded transition"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={isLoading}
            className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-accent-foreground font-semibold py-2 px-6 rounded transition"
          >
            Export as JSON
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isLoading}
            className="bg-error hover:bg-error/90 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded transition"
          >
            Export as PDF
          </button>
        </div>
      </div>
    );
  }
);

ReportBuilder.displayName = 'ReportBuilder';

export default ReportBuilder;

