import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Signal, Strategy } from "../types/chart";

interface ChartState {
  selectedStock: string;
  selectedStrategies: Strategy[];
  selectedSignals: Signal[];
  selectedGranularity: string;
  selectedChartType: string;
  chartExtremes: {
    min: number;
    max: number;
  };
}

interface ChartContextType {
  selectedStock: string;
  setSelectedStock: (stock: string) => void;
  selectedStrategies: Strategy[];
  selectedSignals: Signal[];
  selectedGranularity: string;
  selectedChartType: string;
  chartExtremes: {
    min: number;
    max: number;
  };
  toggleStrategy: (strategy: Strategy) => void;
  toggleSignal: (signal: Signal) => void;
  updateChartState: (state: Partial<ChartState>) => void;
}

const defaultChartState: ChartState = {
  selectedStock: "AAPL",
  selectedStrategies: [],
  selectedSignals: [],
  selectedGranularity: "daily",
  selectedChartType: "candlestick",
  chartExtremes: {
    min: Date.now() - 30 * 24 * 60 * 60 * 1000,
    max: Date.now(),
  },
};

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedStock, setSelectedStock] = useState<string>(
    defaultChartState.selectedStock
  );
  const [selectedStrategies, setSelectedStrategies] = useState<Strategy[]>(
    defaultChartState.selectedStrategies
  );
  const [selectedSignals, setSelectedSignals] = useState<Signal[]>(
    defaultChartState.selectedSignals
  );
  const [selectedGranularity, setSelectedGranularity] = useState(
    defaultChartState.selectedGranularity
  );
  const [selectedChartType, setSelectedChartType] = useState(
    defaultChartState.selectedChartType
  );
  const [chartExtremes, setChartExtremes] = useState(
    defaultChartState.chartExtremes
  );

  const toggleStrategy = useCallback((strategy: Strategy) => {
    setSelectedStrategies((prev) =>
      prev.some((s) => s.name === strategy.name)
        ? prev.filter((s) => s.name !== strategy.name)
        : [...prev, strategy]
    );
  }, []);

  const toggleSignal = useCallback((signal: Signal) => {
    setSelectedSignals((prev) =>
      prev.some((s) => s.name === signal.name)
        ? prev.filter((s) => s.name !== signal.name)
        : [...prev, signal]
    );
  }, []);

  const updateChartState = useCallback((state: Partial<ChartState>) => {
    console.trace();
    if (state.selectedStock !== undefined)
      setSelectedStock(state.selectedStock);
    if (state.selectedStrategies !== undefined)
      setSelectedStrategies(state.selectedStrategies);
    if (state.selectedSignals !== undefined)
      setSelectedSignals(state.selectedSignals);
    if (state.selectedGranularity !== undefined)
      setSelectedGranularity(state.selectedGranularity);
    if (state.selectedChartType !== undefined)
      setSelectedChartType(state.selectedChartType);
    if (state.chartExtremes !== undefined)
      setChartExtremes(state.chartExtremes);
  }, []);

  return (
    <ChartContext.Provider
      value={{
        selectedStock,
        setSelectedStock,
        selectedStrategies,
        selectedSignals,
        selectedGranularity,
        selectedChartType,
        chartExtremes,
        toggleStrategy,
        toggleSignal,
        updateChartState,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export const useChart = () => {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error("useChart must be used within a ChartProvider");
  }
  return context;
};
