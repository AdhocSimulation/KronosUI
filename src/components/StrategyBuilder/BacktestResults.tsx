import React from 'react';
import { BacktestResult } from '../../types/backtest';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BacktestResultsProps {
  colorMode: 'light' | 'dark';
  result: BacktestResult;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ colorMode, result }) => {
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Backtest Summary</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${
          colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="text-sm opacity-75">Total Return</div>
          <div className="text-2xl font-bold flex items-center space-x-1">
            <span className={result.metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}>
              {formatPercent(result.metrics.totalReturn)}
            </span>
            {result.metrics.totalReturn >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${
          colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="text-sm opacity-75">Sharpe Ratio</div>
          <div className="text-2xl font-bold">
            {formatNumber(result.metrics.sharpeRatio)}
          </div>
        </div>
      </div>

      {/* Trade Statistics */}
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${
          colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <h3 className="font-semibold mb-2">Trade Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-75">Total Trades</div>
              <div className="font-medium">{result.metrics.totalTrades}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Win Rate</div>
              <div className="font-medium">{formatPercent(result.metrics.winRate)}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Profit Factor</div>
              <div className="font-medium">{formatNumber(result.metrics.profitFactor)}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Max Drawdown</div>
              <div className="font-medium text-red-500">
                {formatPercent(result.metrics.maxDrawdown)}
              </div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <h3 className="font-semibold mb-2">Trade Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-75">Average Trade</div>
              <div className="font-medium">{formatCurrency(result.metrics.averageTrade)}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Average Win</div>
              <div className="font-medium text-green-500">
                {formatCurrency(result.metrics.averageWin)}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-75">Average Loss</div>
              <div className="font-medium text-red-500">
                {formatCurrency(result.metrics.averageLoss)}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-75">Total Commissions</div>
              <div className="font-medium">{formatCurrency(result.metrics.commissions)}</div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <h3 className="font-semibold mb-2">Parameters Used</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {result.parameters.map(param => (
              <div key={param.name}>
                <span className="opacity-75">{param.name}:</span>{' '}
                <span className="font-medium">{param.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestResults;