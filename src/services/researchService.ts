import axios from 'axios';

export interface MarketData {
  marketCap: number[];
  volume: number[];
  dominance: { [key: string]: number };
  timestamps: string[];
  technicalIndicators: {
    rsi: number[];
    macd: { line: number[]; signal: number[]; histogram: number[] };
  };
}

export interface OnChainData {
  networkHealth: {
    hashRate: number[];
    activeAddresses: number[];
    timestamps: string[];
  };
  tokenMetrics: {
    distribution: { label: string; value: number }[];
    holderGroups: { label: string; value: number }[];
  };
  defiMetrics: {
    tvl: number[];
    protocols: { name: string; tvl: number; apy: number }[];
  };
}

export interface SentimentData {
  socialMetrics: {
    sentiment: number[];
    volume: number[];
    timestamps: string[];
  };
  developerActivity: {
    commits: number[];
    contributors: number[];
    timestamps: string[];
  };
}

export interface MacroData {
  economicIndicators: {
    inflation: number[];
    interest: number[];
    timestamps: string[];
  };
  correlations: {
    asset: string;
    correlation: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

class ResearchService {
  private generateTimestamps(count: number): string[] {
    const timestamps: string[] = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      timestamps.push(date.toISOString().split('T')[0]);
    }
    return timestamps;
  }

  async getMarketData(): Promise<MarketData> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timestamps = this.generateTimestamps(30);
    return {
      marketCap: Array.from({ length: 30 }, () => Math.random() * 1000000000000 + 500000000000),
      volume: Array.from({ length: 30 }, () => Math.random() * 50000000000 + 10000000000),
      dominance: {
        BTC: 45 + Math.random() * 5,
        ETH: 20 + Math.random() * 3,
        Others: 35 + Math.random() * 2,
      },
      timestamps,
      technicalIndicators: {
        rsi: Array.from({ length: 30 }, () => Math.random() * 100),
        macd: {
          line: Array.from({ length: 30 }, () => Math.random() * 1000 - 500),
          signal: Array.from({ length: 30 }, () => Math.random() * 1000 - 500),
          histogram: Array.from({ length: 30 }, () => Math.random() * 200 - 100),
        },
      },
    };
  }

  async getOnChainData(): Promise<OnChainData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timestamps = this.generateTimestamps(30);
    return {
      networkHealth: {
        hashRate: Array.from({ length: 30 }, () => Math.random() * 300 + 200),
        activeAddresses: Array.from({ length: 30 }, () => Math.random() * 1000000 + 500000),
        timestamps,
      },
      tokenMetrics: {
        distribution: [
          { label: 'Exchanges', value: 15 + Math.random() * 5 },
          { label: 'Institutions', value: 25 + Math.random() * 5 },
          { label: 'Retail', value: 45 + Math.random() * 5 },
          { label: 'Others', value: 15 + Math.random() * 5 },
        ],
        holderGroups: [
          { label: 'Whales', value: 35 + Math.random() * 5 },
          { label: 'Large Holders', value: 25 + Math.random() * 5 },
          { label: 'Medium Holders', value: 20 + Math.random() * 5 },
          { label: 'Small Holders', value: 20 + Math.random() * 5 },
        ],
      },
      defiMetrics: {
        tvl: Array.from({ length: 30 }, () => Math.random() * 100000000000 + 50000000000),
        protocols: [
          { name: 'Protocol A', tvl: Math.random() * 10000000000, apy: Math.random() * 20 },
          { name: 'Protocol B', tvl: Math.random() * 8000000000, apy: Math.random() * 15 },
          { name: 'Protocol C', tvl: Math.random() * 6000000000, apy: Math.random() * 25 },
          { name: 'Protocol D', tvl: Math.random() * 4000000000, apy: Math.random() * 18 },
        ],
      },
    };
  }

  async getSentimentData(): Promise<SentimentData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timestamps = this.generateTimestamps(30);
    return {
      socialMetrics: {
        sentiment: Array.from({ length: 30 }, () => Math.random() * 100 - 50),
        volume: Array.from({ length: 30 }, () => Math.random() * 1000000 + 100000),
        timestamps,
      },
      developerActivity: {
        commits: Array.from({ length: 30 }, () => Math.random() * 1000 + 100),
        contributors: Array.from({ length: 30 }, () => Math.random() * 500 + 50),
        timestamps,
      },
    };
  }

  async getMacroData(): Promise<MacroData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timestamps = this.generateTimestamps(30);
    return {
      economicIndicators: {
        inflation: Array.from({ length: 30 }, () => Math.random() * 10 + 1),
        interest: Array.from({ length: 30 }, () => Math.random() * 5 + 1),
        timestamps,
      },
      correlations: [
        { asset: 'S&P 500', correlation: Math.random() * 2 - 1, trend: 'up' },
        { asset: 'Gold', correlation: Math.random() * 2 - 1, trend: 'down' },
        { asset: 'USD Index', correlation: Math.random() * 2 - 1, trend: 'stable' },
        { asset: 'Tech Stocks', correlation: Math.random() * 2 - 1, trend: 'up' },
      ],
    };
  }
}

export const researchService = new ResearchService();
