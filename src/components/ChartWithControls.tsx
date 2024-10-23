import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import ChartControls from './ChartControls';
import ChartSeriesSummary from './ChartSeriesSummary';

interface ChartWithControlsProps {
  colorMode: 'light' | 'dark';
  stocks: string[];
  selectedSeries: string[];
  timeGranularities: { value: string; label: string }[];
  selectedTimeGranularity: string;
  chartTypes: { value: string; label: string; icon: React.ElementType }[];
  selectedChartType: string;
  isAddSeriesPopupOpen: boolean;
  isIndicatorsPopupOpen: boolean;
  setIsAddSeriesPopupOpen: (isOpen: boolean) => void;
  setIsIndicatorsPopupOpen: (isOpen: boolean) => void;
  handleAddSeries: (stock: string) => void;
  setSelectedTimeGranularity: (granularity: string) => void;
  setSelectedChartType: (chartType: string) => void;
  chartOptions: Highcharts.Options;
  chartRef: React.RefObject<HighchartsReact.RefObject>;
  stockData: any[];
}

const ChartWithControls: React.FC<ChartWithControlsProps> = ({
  colorMode,
  stocks,
  selectedSeries,
  timeGranularities,
  selectedTimeGranularity,
  chartTypes,
  selectedChartType,
  isAddSeriesPopupOpen,
  isIndicatorsPopupOpen,
  setIsAddSeriesPopupOpen,
  setIsIndicatorsPopupOpen,
  handleAddSeries,
  setSelectedTimeGranularity,
  setSelectedChartType,
  chartOptions,
  chartRef,
  stockData,
}) => {
  return (
    <div className={`${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow w-full`}>
      <div className="p-4 pb-0">
        <ChartControls
          colorMode={colorMode}
          stocks={stocks}
          selectedSeries={selectedSeries}
          timeGranularities={timeGranularities}
          selectedTimeGranularity={selectedTimeGranularity}
          chartTypes={chartTypes}
          selectedChartType={selectedChartType}
          isAddSeriesPopupOpen={isAddSeriesPopupOpen}
          isIndicatorsPopupOpen={isIndicatorsPopupOpen}
          setIsAddSeriesPopupOpen={setIsAddSeriesPopupOpen}
          setIsIndicatorsPopupOpen={setIsIndicatorsPopupOpen}
          handleAddSeries={handleAddSeries}
          setSelectedTimeGranularity={setSelectedTimeGranularity}
          setSelectedChartType={setSelectedChartType}
        />
      </div>
      <div className="px-4">
        <ChartSeriesSummary
          colorMode={colorMode}
          selectedSeries={selectedSeries[0]}
          selectedTimeGranularity={selectedTimeGranularity}
          stockData={stockData}
        />
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={chartOptions}
        ref={chartRef}
      />
    </div>
  );
};

export default ChartWithControls;