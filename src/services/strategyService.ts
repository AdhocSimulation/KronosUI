import { Strategy, StrategyExpression } from "../types/strategy";

// In-memory storage for strategies
let strategies: Strategy[] = [
  {
    id: "1",
    name: "Simple Moving Average Crossover",
    description: "Basic SMA crossover strategy using 7 and 25 periods",
    expressions: [
      {
        id: "1",
        expression: "Close[1m].Sma[7] - Close[1m].Sma[25]",
        weight: 1.0,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "RSI with Trend",
    description: "RSI strategy combined with trend following",
    expressions: [
      {
        id: "1",
        expression: "Close[1h].Rsi[14]",
        weight: 0.7,
      },
      {
        id: "2",
        expression: "Close[1h].Ema[50] - Close[1h].Ema[200]",
        weight: 0.3,
      },
    ],
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

export const strategyService = {
  getStrategies: () => {
    return [...strategies];
  },

  getStrategy: (id: string) => {
    return strategies.find((s) => s.id === id);
  },

  saveStrategy: (
    strategy: Omit<Strategy, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date();
    const newStrategy: Strategy = {
      ...strategy,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    strategies.push(newStrategy);
    return newStrategy;
  },

  updateStrategy: (
    id: string,
    strategy: Omit<Strategy, "id" | "createdAt" | "updatedAt">
  ) => {
    const index = strategies.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("Strategy not found");
    }

    const updatedStrategy: Strategy = {
      ...strategy,
      id,
      createdAt: strategies[index].createdAt,
      updatedAt: new Date(),
    };

    strategies[index] = updatedStrategy;
    return updatedStrategy;
  },

  deleteStrategy: (id: string) => {
    strategies = strategies.filter((s) => s.id !== id);
  },
};
