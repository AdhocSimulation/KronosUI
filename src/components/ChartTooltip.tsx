import React from 'react';

interface ChartTooltipProps {
  colorMode: 'light' | 'dark';
  point: Highcharts.Point;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ colorMode, point }) => {
  if (!point || !point.series || !point.series.options.data) {
    return null;
  }

  const stockData = point.series.options.data[point.index] as number[];
  const volume = point.series.chart.series[1]?.options.data?.[point.index]?.[1] as number;

  if (!stockData || stockData.length < 5) {
    return null;
  }

  const formatNumber = (num: number) => num.toFixed(2);
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString();
  const formatVolume = (vol: number) => vol.toLocaleString();

  return (
    <div
      className={`p-2 ${
        colorMode === 'dark'
          ? 'bg-gray-800 text-white'
          : 'bg-white text-gray-800'
      }`}
    >
      <div className="font-bold">{formatDate(stockData[0])}</div>
      <div>Open: ${formatNumber(stockData[1])}</div>
      <div>High: ${formatNumber(stockData[2])}</div>
      <div>Low: ${formatNumber(stockData[3])}</div>
      <div>Close: ${formatNumber(stockData[4])}</div>
      {volume !== undefined && <div>Volume: {formatVolume(volume)}</div>}
    </div>
  );
};

export default ChartTooltip;