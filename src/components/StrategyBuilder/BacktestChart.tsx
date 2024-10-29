import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { EquityPoint, Trade } from '../../types/backtest';

interface BacktestChartProps {
  colorMode: 'light' | 'dark';
  equityData: EquityPoint[];
  selectedTrade: Trade | null;
}

const BacktestChart: React.FC<BacktestChartProps> = ({
  colorMode,
  equityData,
  selectedTrade,
}) => {
  const options: Highcharts.Options = {
    chart: {
      height: '400px',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit',
      },
    },
    title: {
      text: 'Equity Curve',
      style: {
        color: colorMode === 'dark' ? '#E5E7EB' : '#111827',
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: {
          color: colorMode === 'dark' ? '#9CA3AF' : '#4B5563',
        },
      },
      lineColor: colorMode === 'dark' ? '#374151' : '#E5E7EB',
      tickColor: colorMode === 'dark' ? '#374151' : '#E5E7EB',
      plotLines: selectedTrade ? [{
        color: colorMode === 'dark' ? '#60A5FA' : '#3B82F6',
        value: selectedTrade.entryDate.getTime(),
        width: 2,
        dashStyle: 'dash',
        label: {
          text: 'Entry',
          style: {
            color: colorMode === 'dark' ? '#60A5FA' : '#3B82F6',
          },
        },
      }, {
        color: colorMode === 'dark' ? '#60A5FA' : '#3B82F6',
        value: selectedTrade.exitDate.getTime(),
        width: 2,
        dashStyle: 'dash',
        label: {
          text: 'Exit',
          style: {
            color: colorMode === 'dark' ? '#60A5FA' : '#3B82F6',
          },
        },
      }] : undefined,
    },
    yAxis: {
      title: {
        text: 'Equity ($)',
        style: {
          color: colorMode === 'dark' ? '#9CA3AF' : '#4B5563',
        },
      },
      labels: {
        style: {
          color: colorMode === 'dark' ? '#9CA3AF' : '#4B5563',
        },
        formatter: function() {
          return Highcharts.numberFormat(this.value as number, 0, '.', ',');
        },
      },
      gridLineColor: colorMode === 'dark' ? '#374151' : '#E5E7EB',
    },
    series: [{
      type: 'area',
      name: 'Equity',
      data: equityData.map(point => [point.date.getTime(), point.equity]),
      color: colorMode === 'dark' ? '#3B82F6' : '#2563EB',
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
        },
        stops: [
          [0, Highcharts.color(colorMode === 'dark' ? '#3B82F6' : '#2563EB').setOpacity(0.3).get('rgba')],
          [1, Highcharts.color(colorMode === 'dark' ? '#3B82F6' : '#2563EB').setOpacity(0).get('rgba')],
        ],
      },
    }],
    tooltip: {
      backgroundColor: colorMode === 'dark' ? '#1F2937' : '#FFFFFF',
      borderColor: colorMode === 'dark' ? '#374151' : '#E5E7EB',
      style: {
        color: colorMode === 'dark' ? '#F3F4F6' : '#1F2937',
      },
      formatter: function() {
        const point = this.point;
        return `
          <b>${Highcharts.dateFormat('%Y-%m-%d %H:%M', point.x)}</b><br/>
          Equity: $${Highcharts.numberFormat(point.y as number, 2, '.', ',')}
        `;
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
        },
      },
    },
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default BacktestChart;