import React, { useState, useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { BarChart, CandlestickChart, LineChart } from 'lucide-react';
import ChartTooltip from './ChartTooltip';
import ReactDOMServer from 'react-dom/server';
import ChartWithControls from './ChartWithControls';
import ChartSection from './ChartSection';
import AlertsSection from './AlertsSection';

interface FinancialChartProps {
  colorMode: 'light' | 'dark';
}

interface StockData {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Event {
  date: number;
  title: string;
  description: string;
}

interface StrategyData {
  date: number;
  value: number;
}

const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];

const dummyEvents: Event[] = [
  { date: new Date('2024-01-15').getTime(), title: 'Product Launch', description: 'New iPhone model release' },
  { date: new Date('2024-03-01').getTime(), title: 'Earnings Report', description: 'Q4 2023 Financial Results' },
  { date: new Date('2024-09-20').getTime(), title: 'Investor Meeting', description: 'Annual Shareholder Meeting' },
];

function FinancialChart({ colorMode }: FinancialChartProps) {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>(['AAPL']);
  const [isAddSeriesPopupOpen, setIsAddSeriesPopupOpen] = useState(false);
  const [isIndicatorsPopupOpen, setIsIndicatorsPopupOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState('candlestick');
  const [selectedGranularity, setSelectedGranularity] = useState('daily');
  const [events, setEvents] = useState<Event[]>(dummyEvents);
  const [activeEventLines, setActiveEventLines] = useState<Set<number>>(new Set());
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [strategyData, setStrategyData] = useState<{ [key: string]: StrategyData[] }>({});
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const timeGranularities = [
    { value: '1min', label: '1m' },
    { value: '5min', label: '5m' },
    { value: '15min', label: '15m' },
    { value: '30min', label: '30m' },
    { value: '60min', label: '1h' },
    { value: 'daily', label: '1D' },
    { value: 'weekly', label: '1W' },
    { value: 'monthly', label: '1M' },
  ];

  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick', icon: CandlestickChart },
    { value: 'bar', label: 'Bar', icon: BarChart },
    { value: 'line', label: 'Line', icon: LineChart },
  ];

  useEffect(() => {
    fetchStockData(selectedStock);
  }, [selectedStock, selectedGranularity]);

  useEffect(() => {
    if (selectedStrategies.length > 0) {
      generateStrategyData();
    }
  }, [selectedStrategies, stockData]);

  const fetchStockData = async (stock: string) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_${selectedGranularity.toUpperCase()}&symbol=${stock}&outputsize=full&apikey=YOUR_API_KEY`
      );
      const timeSeriesData =
        response.data[
          `Time Series (${
            timeGranularities.find((g) => g.value === selectedGranularity)
              ?.label
          })`
        ];
      if (!timeSeriesData) {
        throw new Error('No data received from API');
      }
      const formattedData = Object.entries(timeSeriesData)
        .map(([date, values]: [string, any]) => ({
          date: new Date(date).getTime(),
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }))
        .reverse();
      setStockData(formattedData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      const placeholderData = generatePlaceholderData();
      setStockData(placeholderData);
    }
  };

  const generatePlaceholderData = (): StockData[] => {
    const data: StockData[] = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const basePrice = 100 + Math.sin(i / 10) * 20 + Math.random() * 10;
      data.push({
        date: date.getTime(),
        open: basePrice,
        high: basePrice + Math.random() * 5,
        low: basePrice - Math.random() * 5,
        close: basePrice + Math.random() * 2 - 1,
        volume: Math.floor(Math.random() * 1000000) + 500000,
      });
    }

    return data;
  };

  const generateStrategyData = () => {
    const newStrategyData: { [key: string]: StrategyData[] } = {};
    selectedStrategies.forEach(strategy => {
      newStrategyData[strategy] = stockData.map(data => ({
        date: data.date,
        value: Math.random() * 2 - 1 // Random value between -1 and 1
      }));
    });
    setStrategyData(newStrategyData);
  };

  const drawEvents = useCallback((chart: Highcharts.Chart) => {
    // Remove existing event elements
    chart.renderer.boxWrapper.element.querySelectorAll('.event-element').forEach(el => el.remove());

    const xAxis = chart.xAxis[0];
    const yAxis = chart.yAxis[0];
    const chartLeft = chart.plotLeft;
    const chartRight = chart.plotLeft + chart.plotWidth;
    const chartTop = chart.plotTop;
    const chartBottom = chart.plotTop + chart.plotHeight;

    events.forEach((event) => {
      const xPos = xAxis.toPixels(event.date);
      const yPos = yAxis.toPixels(yAxis.getExtremes().min);

      if (xPos !== undefined && yPos !== undefined &&
          xPos >= chartLeft && xPos <= chartRight &&
          yPos >= chartTop && yPos <= chartBottom) {
        const circle = chart.renderer
          .circle(xPos, yPos, 10)
          .attr({
            fill: colorMode === 'dark' ? '#ffa500' : '#2563eb',
            zIndex: 5,
            class: 'event-element',
          })
          .css({
            cursor: 'pointer',
          })
          .add();

        chart.renderer
          .text(event.title, xPos - 20, yPos + 20)
          .attr({
            zIndex: 5,
            class: 'event-element',
          })
          .css({
            color: colorMode === 'dark' ? '#e5e7eb' : '#111827',
            fontSize: '10px',
            cursor: 'pointer',
          })
          .add();

        // Add click event to the circle
        (circle.element as HTMLElement).onclick = () => {
          // Toggle vertical line
          if (activeEventLines.has(event.date)) {
            activeEventLines.delete(event.date);
            chart.renderer.boxWrapper.element.querySelector(`.vertical-line-${event.date}`)?.remove();
          } else {
            activeEventLines.add(event.date);
            chart.renderer
              .path(['M', xPos, chartTop, 'L', xPos, chartBottom])
              .attr({
                'stroke-width': 1,
                stroke: colorMode === 'dark' ? '#e5e7eb' : '#4b5563',
                dashstyle: 'shortdash',
                zIndex: 4,
                class: `vertical-line-${event.date} event-element`,
              })
              .add();
          }
          setActiveEventLines(new Set(activeEventLines));
        };

        // Add hover event to the circle
        (circle.element as HTMLElement).onmouseover = (e: MouseEvent) => {
          const tooltipContainer = document.createElement('div');
          tooltipContainer.className = `event-tooltip ${colorMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-2 rounded shadow-lg`;
          tooltipContainer.style.position = 'absolute';
          tooltipContainer.style.zIndex = '1000';
          tooltipContainer.innerHTML = `
            <h3 class="font-bold">${event.title}</h3>
            <p>${event.description}</p>
          `;

          // Calculate position
          const chartRect = chart.container.getBoundingClientRect();
          let left = e.clientX - chartRect.left + 10;
          let top = e.clientY - chartRect.top + 10;

          // Adjust position if it goes beyond the right edge of the plot area
          if (left + 200 > chart.plotWidth) {
            left = Math.max(0, chart.plotWidth - 200);
          }

          // Adjust position if it goes beyond the bottom edge of the plot area
          if (top + tooltipContainer.offsetHeight > chart.plotHeight) {
            top = Math.max(0, chart.plotHeight - tooltipContainer.offsetHeight);
          }

          tooltipContainer.style.left = `${left}px`;
          tooltipContainer.style.top = `${top}px`;

          chart.container.appendChild(tooltipContainer);
        };

        (circle.element as HTMLElement).onmouseout = () => {
          const tooltipContainer = document.querySelector('.event-tooltip');
          if (tooltipContainer) {
            tooltipContainer.remove();
          }
        };

        // Redraw active event lines
        if (activeEventLines.has(event.date)) {
          chart.renderer
            .path(['M', xPos, chartTop, 'L', xPos, chartBottom])
            .attr({
              'stroke-width': 1,
              stroke: colorMode === 'dark' ? '#e5e7eb' : '#4b5563',
              dashstyle: 'shortdash',
              zIndex: 4,
              class: `vertical-line-${event.date} event-element`,
            })
            .add();
        }
      }
    });
  }, [events, colorMode, activeEventLines]);

  const getInitialRange = useCallback(() => {
    const now = Date.now();
    switch (selectedGranularity) {
      case '1min':
      case '5min':
      case '15min':
        return { min: now - 24 * 60 * 60 * 1000, max: now }; // Last 24 hours
      case '30min':
      case '60min':
        return { min: now - 72 * 60 * 60 * 1000, max: now }; // Last 72 hours
      case 'daily':
        return { min: now - 30 * 24 * 60 * 60 * 1000, max: now }; // Last month
      default:
        return { min: now - 30 * 24 * 60 * 60 * 1000, max: now }; // Default to last month
    }
  }, [selectedGranularity]);

  const [chartExtremes, setChartExtremes] = useState(getInitialRange());

  useEffect(() => {
    const newExtremes = getInitialRange();
    setChartExtremes(newExtremes);
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.xAxis[0].setExtremes(newExtremes.min, newExtremes.max, true, false);
    }
  }, [selectedGranularity, getInitialRange]);

  const getChartOptions = useCallback((): Highcharts.Options => ({
    chart: {
      backgroundColor: colorMode === 'dark' ? '#1f2937' : '#ffffff',
      height: '80%',
      events: {
        load: function (this: Highcharts.Chart) {
          drawEvents(this);
        },
        redraw: function (this: Highcharts.Chart) {
          document.querySelectorAll('.event-tooltip').forEach(el => el.remove());
          drawEvents(this);
        },
      },
    },
    rangeSelector: {
      enabled: false,
      selected: 1,
      inputStyle: {
        color: colorMode === 'dark' ? '#e5e7eb' : '#111827',
      },
      labelStyle: {
        color: colorMode === 'dark' ? '#e5e7eb' : '#111827',
      },
      buttonTheme: {
        fill: colorMode === 'dark' ? '#374151' : '#f3f4f6',
        style: {
          color: colorMode === 'dark' ? '#e5e7eb' : '#111827',
        },
        states: {
          hover: {
            fill: colorMode === 'dark' ? '#4b5563' : '#e5e7eb',
          },
          select: {
            fill: colorMode === 'dark' ? '#6b7280' : '#d1d5db',
            style: {
              color: colorMode === 'dark' ? '#ffffff' : '#000000',
            },
          },
        },
      },
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
        height: '60%',
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
        top: '60%',
        height: '20%',
        offset: 0,
        lineWidth: 2,
      },
      {
        labels: {
          align: 'right',
          x: -3,
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        title: {
          text: 'Strategies',
          style: { color: colorMode === 'dark' ? '#e5e7eb' : '#111827' },
        },
        top: '80%',
        height: '20%',
        offset: 0,
        lineWidth: 2,
        min: -1,
        max: 1,
      },
    ],
    tooltip: {
      enabled: false,
      split: true,

      shared: true,
      backgroundColor: colorMode === 'dark' ? '#374151' : '#ffffff',
      useHTML: true,
      // formatter: function () {
      //   const point = this.points?.[0];
      //   if (point) {
      //     return ReactDOMServer.renderToString(
      //       <ChartTooltip colorMode={colorMode} point={point} />
      //     );
      //   }
      //   return '';
      // },
    },
    plotOptions: {
      series: {
        states: {
          inactive: {
            opacity: 1
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
    series: [
      {
        type: selectedChartType as any,
        name: selectedStock,
        data: stockData.map((d) => [d.date, d.open, d.high, d.low, d.close]),
        id: 'main',
        color: '#ef4444',
        upColor: '#22c55e',
      },
      {
        type: 'column',
        name: 'Volume',
        data: stockData.map((d) => [d.date, d.volume]),
        yAxis: 1,
        color: colorMode === 'dark' ? 'rgba(255, 165, 0, 0.8)' : 'rgba(37, 99, 235, 0.5)',
      },
      ...Object.entries(strategyData).map(([strategy, data], index) => ({
        type: 'line',
        name: strategy,
        data: data.map((d) => [d.date, d.value]),
        yAxis: 2,
        color: `hsl(${index * 60}, 70%, 50%)`,
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
        color:
          colorMode === 'dark'
            ? 'rgba(255, 150, 150, 0.7)'
            : 'rgba(0, 0, 0, 0.3)',
        dashStyle: 'Dash',
      },
      events: {
        afterSetExtremes: function (e: Highcharts.AxisSetExtremesEventObject) {
          const chart = this.chart;
          drawEvents(chart);
        },
      },
      min: chartExtremes.min,
      max: chartExtremes.max,
    },
  }), [colorMode, selectedChartType, selectedStock, stockData, drawEvents, chartExtremes, strategyData]);

  const handleAddSeries = (stock: string) => {
    if (!selectedSeries.includes(stock)) {
      setSelectedSeries([...selectedSeries, stock]);
      fetchStockData(stock);
    }
    setIsAddSeriesPopupOpen(false);
  };

  const handleRemoveSeries = (stock: string) => {
    setSelectedSeries(selectedSeries.filter((s) => s !== stock));
    const chart = chartRef.current?.chart;
    if (chart) {
      const seriesToRemove = chart.series.find((s) => s.name === stock);
      if (seriesToRemove) {
        seriesToRemove.remove();
      }
    }
  };

  const handleStrategyChange = (strategies: string[]) => {
    setSelectedStrategies(strategies);
  };

  return (
    <div className={`w-full ${colorMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="flex">
        {/* Left Panel - Chart and Alerts */}
        <div className="w-1/4 p-4">
          <ChartSection colorMode={colorMode} onStrategyChange={handleStrategyChange} />
          <AlertsSection colorMode={colorMode} />
        </div>

        {/* Right Panel - Chart */}
        <div className="w-3/4 p-4">
          <ChartWithControls
            colorMode={colorMode}
            stocks={stocks}
            selectedSeries={selectedSeries}
            timeGranularities={timeGranularities}
            selectedTimeGranularity={selectedGranularity}
            chartTypes={chartTypes}
            selectedChartType={selectedChartType}
            isAddSeriesPopupOpen={isAddSeriesPopupOpen}
            isIndicatorsPopupOpen={isIndicatorsPopupOpen}
            setIsAddSeriesPopupOpen={setIsAddSeriesPopupOpen}
            setIsIndicatorsPopupOpen={setIsIndicatorsPopupOpen}
            handleAddSeries={handleAddSeries}
            setSelectedTimeGranularity={setSelectedGranularity}
            setSelectedChartType={setSelectedChartType}
            chartOptions={getChartOptions()}
            chartRef={chartRef}
            stockData={stockData}
          />
        </div>
      </div>
    </div>
  );
}

export default FinancialChart;