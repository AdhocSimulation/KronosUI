import React, { useState } from 'react';
import BacktestParameters from './BacktestParameters';
import BacktestResults from './BacktestResults';
import TradeHistory from './TradeHistory';
import PerformanceMetrics from './PerformanceMetrics';
import BacktestChart from './BacktestChart';
import { BacktestResult, Trade, Parameter } from '../../types/backtest';

interface BacktestDashboardProps {
  colorMode: 'light' | 'dark';
}

const BacktestDashboard: React.FC<BacktestDashboardProps> = ({ colorMode }) => {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const handleRunBacktest = async (parameters: Parameter[]) => {
    setIsBacktesting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock backtest result
      const result: BacktestResult = {
        trades: generateMockTrades(),
        metrics: {
          totalReturn: 45.32,
          sharpeRatio: 1.8,
          maxDrawdown: -15.4,
          winRate: 62.5,
          profitFactor: 2.1,
          averageTrade: 125.45,
          totalTrades: 248,
          profitableTrades: 155,
          lossTrades: 93,
          averageWin: 245.67,
          averageLoss: -115.89,
          largestWin: 1245.67,
          largestLoss: -678.90,
          averageHoldingPeriod: '2.5 days',
          commissions: 456.78,
        },
        equity: generateEquityCurve(),
        parameters
      };
      
      setBacktestResult(result);
    } catch (error) {
      console.error('Backtest failed:', error);
    } finally {
      setIsBacktesting(false);
    }
  };

  const handleTradeSelect = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  return (
    <div className={`p-6 ${colorMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="grid grid-cols-12 gap-6">
        {/* Parameters Section */}
        <div className="col-span-3">
          <BacktestParameters
            colorMode={colorMode}
            onRunBacktest={handleRunBacktest}
            isBacktesting={isBacktesting}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">
          {/* Chart Section */}
          <div className={`rounded-lg ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <BacktestChart
              colorMode={colorMode}
              equityData={backtestResult?.equity || []}
              selectedTrade={selectedTrade}
            />
          </div>

          {/* Metrics Section */}
          {backtestResult && (
            <div className={`rounded-lg ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
              <PerformanceMetrics
                colorMode={colorMode}
                metrics={backtestResult.metrics}
              />
            </div>
          )}

          {/* Results and Trade History */}
          {backtestResult && (
            <div className="grid grid-cols-2 gap-6">
              <div className={`rounded-lg ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <BacktestResults
                  colorMode={colorMode}
                  result={backtestResult}
                />
              </div>
              <div className={`rounded-lg ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <TradeHistory
                  colorMode={colorMode}
                  trades={backtestResult.trades}
                  onTradeSelect={handleTradeSelect}
                  selectedTrade={selectedTrade}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for mock data
const generateMockTrades = (): Trade[] => {
  const trades: Trade[] = [];
  const startDate = new Date(2023, 0, 1);
  
  for (let i = 0; i < 100; i++) {
    const entryDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const exitDate = new Date(entryDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000);
    const direction = Math.random() > 0.5 ? 'long' : 'short';
    const entryPrice = 100 + Math.random() * 50;
    const exitPrice = entryPrice * (1 + (Math.random() * 0.2 - 0.1));
    const quantity = Math.round(Math.random() * 100);
    
    trades.push({
      id: `trade-${i}`,
      symbol: 'AAPL',
      direction,
      entryDate,
      exitDate,
      entryPrice,
      exitPrice,
      quantity,
      pnl: (exitPrice - entryPrice) * quantity * (direction === 'long' ? 1 : -1),
      commission: Math.random() * 10,
    });
  }
  
  return trades;
};

const generateEquityCurve = () => {
  const data = [];
  let equity = 10000;
  const startDate = new Date(2023, 0, 1);
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    equity *= (1 + (Math.random() * 0.02 - 0.01));
    data.push({
      date,
      equity,
    });
  }
  
  return data;
};

export default BacktestDashboard;