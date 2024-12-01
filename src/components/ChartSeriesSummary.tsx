import React from "react";

interface ChartSeriesSummaryProps {
  colorMode: "light" | "dark";
  selectedSeries: string;
  selectedTimeGranularity: string;
  stockData: StockData[];
}

interface StockData {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const ChartSeriesSummary: React.FC<ChartSeriesSummaryProps> = ({
  colorMode,
  selectedSeries,
  selectedTimeGranularity,
  stockData,
}) => {
  const getGranularityLabel = (granularity: string) => {
    const granularityMap: { [key: string]: string } = {
      "1m": "1m",
      "5m": "5m",
      "15m": "15m",
      "30m": "30m",
      "1h": "1h",
      "1d": "1d",
      "1w": "1w",
      "1M": "1M",
    };
    return granularityMap[granularity] || granularity;
  };

  const getColorClass = (current: number, previous: number) => {
    return current >= previous
      ? colorMode === "dark"
        ? "text-green-400"
        : "text-green-600"
      : colorMode === "dark"
      ? "text-red-400"
      : "text-red-600";
  };

  const formatNumber = (num: number) => num.toFixed(2);

  const lastBar = stockData[stockData.length - 1];
  const previousBar = stockData[stockData.length - 2];

  if (!lastBar || !previousBar) {
    return null;
  }

  const priceDifference = lastBar.close - previousBar.close;
  const percentDifference = (priceDifference / previousBar.close) * 100;

  return (
    <div
      className={`flex items-center space-x-4 text-sm ${
        colorMode === "dark" ? "text-gray-300" : "text-gray-600"
      } mt-2`}
    >
      <span>{selectedSeries}</span>
      <span>&middot;</span>
      <span>{getGranularityLabel(selectedTimeGranularity)}</span>
      <span>&middot;</span>
      <span className={getColorClass(lastBar.open, previousBar.open)}>
        O {formatNumber(lastBar.open)}
      </span>
      <span className={getColorClass(lastBar.high, previousBar.high)}>
        H {formatNumber(lastBar.high)}
      </span>
      <span className={getColorClass(lastBar.low, previousBar.low)}>
        L {formatNumber(lastBar.low)}
      </span>
      <span className={getColorClass(lastBar.close, previousBar.close)}>
        C {formatNumber(lastBar.close)}
      </span>
      <span className={getColorClass(lastBar.close, previousBar.close)}>
        {priceDifference >= 0 ? "+" : ""}
        {formatNumber(priceDifference)} ({percentDifference >= 0 ? "+" : ""}
        {formatNumber(percentDifference)}%)
      </span>
    </div>
  );
};

export default ChartSeriesSummary;
