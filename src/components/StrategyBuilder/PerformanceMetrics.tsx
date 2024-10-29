import React from 'react';
import { PerformanceMetrics as Metrics } from '../../types/backtest';
import {
  TrendingUp,
  BarChart2,
  ArrowDownRight,
  Target,
  Clock,
  DollarSign,
} from 'lucide-react';

interface PerformanceMetricsProps {
  colorMode: 'light' | 'dark';
  metrics: Metrics;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ colorMode, metrics }) => {
  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return `${formatNumber(num)}%`;
  };

  const metricGroups = [
    {
      title: 'Returns & Risk',
      icon: TrendingUp,
      metrics: [
        { label: 'Total Return', value: formatPercent(metrics.totalReturn) },
        { label: 'Sharpe Ratio', value: formatNumber(metrics.sharpeRatio) },
        { label: 'Max Drawdown', value: formatPercent(metrics.maxDrawdown) },
      ],
    },
    {
      title: 'Trade Statistics',
      icon: BarChart2,
      metrics: [
        { label: 'Win Rate', value: formatPercent(metrics.winRate) },
        { label: 'Profit Factor', value: formatNumber(metrics.profitFactor) },
        { label: 'Total Trades', value: metrics.totalTrades },
      ],
    },
    {
      title: 'Trade Performance',
      icon: Target,
      metrics: [
        { label: 'Average Trade', value: formatCurrency(metrics.averageTrade) },
        { label: 'Largest Win', value: formatCurrency(metrics.largestWin) },
        { label: 'Largest Loss', value: formatCurrency(metrics.largestLoss) },
      ],
    },
    {
      title: 'Trade Analysis',
      icon: Clock,
      metrics: [
        { label: 'Avg Holding Period', value: metrics.averageHoldingPeriod },
        { label: 'Profitable Trades', value: metrics.profitableTrades },
        { label: 'Loss Trades', value: metrics.lossTrades },
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricGroups.map((group, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2 mb-3">
              <group.icon className="w-5 h-5" />
              <h3 className="font-semibold">{group.title}</h3>
            </div>
            <div className="space-y-2">
              {group.metrics.map((metric, mIndex) => (
                <div key={mIndex} className="flex justify-between items-center">
                  <span className="text-sm opacity-75">{metric.label}</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;