import React, { useState, useEffect, useRef, useCallback } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { BarChart, CandlestickChart, LineChart } from "lucide-react";
import {
  Signal,
  SignalData,
  StockData,
  Strategy,
  StrategyData,
  StrategyEvent,
} from "../types/chart";
import ChartTooltip from "./ChartTooltip";
import ChartWithControls from "./ChartWithControls";
import ChartSection from "./ChartSection";
import AlertsSection from "./AlertsSection";
import { fetchStockData, generatePlaceholderData } from "../utils/stockData";
import { drawStrategyEvents } from "../utils/eventHelper";
import { getChartConfiguration } from "../utils/chartConfig";

const stocks = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "AMZN",
  "META",
  "NVDA",
  "TSLA",
  "JPM",
  "V",
  "WMT",
];

const dummyEvents: StrategyEvent[] = [
  {
    date: new Date("2024-01-15").getTime(),
    title: "Product Launch",
    description: "New iPhone model release",
  },
  {
    date: new Date("2024-03-01").getTime(),
    title: "Earnings Report",
    description: "Q4 2023 Financial Results",
  },
  {
    date: new Date("2024-09-20").getTime(),
    title: "Investor Meeting",
    description: "Annual Shareholder Meeting",
  },
];

const timeGranularities = [
  { value: "1min", label: "1m" },
  { value: "5min", label: "5m" },
  { value: "15min", label: "15m" },
  { value: "30min", label: "30m" },
  { value: "60min", label: "1h" },
  { value: "daily", label: "1D" },
  { value: "weekly", label: "1W" },
  { value: "monthly", label: "1M" },
];

const chartTypes = [
  { value: "candlestick", label: "Candlestick", icon: CandlestickChart },
  { value: "bar", label: "Bar", icon: BarChart },
  { value: "line", label: "Line", icon: LineChart },
];

function FinancialChart({ colorMode }: { colorMode: "light" | "dark" }) {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [isIndicatorsPopupOpen, setIsIndicatorsPopupOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState("candlestick");
  const [selectedGranularity, setSelectedGranularity] = useState("daily");
  const [events, setEvents] = useState<StrategyEvent[]>(dummyEvents);
  const [activeEventLines, setActiveEventLines] = useState<Set<number>>(
    new Set()
  );
  const [selectedStrategies, setSelectedStrategies] = useState<Strategy[]>([]);
  const [strategyData, setStrategyData] = useState<{
    [key: string]: StrategyData[];
  }>({});
  const [selectedSignals, setSelectedSignals] = useState<Signal[]>([]);
  const [signalData, setSignalData] = useState<{ [key: string]: SignalData[] }>(
    {}
  );
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    const loadStockData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStockData(selectedStock, selectedGranularity);
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        const placeholderData = generatePlaceholderData();
        setStockData(placeholderData);
      } finally {
        setIsLoading(false);
      }
    };

    loadStockData();
  }, [selectedStock, selectedGranularity]);

  useEffect(() => {
    if (selectedStrategies.length > 0) {
      generateStrategyData();
    }
  }, [selectedStrategies, stockData]);

  useEffect(() => {
    if (selectedSignals.length > 0) {
      generateSignalData();
    }
  }, [selectedSignals, stockData]);

  const generateStrategyData = () => {
    const newStrategyData: { [key: string]: StrategyData[] } = {};
    selectedStrategies.forEach((strategy) => {
      newStrategyData[strategy.name] = stockData.map((data) => ({
        date: data.date,
        value: Math.random() * 2 - 1,
      }));
    });
    setStrategyData(newStrategyData);
  };

  const generateSignalData = () => {
    const newsignalData: { [key: string]: SignalData[] } = {};
    selectedSignals.forEach((signal) => {
      newsignalData[signal.name] = stockData.map((data) => ({
        date: data.date,
        value: Math.random() * 2 - 1,
      }));
    });
    setSignalData(newsignalData);
  };

  const drawEvents = useCallback(
    (chart: Highcharts.Chart) => {
      drawStrategyEvents(
        chart,
        events,
        colorMode,
        activeEventLines,
        setActiveEventLines
      );
    },
    [events, colorMode, activeEventLines]
  );

  const getInitialRange = useCallback(() => {
    const now = Date.now();
    switch (selectedGranularity) {
      case "1min":
      case "5min":
      case "15min":
        return { min: now - 24 * 60 * 60 * 1000, max: now };
      case "30min":
      case "60min":
        return { min: now - 72 * 60 * 60 * 1000, max: now };
      case "daily":
        return { min: now - 30 * 24 * 60 * 60 * 1000, max: now };
      default:
        return { min: now - 30 * 24 * 60 * 60 * 1000, max: now };
    }
  }, [selectedGranularity]);

  const [chartExtremes, setChartExtremes] = useState(getInitialRange());

  useEffect(() => {
    const newExtremes = getInitialRange();
    setChartExtremes(newExtremes);
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.xAxis[0].setExtremes(
        newExtremes.min,
        newExtremes.max,
        true,
        false
      );
    }
  }, [selectedGranularity, getInitialRange]);

  const chartConfiguration = getChartConfiguration({
    colorMode,
    selectedChartType,
    selectedStock,
    stockData,
    signalData,
    selectedSignals,
    chartExtremes,
    strategyData,
    selectedStrategies,
  });

  if (chartConfiguration.chart) {
    chartConfiguration.chart.events = {
      load: function (this: Highcharts.Chart) {
        drawEvents(this);
      },
      redraw: function (this: Highcharts.Chart) {
        document
          .querySelectorAll(".event-tooltip")
          .forEach((el) => el.remove());
        drawEvents(this);
      },
    };
  }

  const handleStockChange = (stock: string) => {
    setSelectedStock(stock);
  };

  const handleStrategyChange = (strategies: Strategy[]) => {
    setSelectedStrategies(strategies);
  };

  const handleSignalChange = (signals: Signal[]) => {
    setSelectedSignals(signals);
  };

  return (
    <div
      className={`w-full ${
        colorMode === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="flex">
        <div className="w-1/4 p-4">
          <ChartSection
            colorMode={colorMode}
            onStrategyChange={handleStrategyChange}
            onSignalChange={handleSignalChange}
          />
          <AlertsSection colorMode={colorMode} />
        </div>

        <div className="w-3/4 p-4">
          <ChartWithControls
            colorMode={colorMode}
            stocks={stocks}
            selectedStock={selectedStock}
            timeGranularities={timeGranularities}
            selectedTimeGranularity={selectedGranularity}
            chartTypes={chartTypes}
            selectedChartType={selectedChartType}
            isIndicatorsPopupOpen={isIndicatorsPopupOpen}
            setIsIndicatorsPopupOpen={setIsIndicatorsPopupOpen}
            handleStockChange={handleStockChange}
            setSelectedTimeGranularity={setSelectedGranularity}
            setSelectedChartType={setSelectedChartType}
            chartOptions={chartConfiguration}
            chartRef={chartRef}
            stockData={stockData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default FinancialChart;
