export type TimeGranularity = "1m" | "5m" | "30m" | "1h";
export type PriceType = "Open" | "High" | "Low" | "Close";
export type Measure = "Sma" | "Ema" | "Rsi" | "Macd" | "BollingerBands";

export interface StrategyExpression {
  id: string;
  expression: string;
  weight: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  expressions: StrategyExpression[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpressionComponent {
  priceType: PriceType;
  granularity: TimeGranularity;
  measure: Measure;
  period: number;
}
