import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

// Mock data for time series
const mockTimeSeriesData = {
  cexVolume: [
    {
      id: 'Ethereum',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 1000000000 + Math.random() * 500000000
      }))
    },
    {
      id: 'Binance Smart Chain',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 800000000 + Math.random() * 400000000
      }))
    },
    {
      id: 'Solana',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 600000000 + Math.random() * 300000000
      }))
    }
  ],
  dexVolume: [
    {
      id: 'Uniswap (ETH)',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 500000000 + Math.random() * 250000000
      }))
    },
    {
      id: 'PancakeSwap (BSC)',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 400000000 + Math.random() * 200000000
      }))
    },
    {
      id: 'Raydium (SOL)',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 300000000 + Math.random() * 150000000
      }))
    }
  ],
  tvl: [
    {
      id: 'Aave',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 5000000000 + Math.random() * 1000000000
      }))
    },
    {
      id: 'Curve',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 4000000000 + Math.random() * 800000000
      }))
    },
    {
      id: 'MakerDAO',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 3500000000 + Math.random() * 700000000
      }))
    },
    {
      id: 'Lido',
      data: Array.from({ length: 30 }, (_, i) => ({
        x: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        y: 3000000000 + Math.random() * 600000000
      }))
    }
  ]
};

const formatValue = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toFixed(2)}`;
};

const commonLineProps = {
  margin: { top: 50, right: 110, bottom: 50, left: 60 },
  xScale: { type: 'point' as const },
  yScale: { 
    type: 'linear' as const,
    min: 'auto' as const,
    max: 'auto' as const,
    stacked: false,
  },
  axisTop: null,
  axisRight: null,
  pointSize: 8,
  pointColor: { theme: 'background' },
  pointBorderWidth: 2,
  pointBorderColor: { from: 'serieColor' },
  pointLabelYOffset: -12,
  useMesh: true,
  enableSlices: 'x' as const,
  enableGridX: false,
  enableArea: true,
  areaOpacity: 0.1,
  crosshairType: 'cross' as const,
  theme: {
    axis: {
      ticks: {
        text: {
          fill: '#888888'
        }
      }
    },
    grid: {
      line: {
        stroke: '#444444'
      }
    },
    crosshair: {
      line: {
        stroke: '#f8f8f8',
        strokeWidth: 1,
        strokeOpacity: 0.35
      }
    }
  },
  legends: [
    {
      anchor: 'bottom-right',
      direction: 'column',
      justify: false,
      translateX: 100,
      translateY: 0,
      itemsSpacing: 0,
      itemDirection: 'left-to-right',
      itemWidth: 140,
      itemHeight: 20,
      symbolSize: 12,
      symbolShape: 'circle'
    }
  ]
};

const VolumeAndTVLCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* CEX Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>CEX Trading Volume</CardTitle>
          <CardDescription>24h trading volume across major centralized exchanges</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveLine
            {...commonLineProps}
            data={mockTimeSeriesData.cexVolume}
            yFormat={value => formatValue(value as number)}
            tooltip={({ point }) => (
              <div className="bg-background/95 p-2 rounded-lg shadow-lg border border-border">
                <strong>{point.serieId}</strong>
                <div>Date: {point.data.x}</div>
                <div>Volume: {formatValue(point.data.y as number)}</div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* DEX Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>DEX Trading Volume</CardTitle>
          <CardDescription>24h trading volume across decentralized exchanges</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveLine
            {...commonLineProps}
            data={mockTimeSeriesData.dexVolume}
            yFormat={value => formatValue(value as number)}
            tooltip={({ point }) => (
              <div className="bg-background/95 p-2 rounded-lg shadow-lg border border-border">
                <strong>{point.serieId}</strong>
                <div>Date: {point.data.x}</div>
                <div>Volume: {formatValue(point.data.y as number)}</div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* TVL Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Total Value Locked (TVL)</CardTitle>
          <CardDescription>TVL across major DeFi protocols</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveLine
            {...commonLineProps}
            data={mockTimeSeriesData.tvl}
            yFormat={value => formatValue(value as number)}
            tooltip={({ point }) => (
              <div className="bg-background/95 p-2 rounded-lg shadow-lg border border-border">
                <strong>{point.serieId}</strong>
                <div>Date: {point.data.x}</div>
                <div>TVL: {formatValue(point.data.y as number)}</div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VolumeAndTVLCharts;
