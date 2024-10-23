import { ChartConfigOptions } from '../types/chart';

export const getChartConfiguration = ({
  colorMode,
  selectedChartType,
  selectedStock,
  stockData,
  signalData,
  selectedSignals,
  chartExtremes,
  strategyData,
  selectedStrategies
}: ChartConfigOptions): Highcharts.Options => {
  const measureSignals = selectedSignals.filter(s => s.type === 'Measure');
  const externalSignals = selectedSignals.filter(s => s.type === 'External');

  const getMainChartHeight = () => {
    if (selectedStrategies.length > 0) {
        return externalSignals.length > 0 ? 70 : 80;
    }
    return externalSignals.length > 0 ? 80 : 90;
  };

  return {
    chart: {
      backgroundColor: colorMode === 'dark' ? '#1f2937' : '#ffffff',
      height: '60%',
    },
    rangeSelector: {
      enabled: false,
    },
    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3,
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        title: {
          text: 'OHLC',
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        height: `${getMainChartHeight()}%`,
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: 'right',
          x: -3,
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        title: {
          text: 'Volume',
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        top: `${getMainChartHeight()}%`,
        height: '10%',
        offset: 0,
        lineWidth: 2,
      },
      ...(selectedStrategies.length > 0 ? [{
        labels: {
          align: 'right',
          x: -3,
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        title: {
          text: 'Strategies',
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        top: `${getMainChartHeight() + 10}%`,
        height: '10%',
        offset: 0,
        lineWidth: 2,
        min: -1,
        max: 1,
      }] : []),
      ...(externalSignals.length > 0 ? [{
        labels: {
          align: 'right',
          x: -3,
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        title: {
          text: 'External Signals',
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        top: selectedStrategies.length > 0 ? `${getMainChartHeight() + 20}%` : `${getMainChartHeight() + 10}%`,
        height: '10%',
        offset: 0,
        lineWidth: 2,
        min: -1,
        max: 1,
      }] : []),
    ],
    series: [
      {
        type: selectedChartType as any,
        name: `${selectedStock} Price`,
        data: stockData.map((d) => [d.date, d.open, d.high, d.low, d.close]),
        id: 'main',
        color: '#ef4444',
        upColor: '#22c55e',
        showInLegend: true,
      },
      {
        type: 'column',
        name: 'Volume',
        data: stockData.map((d) => [d.date, d.volume]),
        yAxis: 1,
        color: colorMode === 'dark' ? 'rgba(255, 165, 0, 0.8)' : 'rgba(37, 99, 235, 0.5)',
        showInLegend: true,
      },
      ...Object.entries(strategyData || {}).map(([strategy, data], index) => ({
        type: 'line',
        name: `Strategy: ${strategy}`,
        data: data.map((d) => [d.date, d.value]),
        yAxis: 2,
        color: `hsl(${index * 60}, 70%, 50%)`,
        showInLegend: true,
        marker: {
          symbol: 'diamond'
        },
      })),
      ...measureSignals.map((signal, index) => ({
        type: 'line',
        name: `Signal (Measure): ${signal.name}`,
        data: signalData[signal.name]?.map((d) => [d.date, d.value]) || [],
        yAxis: 0,
        color: `hsl(${index * 90 + 180}, 70%, 50%)`,
        showInLegend: true,
        marker: {
          symbol: 'circle'
        },
      })),
      ...externalSignals.map((signal, index) => ({
        type: 'line',
        name: `Signal (External): ${signal.name}`,
        data: signalData[signal.name]?.map((d) => [d.date, d.value]) || [],
        yAxis: 3,
        color: `hsl(${index * 90 + 45}, 70%, 50%)`,
        showInLegend: true,
        marker: {
          symbol: 'triangle'
        },
      })),
    ],
    xAxis: {
      type: 'datetime',
      labels: {
        style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
      },
      crosshair: {
        label: {
          enabled: true,
          format: '{value:%Y-%m-%d}',
        },
        color: colorMode === 'dark' ? 'rgba(255, 150, 150, 0.7)' : 'rgba(0, 0, 0, 0.3)',
        dashStyle: 'Dash',
      },
      min: chartExtremes.min,
      max: chartExtremes.max,
    },
    tooltip: {
      split: true,
      shared: true,
      backgroundColor: colorMode === 'dark' ? '#374151' : '#ffffff',
      style: {
        color: colorMode === 'dark' ? '#e5e7eb' : '#111827',
      },
    },
    plotOptions: {
      series: {
        states: {
          inactive: {
            opacity: 1
          },
          hover: {
            lineWidth: 3
          }
        },
        dataLabels: {
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
      },
      candlestick: {
        color: '#ef4444',
        upColor: '#22c55e',
      },
    },
  };
};