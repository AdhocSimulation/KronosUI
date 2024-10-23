import React from 'react';
import { Activity, TrendingUp, BarChart2, Calendar } from 'lucide-react';

interface MetaInfoProps {
  colorMode: 'light' | 'dark';
  selectedItem: {
    type: 'portfolio' | 'strategy' | 'asset' | 'watchlist';
    name: string;
    description?: string;
    stats?: {
      totalPnl?: number;
      yearlyPnlPercent?: number;
      monthlyPnlPercent?: number;
      tradesPerDay?: number;
      tradesPerMonth?: number;
      tradesToday?: number;
      winRate?: number;
      sharpeRatio?: number;
      maxDrawdown?: number;
    };
  } | null;
}

const MetaInfo: React.FC<MetaInfoProps> = ({ colorMode, selectedItem }) => {
  if (!selectedItem) return null;

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      style: num > 100 ? 'currency' : undefined,
      currency: 'USD'
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return `${formatNumber(num)}%`;
  };

  const getTypeIcon = () => {
    switch (selectedItem.type) {
      case 'portfolio':
        return <BarChart2 className="h-5 w-5" />;
      case 'strategy':
        return <Activity className="h-5 w-5" />;
      case 'asset':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <div className={`rounded-lg ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 shadow-sm`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-lg ${
          colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {getTypeIcon()}
        </div>
        <div>
          <h3 className="font-medium">{selectedItem.name}</h3>
          <p className={`text-sm ${
            colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
          </p>
        </div>
      </div>

      {selectedItem.stats && (
        <div className="grid grid-cols-3 gap-4">
          {selectedItem.stats.totalPnl !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Total PnL</p>
              <p className={`font-medium ${
                selectedItem.stats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatNumber(selectedItem.stats.totalPnl)}
              </p>
            </div>
          )}

          {selectedItem.stats.yearlyPnlPercent !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Yearly PnL</p>
              <p className={`font-medium ${
                selectedItem.stats.yearlyPnlPercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatPercent(selectedItem.stats.yearlyPnlPercent)}
              </p>
            </div>
          )}

          {selectedItem.stats.monthlyPnlPercent !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Monthly PnL</p>
              <p className={`font-medium ${
                selectedItem.stats.monthlyPnlPercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatPercent(selectedItem.stats.monthlyPnlPercent)}
              </p>
            </div>
          )}

          {selectedItem.stats.tradesPerDay !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Trades/Day</p>
              <p className="font-medium">{formatNumber(selectedItem.stats.tradesPerDay, 1)}</p>
            </div>
          )}

          {selectedItem.stats.tradesPerMonth !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Trades/Month</p>
              <p className="font-medium">{formatNumber(selectedItem.stats.tradesPerMonth, 0)}</p>
            </div>
          )}

          {selectedItem.stats.tradesToday !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Trades Today</p>
              <p className="font-medium">{selectedItem.stats.tradesToday}</p>
            </div>
          )}

          {selectedItem.stats.winRate !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Win Rate</p>
              <p className="font-medium">{formatPercent(selectedItem.stats.winRate)}</p>
            </div>
          )}

          {selectedItem.stats.sharpeRatio !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Sharpe Ratio</p>
              <p className="font-medium">{formatNumber(selectedItem.stats.sharpeRatio, 2)}</p>
            </div>
          )}

          {selectedItem.stats.maxDrawdown !== undefined && (
            <div>
              <p className={`text-xs ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Max Drawdown</p>
              <p className="font-medium text-red-500">{formatPercent(selectedItem.stats.maxDrawdown)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MetaInfo;