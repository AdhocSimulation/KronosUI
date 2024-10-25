import React, { useState, useEffect, useRef, useCallback } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { BarChart, CandlestickChart, LineChart } from "lucide-react";
import {
  SignalData,
  StockData,
  StrategyData,
  StrategyEvent,
  FinancialChartProps,
} from "../types/chart";
import ChartTooltip from "./ChartTooltip";
import ChartWithControls from "./ChartWithControls";
import ChartSection from "./ChartSection";
import AlertsSection from "./AlertsSection";
import { fetchStockData } from "../utils/stockData";
import { drawStrategyEvents } from "../utils/eventHelper";
import { getChartConfiguration } from "../utils/chartConfig";
import { useChart } from "../contexts/ChartContext";

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
  "PG",
  "JNJ",
  "UNH",
  "HD",
  "BAC",
];

const dummyEvents: StrategyEvent[] = [
  {
    date: new Date("2024-01-15").getTime(),
    title: "Market Holiday",
    description: "Martin Luther King Jr. Day - Markets Closed",
    type: "global",
    category: "Market Event",
  },
  {
    date: new Date("2024-02-15").getTime(),
    title: "Earnings Report",
    description: "Q4 2023 Financial Results",
    type: "stock-specific",
    stock: "AAPL",
    category: "Company Event",
  },
  {
    date: new Date("2024-03-01").getTime(),
    title: "Fed Rate Decision",
    description: "Federal Reserve announces interest rate decision",
    type: "global",
    category: "Economic Event",
  },
  {
    date: new Date("2024-03-15").getTime(),
    title: "Product Launch",
    description: "New iPhone model announcement",
    type: "stock-specific",
    stock: "AAPL",
    category: "Company Event",
  },
  {
    date: new Date("2024-03-20").getTime(),
    title: "Windows Update",
    description: "Major Windows platform update release",
    type: "stock-specific",
    stock: "MSFT",
    category: "Company Event",
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

function FinancialChart({ colorMode }: FinancialChartProps) {
  const {
    selectedStock,
    setSelectedStock,
    selectedStrategies,
    selectedSignals,
    selectedGranularity,
    selectedChartType,
    chartExtremes,
    updateChartState,
  } = useChart();

  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isIndicatorsPopupOpen, setIsIndicatorsPopupOpen] = useState(false);
  const [events, setEvents] = useState<StrategyEvent[]>([]);
  const [activeEventLines, setActiveEventLines] = useState<Set<number>>(
    new Set()
  );
  const [strategyData, setStrategyData] = useState<{
    [key: string]: StrategyData[];
  }>({});
  const [signalData, setSignalData] = useState<{ [key: string]: SignalData[] }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const extremesTimeout = useRef<NodeJS.Timeout>();

  const handleStockChange = (stock: string) => {
    updateChartState({ selectedStock: stock });
  };

  const handleTimeGranularityChange = (granularity: string) => {
    updateChartState({ selectedGranularity: granularity });
  };

  const handleChartTypeChange = (type: string) => {
    updateChartState({ selectedChartType: type });
  };

  const handleChartExtremesChange = (extremes: {
    min: number;
    max: number;
  }) => {
    updateChartState({ chartExtremes: extremes });
  };

  const forceExtremesUpdate = useCallback(() => {
    if (chartRef.current?.chart) {
      const chart = chartRef.current.chart;

      chart.xAxis[0].setExtremes(null, null, false);

      chart.xAxis[0].setExtremes(chartExtremes.min, chartExtremes.max, true, {
        trigger: "syncExtremes",
      });
    }
  }, [chartExtremes]);

  useEffect(() => {
    const loadStockData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStockData(selectedStock, selectedGranularity);
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStockData();
  }, [selectedStock, selectedGranularity]);

  useEffect(() => {
    const filteredEvents = dummyEvents.filter(
      (event) =>
        event.type === "global" ||
        (event.type === "stock-specific" && event.stock === selectedStock)
    );
    setEvents(filteredEvents);
  }, [selectedStock]);

  useEffect(() => {
    if (selectedStrategies.length > 0) {
      const newStrategyData: { [key: string]: StrategyData[] } = {};
      selectedStrategies.forEach((strategy) => {
        newStrategyData[strategy.name] = stockData.map((data) => ({
          date: data.date,
          value: Math.random() * 2 - 1,
        }));
      });
      setStrategyData(newStrategyData);
    }
  }, [selectedStrategies, stockData]);

  useEffect(() => {
    if (selectedSignals.length > 0) {
      const newSignalData: { [key: string]: SignalData[] } = {};
      selectedSignals.forEach((signal) => {
        newSignalData[signal.name] = stockData.map((data) => ({
          date: data.date,
          value: Math.random() * 2 - 1,
        }));
      });
      setSignalData(newSignalData);
    }
  }, [selectedSignals, stockData]);

  useEffect(() => {
    if (extremesTimeout.current) {
      clearTimeout(extremesTimeout.current);
    }

    extremesTimeout.current = setTimeout(() => {
      forceExtremesUpdate();
    }, 100);

    return () => {
      if (extremesTimeout.current) {
        clearTimeout(extremesTimeout.current);
      }
    };
  }, [chartExtremes, forceExtremesUpdate]);

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
        forceExtremesUpdate();
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

  if (chartConfiguration.xAxis && Array.isArray(chartConfiguration.xAxis)) {
    chartConfiguration.xAxis[0].events = {
      ...chartConfiguration.xAxis[0].events,
      afterSetExtremes: function (e: Highcharts.AxisSetExtremesEventObject) {
        if (e.trigger === "syncExtremes") return;
        if (
          e.trigger !== "zoom" &&
          e.trigger !== "navigator" &&
          e.trigger !== "mousewheel"
        ) {
          return;
        }
        if (e.min !== undefined && e.max !== undefined) {
          handleChartExtremesChange({ min: e.min, max: e.max });
        }
      },
    };
  } else if (chartConfiguration.xAxis) {
    chartConfiguration.xAxis.events = {
      ...chartConfiguration.xAxis.events,
      afterSetExtremes: function (e: Highcharts.AxisSetExtremesEventObject) {
        if (e.trigger === "syncExtremes") return;
        if (
          e.trigger !== "zoom" &&
          e.trigger !== "navigator" &&
          e.trigger !== "mousewheel"
        ) {
          return;
        }
        if (e.min !== undefined && e.max !== undefined) {
          handleChartExtremesChange({ min: e.min, max: e.max });
        }
      },
    };
  }

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
          <ChartSection colorMode={colorMode} />
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
            setSelectedTimeGranularity={handleTimeGranularityChange}
            setSelectedChartType={handleChartTypeChange}
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
