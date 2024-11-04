import React, { useState } from "react";
import BacktestParameters from "./BacktestParameters";
import BacktestResults from "./BacktestResults";
import TradeHistory from "./TradeHistory";
import BacktestChart from "./BacktestChart";
import AssetChart from "./AssetChart";
import InputParameters from "./InputParameters";
import { BacktestResult, Trade, Parameter } from "../../types/backtest";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BacktestDashboardProps {
  colorMode: "light" | "dark";
}

const BacktestDashboard: React.FC<BacktestDashboardProps> = ({ colorMode }) => {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(
    null
  );
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isTradeHistoryCollapsed, setIsTradeHistoryCollapsed] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("BTCUSDT");

  const handleRunBacktest = async (parameters: Parameter[]) => {
    setIsBacktesting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock backtest result
      const result: BacktestResult = {
        trades: generateMockTrades(selectedAsset),
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
          largestLoss: -678.9,
          averageHoldingPeriod: "2.5 days",
          commissions: 456.78,
        },
        equity: generateEquityCurve(),
        parameters,
        asset: selectedAsset,
      };

      setBacktestResult(result);
    } catch (error) {
      console.error("Backtest failed:", error);
    } finally {
      setIsBacktesting(false);
    }
  };

  const handleTradeSelect = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    setBacktestResult(null);
    setSelectedTrade(null);
  };

  return (
    <div
      className={`p-6 ${colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-3 space-y-6">
          <InputParameters
            colorMode={colorMode}
            selectedAsset={selectedAsset}
            onAssetChange={handleAssetChange}
          />
          <BacktestParameters
            colorMode={colorMode}
            onRunBacktest={handleRunBacktest}
            isBacktesting={isBacktesting}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">
          {/* Asset Chart */}
          <div
            className={`rounded-lg ${
              colorMode === "dark" ? "bg-gray-800" : "bg-white"
            } p-6`}
          >
            <h2 className="text-xl font-bold mb-4">Asset Price Chart</h2>
            <AssetChart
              colorMode={colorMode}
              asset={selectedAsset}
              selectedTrade={selectedTrade}
            />
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Equity Chart */}
            <div
              className={`col-span-8 rounded-lg ${
                colorMode === "dark" ? "bg-gray-800" : "bg-white"
              } p-6`}
            >
              <h2 className="text-xl font-bold mb-4">Equity Curve</h2>
              <BacktestChart
                colorMode={colorMode}
                equityData={backtestResult?.equity || []}
                selectedTrade={selectedTrade}
              />
            </div>

            {/* Results Section */}
            {backtestResult && (
              <div
                className={`col-span-4 rounded-lg ${
                  colorMode === "dark" ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <BacktestResults
                  colorMode={colorMode}
                  result={backtestResult}
                />
              </div>
            )}
          </div>

          {/* Trade History Section */}
          {backtestResult && (
            <div
              className={`rounded-lg ${
                colorMode === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-opacity-80"
                onClick={() =>
                  setIsTradeHistoryCollapsed(!isTradeHistoryCollapsed)
                }
              >
                <h2 className="text-xl font-bold">Trade History</h2>
                {isTradeHistoryCollapsed ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>

              {!isTradeHistoryCollapsed && (
                <div className="p-6 pt-0">
                  <TradeHistory
                    colorMode={colorMode}
                    trades={backtestResult.trades}
                    onTradeSelect={handleTradeSelect}
                    selectedTrade={selectedTrade}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for mock data
const generateMockTrades = (asset: string): Trade[] => {
  const trades: Trade[] = [];
  const startDate = new Date(2023, 0, 1);

  for (let i = 0; i < 100; i++) {
    const entryDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const exitDate = new Date(
      entryDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000
    );
    const direction = Math.random() > 0.5 ? "long" : "short";
    const entryPrice = 100 + Math.random() * 50;
    const exitPrice = entryPrice * (1 + (Math.random() * 0.2 - 0.1));
    const quantity = Math.round(Math.random() * 100);
    const commission = quantity * (entryPrice + exitPrice) * 0.001; // 0.1% commission per trade

    trades.push({
      id: `trade-${i}`,
      symbol: asset,
      direction,
      entryDate,
      exitDate,
      entryPrice,
      exitPrice,
      quantity,
      commission,
      pnl:
        (exitPrice - entryPrice) * quantity * (direction === "long" ? 1 : -1) -
        commission,
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
    equity *= 1 + (Math.random() * 0.02 - 0.01);
    data.push({
      date,
      equity,
    });
  }

  return data;
};

export default BacktestDashboard;
