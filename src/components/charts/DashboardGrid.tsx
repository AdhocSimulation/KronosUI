import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import CrossChainFlowsSankey from './CrossChainFlowsSankey';
import VolumeAndTVLCharts from './VolumeAndTVLCharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsiveHeatMap } from '@nivo/heatmap';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ChartComponent {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  defaultSize: { w: number; h: number };
}

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'sankey', x: 0, y: 0, w: 12, h: 12 },
    { i: 'volume', x: 0, y: 12, w: 6, h: 8 },
    { i: 'tvl', x: 6, y: 12, w: 6, h: 8 },
    { i: 'price', x: 0, y: 20, w: 6, h: 8 },
    { i: 'correlation', x: 6, y: 20, w: 6, h: 8 },
  ],
};

const DashboardGrid: React.FC<{ onNodeClick?: (node: any) => void }> = ({ onNodeClick }) => {
  const [layouts, setLayouts] = useState(
    JSON.parse(localStorage.getItem('dashboardLayouts') || JSON.stringify(DEFAULT_LAYOUTS))
  );

  const charts: ChartComponent[] = [
    {
      id: 'sankey',
      title: 'Cross-Chain Value Flows',
      description: 'Interactive visualization of value transfer between different blockchains',
      component: <CrossChainFlowsSankey onNodeClick={onNodeClick} />,
      defaultSize: { w: 12, h: 8 },
    },
    {
      id: 'volume',
      title: 'Trading Volume',
      description: '24h trading volume across exchanges',
      component: <VolumeAndTVLCharts />,
      defaultSize: { w: 6, h: 6 },
    },
    {
      id: 'tvl',
      title: 'Total Value Locked',
      description: 'TVL across major protocols',
      component: <VolumeAndTVLCharts />,
      defaultSize: { w: 6, h: 6 },
    },
    {
      id: 'price',
      title: 'Price Performance',
      description: 'Historical price movements',
      component: (
        <ResponsiveLine
          data={[
            {
              id: 'BTC',
              data: [
                { x: '2024-01', y: 42000 },
                { x: '2024-02', y: 45000 },
                { x: '2024-03', y: 48000 },
              ],
            },
          ]}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
          axisTop={null}
          axisRight={null}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          useMesh={true}
        />
      ),
      defaultSize: { w: 6, h: 6 },
    },
    {
      id: 'correlation',
      title: 'Asset Correlation',
      description: 'Cross-asset correlation analysis',
      component: (
        <ResponsiveHeatMap
          data={[
            {
              id: 'BTC',
              data: [
                { x: 'BTC', y: 1 },
                { x: 'ETH', y: 0.8 },
              ],
            },
          ]}
          margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
          valueFormat=">-.2f"
          axisTop={null}
          axisRight={null}
          colors={{
            type: 'diverging',
            scheme: 'red_yellow_blue',
            divergeAt: 0.5,
            minValue: -1,
            maxValue: 1,
          }}
        />
      ),
      defaultSize: { w: 6, h: 6 },
    },
  ];

  const handleLayoutChange = (layout: any, allLayouts: any) => {
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
    setLayouts(allLayouts);
  };

  return (
    <div className="w-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        containerPadding={[0, 0]}
        margin={[16, 16]}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        useCSSTransforms={true}
      >
        {charts.map((chart) => (
          <div key={chart.id} className="bg-background">
            <Card className="h-full overflow-hidden">
              <CardHeader className="drag-handle cursor-move">
                <CardTitle>{chart.title}</CardTitle>
                <CardDescription>{chart.description}</CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)] relative">
                <div className="absolute inset-0">
                  {chart.component}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardGrid;
