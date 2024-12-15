import { apiService } from "./apiService";
import { BarData } from "../types/chart";

export interface Asset {
  symbol: string;
  name: string;
  type: "crypto" | "stock";
  basePrice: number;
}

// Mock data for assets
const mockAssets: Asset[] = [
  { symbol: "AAPL", name: "Apple Inc.", type: "stock", basePrice: 175 },
  { symbol: "GOOGL", name: "Alphabet Inc.", type: "stock", basePrice: 140 },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "stock",
    basePrice: 380,
  },
  { symbol: "AMZN", name: "Amazon.com Inc.", type: "stock", basePrice: 170 },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    type: "stock",
    basePrice: 480,
  },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", basePrice: 850 },
  { symbol: "TSLA", name: "Tesla Inc.", type: "stock", basePrice: 175 },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    type: "stock",
    basePrice: 175,
  },
  { symbol: "V", name: "Visa Inc.", type: "stock", basePrice: 275 },
  { symbol: "WMT", name: "Walmart Inc.", type: "stock", basePrice: 175 },
  { symbol: "PG", name: "Procter & Gamble Co.", type: "stock", basePrice: 155 },
  { symbol: "JNJ", name: "Johnson & Johnson", type: "stock", basePrice: 155 },
  {
    symbol: "UNH",
    name: "UnitedHealth Group Inc.",
    type: "stock",
    basePrice: 475,
  },
  { symbol: "HD", name: "The Home Depot Inc.", type: "stock", basePrice: 375 },
  {
    symbol: "BAC",
    name: "Bank of America Corp.",
    type: "stock",
    basePrice: 35,
  },
  { symbol: "BTCUSDT", name: "Bitcoin", type: "crypto", basePrice: 45000 },
  { symbol: "ETHUSDT", name: "Ethereum", type: "crypto", basePrice: 2500 },
  { symbol: "BNBUSDT", name: "Binance Coin", type: "crypto", basePrice: 300 },
  { symbol: "ADAUSDT", name: "Cardano", type: "crypto", basePrice: 0.5 },
  { symbol: "SOLUSDT", name: "Solana", type: "crypto", basePrice: 100 },
  { symbol: "DOTUSDT", name: "Polkadot", type: "crypto", basePrice: 7 },
  { symbol: "AVAXUSDT", name: "Avalanche", type: "crypto", basePrice: 35 },
  { symbol: "MATICUSDT", name: "Polygon", type: "crypto", basePrice: 0.8 },
];

export const assetService = {
  // Get all assets
  getAssets: async (): Promise<Asset[]> => {
    try {
      // In production, use this:
      // return await apiService.get<Asset[]>("/assets");
      return await apiService.mockApiCall(mockAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw new Error("Failed to fetch assets");
    }
  },

  // Get assets by type
  getAssetsByType: async (type: "crypto" | "stock"): Promise<Asset[]> => {
    try {
      // In production, use this:
      // return await apiService.get<Asset[]>(`/assets/type/${type}`);
      const filteredAssets = mockAssets.filter((asset) => asset.type === type);
      return await apiService.mockApiCall(filteredAssets);
    } catch (error) {
      console.error(`Error fetching ${type} assets:`, error);
      throw new Error(`Failed to fetch ${type} assets`);
    }
  },

  // Get asset by symbol
  getAssetBySymbol: async (symbol: string): Promise<Asset | undefined> => {
    try {
      // In production, use this:
      // return await apiService.get<Asset>(`/assets/${symbol}`);
      const asset = mockAssets.find((asset) => asset.symbol === symbol);
      return await apiService.mockApiCall(asset);
    } catch (error) {
      console.error(`Error fetching asset ${symbol}:`, error);
      throw new Error(`Failed to fetch asset ${symbol}`);
    }
  },

  // Get base price for an asset
  getBasePrice: (symbol: string): number => {
    const asset = mockAssets.find((a) => a.symbol === symbol);
    return asset?.basePrice || 100;
  },

  // Get asset time series data
  getAssetTimeSeries: async (
    symbol: string,
    granularity: string
  ): Promise<BarData[]> => {
    try {
      // In production, use this:
      /*
      const response = await apiService.get<BarData[]>(
        `assets/timeseries?symbol=${symbol}&granularity=${granularity}`
      );
      return response;
      */

      // For development, use mock data
      return await apiService.mockApiCall(generatePlaceholderData(symbol));
    } catch (error) {
      console.error("Error fetching asset time series:", error);
      throw new Error("Failed to fetch asset time series");
    }
  },
};

// Helper function to generate mock time series data
const generatePlaceholderData = (symbol: string): BarData[] => {
  const data: BarData[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  startDate.setHours(2, 0, 0);

  const basePrice = assetService.getBasePrice(symbol);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const price =
      basePrice +
      Math.sin(i / 10) * (basePrice * 0.2) +
      Math.random() * (basePrice * 0.1);
    data.push({
      date: date.getTime(),
      open: price,
      high: price + Math.random() * (basePrice * 0.05),
      low: price - Math.random() * (basePrice * 0.05),
      close: price + Math.random() * (basePrice * 0.02) - basePrice * 0.01,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }

  return data;
};
