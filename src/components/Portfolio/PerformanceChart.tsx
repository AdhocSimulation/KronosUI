import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PerformanceChartProps {
  colorMode: 'light' | 'dark';
  data: {
    timestamp: number;
    value: number;
  }[];
  type: 'portfolio' | 'strategy' | 'asset' | 'watchlist';
  name: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ colorMode, data, type, name }) => {
  const options: Highcharts.Options = {
    chart: {
      height: '300px',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: undefined
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: {
          color: colorMode === 'dark' ? '#9CA3AF' : '#4B5563'
        }
      },
      lineColor: colorMode === 'dark' ? '#374151' : '#E5E7EB',
      tickColor: colorMode === 'dark' ? '#374151' : '#E5E7EB'
    },
    yAxis: {
      title: {
        text: undefined
      },
      labels: {
        style: {
          color: colorMode === 'dark' ? '#9CA3AF' : '#4B5563'
        }
      },
      gridLineColor: colorMode === 'dark' ? '#374151' : '#E5E7EB'
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, colorMode === 'dark' ? '#3B82F6' : '#60A5FA'],
            [1, colorMode === 'dark' ? 'rgba(59, 130, 246, 0)' : 'rgba(96, 165, 250, 0)']
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 2
          }
        },
        threshold: null
      }
    },
    series: [{
      type: 'area',
      name: name,
      data: data.map(point => [point.timestamp, point.value]),
      color: colorMode === 'dark' ? '#3B82F6' : '#2563EB'
    }],
    tooltip: {
      backgroundColor: colorMode === 'dark' ? '#1F2937' : '#FFFFFF',
      borderColor: colorMode === 'dark' ? '#374151' : '#E5E7EB',
      style: {
        color: colorMode === 'dark' ? '#F3F4F6' : '#1F2937'
      }
    },
    legend: {
      enabled: false
    }
  };

  return (
    <div className={`mt-4 rounded-lg ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default PerformanceChart;