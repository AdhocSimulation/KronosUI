import { apiService } from './apiService';
import { Strategy } from "../types/strategy";

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
  getStrategies: async () => {
    try {
      // In production, use this:
      // return await apiService.get<Strategy[]>('/strategies');
      
      return await apiService.mockApiCall([...strategies]);
    } catch (error) {
      console.error('Error fetching strategies:', error);
      throw new Error('Failed to fetch strategies');
    }
  },

  getStrategy: async (id: string) => {
    try {
      // In production, use this:
      // return await apiService.get<Strategy>(`/strategies/${id}`);
      
      const strategy = strategies.find((s) => s.id === id);
      return await apiService.mockApiCall(strategy);
    } catch (error) {
      console.error(`Error fetching strategy ${id}:`, error);
      throw new Error(`Failed to fetch strategy ${id}`);
    }
  },

  saveStrategy: async (strategy: Omit<Strategy, "id" | "createdAt" | "updatedAt">) => {
    try {
      // In production, use this:
      // return await apiService.post<Strategy>('/strategies', strategy);
      
      const now = new Date();
      const newStrategy: Strategy = {
        ...strategy,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now,
        updatedAt: now,
      };
      strategies.push(newStrategy);
      return await apiService.mockApiCall(newStrategy);
    } catch (error) {
      console.error('Error saving strategy:', error);
      throw new Error('Failed to save strategy');
    }
  },

  updateStrategy: async (id: string, strategy: Omit<Strategy, "id" | "createdAt" | "updatedAt">) => {
    try {
      // In production, use this:
      // return await apiService.put<Strategy>(`/strategies/${id}`, strategy);
      
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
      return await apiService.mockApiCall(updatedStrategy);
    } catch (error) {
      console.error(`Error updating strategy ${id}:`, error);
      throw new Error(`Failed to update strategy ${id}`);
    }
  },

  deleteStrategy: async (id: string) => {
    try {
      // In production, use this:
      // await apiService.delete(`/strategies/${id}`);
      
      strategies = strategies.filter((s) => s.id !== id);
      await apiService.mockApiCall(undefined);
    } catch (error) {
      console.error(`Error deleting strategy ${id}:`, error);
      throw new Error(`Failed to delete strategy ${id}`);
    }
  },
};