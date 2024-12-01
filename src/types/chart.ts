export type Callback<T, U> = (arg: T) => U;

export type SingleCallback<T> = (arg: T) => void;

export interface FinancialChartProps {
  colorMode: "light" | "dark";
}

export interface Signal {
  name: string;
  type: "Measure" | "External";
}

export interface Strategy {
  name: string;
}

export interface BarData {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StrategyData {
  value: number;
  date: number;
}

export interface SignalData {
  value: number;
  date: number;
}

export interface TimeGranularity {
  value: string;
  label: string;
}

export interface ChartType {
  value: string;
  label: string;
  icon: React.ElementType;
}

export interface StrategyEvent {
  date: number;
  title: string;
  description: string;
  type: "global" | "stock-specific";
  stock?: string;
  category?: string;
}

export interface ChartConfigOptions {
  colorMode: "light" | "dark";
  selectedChartType: string;
  selectedStock: string;
  stockData: StockData[];
  signalData: { [key: string]: SignalData[] };
  selectedSignals: Signal[];
  chartExtremes: { min: number; max: number };
  strategyData: { [key: string]: StrategyData[] };
  selectedStrategies: Strategy[];
  activeEventLines: Set<number>;
}
