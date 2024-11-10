import { BacktestRequest, BacktestResponse, BacktestResult, Trade, EquityPoint } from "../types/backtest";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Realistic base metrics for different strategies
const STRATEGY_BASE_METRICS = {
  "Moving Average Crossover": {
    baseReturn: 32.5,
    baseSharpe: 1.6,
    baseDrawdown: -12.4,
    baseWinRate: 58.5,
    baseProfitFactor: 1.8,
  },
  "RSI Divergence": {
    baseReturn: 41.2,
    baseSharpe: 1.9,
    baseDrawdown: -15.8,
    baseWinRate: 62.3,
    baseProfitFactor: 2.1,
  },
  "MACD Histogram": {
    baseReturn: 38.7,
    baseSharpe: 1.7,
    baseDrawdown: -14.2,
    baseWinRate: 60.8,
    baseProfitFactor: 1.95,
  },
  "Custom Strategy": {
    baseReturn: 35.0,
    baseSharpe: 1.5,
    baseDrawdown: -18.0,
    baseWinRate: 55.0,
    baseProfitFactor: 1.7,
  }
};

export const backtestService = {
  async runBacktest(request: BacktestRequest): Promise<BacktestResponse> {
    try {
      await delay(2000);

      const results: BacktestResult[] = request.input.assets.flatMap((asset) =>
        request.parameters.map((params, paramSetIndex) => {
          const strategyName = request.input.strategy?.name || "Custom Strategy";
          const baseMetrics = STRATEGY_BASE_METRICS[strategyName as keyof typeof STRATEGY_BASE_METRICS] 
            || STRATEGY_BASE_METRICS["Custom Strategy"];

          // Parameter impact calculations
          const riskRewardRatio = params.profitTarget / params.stopLoss;
          const trailingStopMultiplier = params.trailingStop ? 1.2 : 1.0;
          const lookbackImpact = Math.pow(params.lookbackPeriod / 20, 0.5);

          // Calculate adjusted metrics based on parameters
          const totalReturn = baseMetrics.baseReturn * riskRewardRatio * trailingStopMultiplier * lookbackImpact;
          const sharpeRatio = baseMetrics.baseSharpe * riskRewardRatio * lookbackImpact;
          const maxDrawdown = baseMetrics.baseDrawdown * (params.stopLoss / 2.5);
          const winRate = baseMetrics.baseWinRate + (riskRewardRatio - 1.5) * 5 * trailingStopMultiplier;
          const profitFactor = baseMetrics.baseProfitFactor * riskRewardRatio * trailingStopMultiplier;

          // Calculate derived metrics
          const avgWin = params.profitTarget * 100;
          const avgLoss = -params.stopLoss * 100;
          const numTrades = Math.floor(250 * (20 / params.lookbackPeriod));
          const winningTrades = Math.floor(numTrades * (winRate / 100));
          const losingTrades = numTrades - winningTrades;

          // Store parameter set index for color synchronization
          const parameters = [
            {
              name: "parameterSetIndex",
              value: paramSetIndex,
              type: "number" as const,
            },
            {
              name: "strategy",
              value: strategyName,
              type: "string" as const,
            },
            ...(request.input.strategy?.expressions.map((expr, index) => ({
              name: `expression_${index + 1}`,
              value: expr.expression,
              type: "string" as const,
            })) || []),
          ];

          return {
            trades: generateMockTrades(asset, params, winRate),
            metrics: {
              totalReturn,
              sharpeRatio,
              maxDrawdown,
              winRate,
              profitFactor,
              averageTrade: (avgWin * winningTrades + avgLoss * losingTrades) / numTrades,
              totalTrades: numTrades,
              profitableTrades: winningTrades,
              lossTrades: losingTrades,
              averageWin: avgWin,
              averageLoss: avgLoss,
              largestWin: avgWin * 2.5,
              largestLoss: avgLoss * 1.8,
              averageHoldingPeriod: `${(params.lookbackPeriod / 8).toFixed(1)} days`,
              commissions: numTrades * 2.5, // Assuming $2.50 commission per trade
            },
            equity: generateEquityCurve(totalReturn, params.lookbackPeriod),
            parameters,
            asset,
          };
        })
      );

      return { results };
    } catch (error) {
      return {
        results: [],
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
};

function generateMockTrades(
  asset: string,
  params: {
    lookbackPeriod: number;
    profitTarget: number;
    stopLoss: number;
    trailingStop: boolean;
  },
  winRate: number
): Trade[] {
  const trades: Trade[] = [];
  const startDate = new Date(2023, 0, 1);
  const numTrades = Math.floor(250 * (20 / params.lookbackPeriod));
  const winRateDecimal = winRate / 100;

  for (let i = 0; i < numTrades; i++) {
    const isWinningTrade = Math.random() < winRateDecimal;
    const entryDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const holdingPeriod = Math.max(1, Math.floor(params.lookbackPeriod / 8));
    const exitDate = new Date(entryDate.getTime() + holdingPeriod * 24 * 60 * 60 * 1000);

    const direction = Math.random() > 0.5 ? "long" : "short";
    const entryPrice = 100 + Math.random() * 50;
    const exitPrice = isWinningTrade
      ? direction === "long"
        ? entryPrice * (1 + params.profitTarget / 100)
        : entryPrice * (1 - params.profitTarget / 100)
      : direction === "long"
      ? entryPrice * (1 - params.stopLoss / 100)
      : entryPrice * (1 + params.stopLoss / 100);

    const quantity = Math.round(Math.random() * 100);
    const commission = 2.5; // Fixed commission per trade

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
      pnl: (exitPrice - entryPrice) * quantity * (direction === "long" ? 1 : -1) - commission,
    });
  }

  return trades;
}

function generateEquityCurve(totalReturn: number, lookbackPeriod: number): EquityPoint[] {
  const data: EquityPoint[] = [];
  let equity = 10000;
  const startDate = new Date(2023, 0, 1);
  const volatility = 0.02 * (20 / lookbackPeriod);
  const dailyReturn = Math.pow(1 + totalReturn / 100, 1 / 365) - 1;

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const randomWalk = (Math.random() * 2 - 1) * volatility;
    equity *= 1 + dailyReturn + randomWalk;
    data.push({ date, equity });
  }

  return data;
}