import React, { useState } from "react";
import BacktestParameters from "./BacktestParameters";
import BacktestResults from "./BacktestResults";
import TradeHistory from "./TradeHistory";
import BacktestChart from "./BacktestChart";
import AssetChart from "./AssetChart";
import InputParameters from "./InputParameters";
import BacktestTabs from "./BacktestTabs";
import { BacktestResult, Trade, Parameter } from "../../types/backtest";

interface BacktestDashboardProps {
  colorMode: "light" | "dark";
}

const BacktestDashboard: React.FC<BacktestDashboardProps> = ({ colorMode }) => {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(["BTCUSDT"]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);

  const handleAssetChange = (assets: string[]) => {
    setSelectedAssets(assets);
  };

  const handleRunBacktest = async (parameterSets: Parameter[][]) => {
    setIsBacktesting(true);
    try {
      const results = await Promise.all(
        selectedAssets.flatMap((asset) =>
          parameterSets.map(async (parameters) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            return {
              trades: generateMockTrades(asset),
              metrics: {
                totalReturn: 45.32 + (Math.random() * 20 - 10),
                sharpeRatio: 1.8 + (Math.random() * 0.4 - 0.2),
                maxDrawdown: -15.4 + (Math.random() * 5 - 2.5),
                winRate: 62.5 + (Math.random() * 10 - 5),
                profitFactor: 2.1 + (Math.random() * 0.4 - 0.2),
                averageTrade: 125.45 + (Math.random() * 20 - 10),
                totalTrades: 248,
                profitableTrades: 155,
                lossTrades: 93,
                averageWin: 245.67 + (Math.random() * 40 - 20),
                averageLoss: -115.89 + (Math.random() * 20 - 10),
                largestWin: 1245.67,
                largestLoss: -678.9,
                averageHoldingPeriod: "2.5 days",
                commissions: 456.78,
              },
              equity: generateEquityCurve(),
              parameters,
              asset,
            };
          })
        )
      );

      setBacktestResults(results);
      setActiveResultIndex(0);
    } catch (error) {
      console.error("Backtest failed:", error);
    } finally {
      setIsBacktesting(false);
    }
  };

  const handleTradeSelect = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleTabClose = (index: number) => {
    const newResults = backtestResults.filter((_, i) => i !== index);
    setBacktestResults(newResults);
    if (activeResultIndex >= newResults.length) {
      setActiveResultIndex(Math.max(0, newResults.length - 1));
    }
  };

  return (
    <div
      className={`p-6 ${colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <InputParameters
            colorMode={colorMode}
            selectedAsset={selectedAssets[0]}
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
          {backtestResults.length > 0 && (
            <>
              {/* Results Tabs */}
              <BacktestTabs
                colorMode={colorMode}
                results={backtestResults}
                activeTab={activeResultIndex}
                onTabChange={setActiveResultIndex}
                onTabClose={handleTabClose}
              />

              <div className="grid grid-cols-3 gap-6">
                {/* Asset Chart */}
                <div
                  className={`col-span-2 rounded-lg ${
                    colorMode === "dark" ? "bg-gray-800" : "bg-white"
                  } p-6`}
                >
                  <AssetChart
                    colorMode={colorMode}
                    asset={backtestResults[activeResultIndex].asset}
                    selectedTrade={selectedTrade}
                  />
                </div>

                {/* Results Summary */}
                <div
                  className={`rounded-lg ${
                    colorMode === "dark" ? "bg-gray-800" : "bg-white"
                  } p-6`}
                >
                  <BacktestResults
                    colorMode={colorMode}
                    result={backtestResults[activeResultIndex]}
                  />
                </div>
              </div>

              {/* Equity Chart */}
              <div
                className={`rounded-lg ${
                  colorMode === "dark" ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <BacktestChart
                  colorMode={colorMode}
                  equityData={backtestResults[activeResultIndex].equity}
                  selectedTrade={selectedTrade}
                />
              </div>

              {/* Trade History */}
              <div
                className={`rounded-lg ${
                  colorMode === "dark" ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <TradeHistory
                  colorMode={colorMode}
                  trades={backtestResults[activeResultIndex].trades}
                  onTradeSelect={handleTradeSelect}
                  selectedTrade={selectedTrade}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions remain the same
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
    const commission = Math.random() * 10;

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
