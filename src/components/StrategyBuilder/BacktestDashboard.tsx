import React, { useState } from "react";
import BacktestParameters from "./BacktestParameters";
import BacktestResults from "./BacktestResults";
import TradeHistory from "./TradeHistory";
import BacktestChart from "./BacktestChart";
import AssetChart from "./AssetChart";
import InputParameters from "./InputParameters";
import BacktestTabs from "./BacktestTabs";
import { BacktestParameters as BacktestParams, BacktestResult, Trade } from "../../types/backtest";
import { Strategy } from "../../types/strategy";
import { backtestService } from "../../services/backtestService";

interface BacktestDashboardProps {
  colorMode: "light" | "dark";
}

const BacktestDashboard: React.FC<BacktestDashboardProps> = ({ colorMode }) => {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(["BTCUSDT"]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const handleAssetChange = (assets: string[]) => {
    setSelectedAssets(assets);
  };

  const handleStrategyChange = (strategy: Strategy | null) => {
    setSelectedStrategy(strategy);
  };

  const handleRunBacktest = async (parameters: BacktestParams[]) => {
    setIsBacktesting(true);
    try {
      const response = await backtestService.runBacktest({
        input: {
          assets: selectedAssets,
          strategy: selectedStrategy,
          timeframe: "1h"
        },
        parameters
      });

      if (response.error) {
        console.error(response.error);
        return;
      }

      setBacktestResults(response.results);
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
    <div className={`p-6 ${colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <InputParameters
            colorMode={colorMode}
            selectedAssets={selectedAssets}
            onAssetChange={handleAssetChange}
            selectedStrategy={selectedStrategy}
            onStrategyChange={handleStrategyChange}
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
              <BacktestTabs
                colorMode={colorMode}
                results={backtestResults}
                activeTab={activeResultIndex}
                onTabChange={setActiveResultIndex}
                onTabClose={handleTabClose}
              />

              <div className="grid grid-cols-3 gap-6">
                <div className={`col-span-2 rounded-lg ${
                  colorMode === "dark" ? "bg-gray-800" : "bg-white"
                } p-6`}>
                  <AssetChart
                    colorMode={colorMode}
                    asset={backtestResults[activeResultIndex].asset}
                    selectedTrade={selectedTrade}
                  />
                </div>

                <div className={`rounded-lg ${
                  colorMode === "dark" ? "bg-gray-800" : "bg-white"
                } p-6`}>
                  <BacktestResults
                    colorMode={colorMode}
                    result={backtestResults[activeResultIndex]}
                  />
                </div>
              </div>

              <div className={`rounded-lg ${
                colorMode === "dark" ? "bg-gray-800" : "bg-white"
              } p-6`}>
                <BacktestChart
                  colorMode={colorMode}
                  equityData={backtestResults[activeResultIndex].equity}
                  selectedTrade={selectedTrade}
                />
              </div>

              <div className={`rounded-lg ${
                colorMode === "dark" ? "bg-gray-800" : "bg-white"
              } p-6`}>
                <TradeHistory
                  colorMode={colorMode}
                  trades={backtestResults[activeResultIndex].trades}
                  onTradeSelect={handleTradeSelect}
                  selectedTrade={selectedTrade}
                />
              </div>
            </>
          )}

          {/* Empty State */}
          {backtestResults.length === 0 && !isBacktesting && (
            <div className={`rounded-lg ${
              colorMode === "dark" ? "bg-gray-800" : "bg-white"
            } p-12 text-center`}>
              <h3 className="text-xl font-semibold mb-2">No Backtest Results</h3>
              <p className={`text-sm ${
                colorMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Configure your strategy parameters and run a backtest to see results
              </p>
            </div>
          )}

          {/* Loading State */}
          {isBacktesting && (
            <div className={`rounded-lg ${
              colorMode === "dark" ? "bg-gray-800" : "bg-white"
            } p-12 text-center`}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Running Backtest</h3>
              <p className={`text-sm ${
                colorMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                This may take a few moments...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestDashboard;