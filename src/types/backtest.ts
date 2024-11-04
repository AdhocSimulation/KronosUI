export interface Trade {
  id: string;
  symbol: string;
  direction: "long" | "short";
  entryDate: Date;
  exitDate: Date;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  commission: number;
  pnl: number;
}

export interface EquityPoint {
  date: Date;
  equity: number;
}

export interface Parameter {
  name: string;
  value: number | string | boolean;
  type: "number" | "string" | "boolean";
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export interface PerformanceMetrics {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageTrade: number;
  totalTrades: number;
  profitableTrades: number;
  lossTrades: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  averageHoldingPeriod: string;
  commissions: number;
}

export interface BacktestResult {
  trades: Trade[];
  metrics: PerformanceMetrics;
  equity: EquityPoint[];
  parameters: Parameter[];
  asset: string;
}
