import React, { useState } from "react";
import BacktestParameters from "./BacktestParameters";
import BacktestResults from "./BacktestResults";
import TradeHistory from "./TradeHistory";
import BacktestChart from "./BacktestChart";
import AssetChart from "./AssetChart";
import InputParameters from "./InputParameters";
import BacktestTabs from "./BacktestTabs";
import { BacktestResult, Trade, Parameter } from "../../types/backtest";
import { Strategy } from "../../types/strategy";
import { strategyService } from "../../services/strategyService";

interface BacktestDashboardProps {
  colorMode: "light" | "dark";
}

const BacktestDashboard: React.FC<BacktestDashboardProps> = ({ colorMode }) => {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(["BTCUSDT"]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );

  const handleAssetChange = (assets: string[]) => {
    setSelectedAssets(assets);
  };

  const handleRunBacktest = async (parameterSets: Parameter[][]) => {
    setIsBacktesting(true);
    try {
      const results = await Promise.all(
        selectedAssets.flatMap((asset, assetIndex) =>
          parameterSets.map(async (parameters, paramSetIndex) => {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Add strategy information and parameter set index to parameters
            const combinedParameters = [
              ...parameters,
              {
                name: "strategy",
                value: selectedStrategy?.name || "Custom Strategy",
                type: "string",
              },
              {
                name: "parameterSetIndex",
                value: paramSetIndex,
                type: "number",
              },
              ...(selectedStrategy?.expressions.map((expr, index) => ({
                name: `expression_${index + 1}`,
                value: expr.expression,
                type: "string",
              })) || []),
            ];

            // Extract key parameters
            const lookbackPeriod = parameters.find(
              (p) => p.name === "lookbackPeriod"
            )?.value as number;
            const profitTarget = parameters.find(
              (p) => p.name === "profitTarget"
            )?.value as number;
            const stopLoss = parameters.find((p) => p.name === "stopLoss")
              ?.value as number;
            const trailingStop = parameters.find(
              (p) => p.name === "trailingStop"
            )?.value as boolean;

            // Calculate metrics based on parameters
            const baseReturn = 45.32 * (lookbackPeriod / 20);
            const riskRewardRatio = profitTarget / stopLoss;
            const trailingStopMultiplier = trailingStop ? 1.2 : 1.0;

            const adjustedReturn =
              baseReturn * riskRewardRatio * trailingStopMultiplier;
            const adjustedSharpe = 1.8 * riskRewardRatio;
            const adjustedDrawdown = -15.4 * (stopLoss / profitTarget);
            const winRate =
              62.5 + (profitTarget - stopLoss) * 2 * trailingStopMultiplier;
            const profitFactor = 2.1 * riskRewardRatio * trailingStopMultiplier;

            // Generate trades based on parameters
            const trades = generateMockTrades(asset, {
              lookbackPeriod,
              profitTarget,
              stopLoss,
              trailingStop,
              winRate,
            });

            return {
              trades,
              metrics: {
                totalReturn: adjustedReturn,
                sharpeRatio: adjustedSharpe,
                maxDrawdown: adjustedDrawdown,
                winRate,
                profitFactor,
                averageTrade: 125.45 * (profitTarget / 2.5),
                totalTrades: Math.floor(248 * (20 / lookbackPeriod)),
                profitableTrades: Math.floor(155 * (profitTarget / 2.5)),
                lossTrades: Math.floor(93 * (stopLoss / 1.5)),
                averageWin: 245.67 * (profitTarget / 2.5),
                averageLoss: -115.89 * (stopLoss / 1.5),
                largestWin: 1245.67 * (profitTarget / 2.5),
                largestLoss: -678.9 * (stopLoss / 1.5),
                averageHoldingPeriod: `${(lookbackPeriod / 8).toFixed(1)} days`,
                commissions: 456.78,
              },
              equity: generateEquityCurve(adjustedReturn, lookbackPeriod),
              parameters: combinedParameters,
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

  const generateMockTrades = (
    asset: string,
    params: {
      lookbackPeriod: number;
      profitTarget: number;
      stopLoss: number;
      trailingStop: boolean;
      winRate: number;
    }
  ): Trade[] => {
    const trades: Trade[] = [];
    const startDate = new Date(2023, 0, 1);
    const numTrades = Math.floor(248 * (20 / params.lookbackPeriod));
    const winRateDecimal = params.winRate / 100;

    for (let i = 0; i < numTrades; i++) {
      const isWinningTrade = Math.random() < winRateDecimal;
      const entryDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const holdingPeriod = Math.max(1, Math.floor(params.lookbackPeriod / 8));
      const exitDate = new Date(
        entryDate.getTime() + holdingPeriod * 24 * 60 * 60 * 1000
      );

      const direction = Math.random() > 0.5 ? "long" : "short";
      const entryPrice = 100 + Math.random() * 50;

      let exitPrice;
      if (isWinningTrade) {
        exitPrice =
          direction === "long"
            ? entryPrice * (1 + params.profitTarget / 100)
            : entryPrice * (1 - params.profitTarget / 100);
      } else {
        exitPrice =
          direction === "long"
            ? entryPrice * (1 - params.stopLoss / 100)
            : entryPrice * (1 + params.stopLoss / 100);
      }

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
          (exitPrice - entryPrice) *
            quantity *
            (direction === "long" ? 1 : -1) -
          commission,
      });
    }

    return trades;
  };

  const generateEquityCurve = (totalReturn: number, lookbackPeriod: number) => {
    const data = [];
    let equity = 10000;
    const startDate = new Date(2023, 0, 1);
    const volatility = 0.02 * (20 / lookbackPeriod);
    const dailyReturn = Math.pow(1 + totalReturn / 100, 1 / 365) - 1;

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const randomWalk = (Math.random() * 2 - 1) * volatility;
      equity *= 1 + dailyReturn + randomWalk;
      data.push({
        date,
        equity,
      });
    }

    return data;
  };

  return (
    <div
      className={`p-6 ${colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="grid grid-cols-12 gap-6">
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

export default BacktestDashboard;
