import React, { useState } from 'react';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

export interface ReportData {
  label: string;
  value: number;
  percentage?: number;
}

export interface ReportConfig {
  title: string;
  type: 'bar' | 'line' | 'pie';
  data: ReportData[];
  description?: string;
}

export interface CustomReportsProps {
  reports: ReportConfig[];
  onGenerateReport?: (reportType: string) => void;
  onExportReport?: (reportTitle: string) => void;
  disabled?: boolean;
  className?: string;
}

const SimpleBarChart: React.FC<{ data: ReportData[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="w-24 text-sm font-medium truncate">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-blue-600 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            >
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SimplePieChart: React.FC<{ data: ReportData[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[idx % colors.length] }}
              ></div>
              <span className="text-sm">{item.label}</span>
              <span className="text-sm font-semibold ml-auto">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SimpleLineChart: React.FC<{ data: ReportData[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="w-24 text-sm font-medium truncate">{item.label}</div>
          <div className="flex-1 flex items-end gap-1 h-16">
            {data.map((d, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                style={{ height: `${(d.value / maxValue) * 100}%` }}
                title={`${d.label}: ${d.value}`}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const CustomReports: React.FC<CustomReportsProps> = ({
  reports,
  onGenerateReport,
  onExportReport,
  disabled = false,
  className = '',
}) => {
  const [selectedReport, setSelectedReport] = useState<number>(0);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);

  const currentReport = reports[selectedReport];

  const renderChart = (report: ReportConfig) => {
    switch (report.type) {
      case 'bar':
        return <SimpleBarChart data={report.data} />;
      case 'pie':
        return <SimplePieChart data={report.data} />;
      case 'line':
        return <SimpleLineChart data={report.data} />;
      default:
        return null;
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return <BarChart3 size={18} />;
      case 'pie':
        return <PieChartIcon size={18} />;
      case 'line':
        return <LineChartIcon size={18} />;
      default:
        return <TrendingUp size={18} />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Report Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reports.map((report, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedReport(idx)}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedReport === idx
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {getChartIcon(report.type)}
            <span className="text-sm font-medium">{report.title}</span>
          </button>
        ))}
      </div>

      {/* Main Report Display */}
      {currentReport && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{currentReport.title}</h3>
              {currentReport.description && (
                <p className="text-sm text-gray-600 mt-1">{currentReport.description}</p>
              )}
            </div>
            <button
              onClick={() => onExportReport?.(currentReport.title)}
              disabled={disabled}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              Export
            </button>
          </div>

          {/* Chart */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            {renderChart(currentReport)}
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {currentReport.data.reduce((sum, d) => sum + d.value, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600">Average</p>
              <p className="text-2xl font-bold text-green-600">
                {(
                  currentReport.data.reduce((sum, d) => sum + d.value, 0) /
                  currentReport.data.length
                ).toFixed(0)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600">Items</p>
              <p className="text-2xl font-bold text-purple-600">
                {currentReport.data.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Reports Grid */}
      {reports.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setExpandedReport(expandedReport === idx ? null : idx)}
            >
              <div className="flex items-center gap-2 mb-3">
                {getChartIcon(report.type)}
                <h4 className="font-semibold text-sm">{report.title}</h4>
              </div>
              {expandedReport === idx && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  {renderChart(report)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomReports;

