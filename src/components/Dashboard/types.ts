export interface AssetMetrics {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  tags: string[];
  indicators: {
    crossMA: number;
    betaTrend: number;
    betaVol: number;
    ornsteinUhlenbeck: number;
    residualPCA: number;
    zScore1Y: number;
  };
}
