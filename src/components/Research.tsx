import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import CrossChainFlowsSankey from './charts/CrossChainFlowsSankey';
import BlockchainDetailView from './charts/BlockchainDetailView';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { ResponsiveRadar } from '@nivo/radar';
import VolumeAndTVLCharts from './charts/VolumeAndTVLCharts';

const Research: React.FC = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState<string | null>(null);

  // Mock data for various charts
  const priceData = [
    {
      id: 'BTC',
      data: [
        { x: '2024-01', y: 42000 },
        { x: '2024-02', y: 45000 },
        { x: '2024-03', y: 48000 },
      ]
    },
    {
      id: 'ETH',
      data: [
        { x: '2024-01', y: 2200 },
        { x: '2024-02', y: 2500 },
        { x: '2024-03', y: 2800 },
      ]
    }
  ];

  const marketMetrics = [
    {
      metric: 'Market Cap',
      BTC: 95,
      ETH: 80,
      SOL: 60,
    },
    {
      metric: 'Volume',
      BTC: 90,
      ETH: 75,
      SOL: 55,
    },
    {
      metric: 'Social Score',
      BTC: 85,
      ETH: 82,
      SOL: 70,
    },
    {
      metric: 'Developer Activity',
      BTC: 75,
      ETH: 90,
      SOL: 85,
    },
    {
      metric: 'Institutional Interest',
      BTC: 92,
      ETH: 78,
      SOL: 45,
    },
  ];

  const correlationData = [
    {
      id: 'BTC',
      data: [
        { x: 'BTC', y: 1 },
        { x: 'ETH', y: 0.8 },
        { x: 'SOL', y: 0.6 },
      ]
    },
    {
      id: 'ETH',
      data: [
        { x: 'BTC', y: 0.8 },
        { x: 'ETH', y: 1 },
        { x: 'SOL', y: 0.7 },
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Cross-Chain Flows</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="onchain">On-Chain Metrics</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="correlation">Cross-Asset Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {selectedBlockchain ? (
            <BlockchainDetailView
              blockchain={selectedBlockchain}
              onClose={() => setSelectedBlockchain(null)}
              className="mt-4"
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Cross-Chain Value Flows</CardTitle>
                <CardDescription>
                  Interactive visualization of value transfer between different blockchains. 
                  Click on any blockchain to see detailed metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[800px]">
                <CrossChainFlowsSankey onNodeClick={setSelectedBlockchain} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Performance</CardTitle>
                <CardDescription>Historical price movements of major assets</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveLine
                  data={priceData}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                  axisTop={null}
                  axisRight={null}
                  pointSize={10}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 80,
                      itemHeight: 20,
                      symbolSize: 12,
                      symbolShape: 'circle',
                    }
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Metrics</CardTitle>
                <CardDescription>Comprehensive market analysis</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveRadar
                  data={marketMetrics}
                  keys={['BTC', 'ETH', 'SOL']}
                  indexBy="metric"
                  maxValue={100}
                  margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                  curve="linearClosed"
                  borderWidth={2}
                  borderColor={{ from: 'color' }}
                  gridLevels={5}
                  gridShape="circular"
                  gridLabelOffset={36}
                  enableDots={true}
                  dotSize={10}
                  dotColor={{ theme: 'background' }}
                  dotBorderWidth={2}
                  dotBorderColor={{ from: 'color' }}
                  enableDotLabel={true}
                  dotLabel="value"
                  dotLabelYOffset={-12}
                  colors={{ scheme: 'nivo' }}
                  fillOpacity={0.25}
                  blendMode="multiply"
                  animate={true}
                  motionConfig="wobbly"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="onchain" className="space-y-4">
          <VolumeAndTVLCharts />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Sentiment</CardTitle>
                <CardDescription>Analysis of social media metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {/* Add sentiment analysis visualization */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>News Impact</CardTitle>
                <CardDescription>Market impact of major news events</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {/* Add news impact visualization */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
              <CardDescription>Cross-asset correlation analysis</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <ResponsiveHeatMap
                data={correlationData}
                margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                valueFormat=">-.2f"
                axisTop={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -90,
                  legend: '',
                  legendOffset: 46
                }}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -90,
                  legend: '',
                  legendPosition: 'middle',
                  legendOffset: 46
                }}
                colors={{
                  type: 'diverging',
                  scheme: 'red_yellow_blue',
                  divergeAt: 0.5,
                  minValue: -1,
                  maxValue: 1
                }}
                emptyColor="#555555"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Research;
