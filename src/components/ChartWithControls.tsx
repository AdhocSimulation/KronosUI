import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import ChartControls from "./ChartControls";
import ChartSeriesSummary from "./ChartSeriesSummary";

interface ChartWithControlsProps {
  colorMode: "light" | "dark";
  stocks: string[];
  selectedStock: string;
  timeGranularities: { value: string; label: string }[];
  selectedTimeGranularity: string;
  chartTypes: { value: string; label: string; icon: React.ElementType }[];
  selectedChartType: string;
  isIndicatorsPopupOpen: boolean;
  setIsIndicatorsPopupOpen: (isOpen: boolean) => void;
  handleStockChange: (stock: string) => void;
  setSelectedTimeGranularity: (granularity: string) => void;
  setSelectedChartType: (chartType: string) => void;
  chartOptions: Highcharts.Options;
  chartRef: React.RefObject<HighchartsReact.RefObject>;
  stockData: any[];
  isLoading: boolean;
}

const ChartWithControls: React.FC<ChartWithControlsProps> = ({
  colorMode,
  stocks,
  selectedStock,
  timeGranularities,
  selectedTimeGranularity,
  chartTypes,
  selectedChartType,
  isIndicatorsPopupOpen,
  setIsIndicatorsPopupOpen,
  handleStockChange,
  setSelectedTimeGranularity,
  setSelectedChartType,
  chartOptions,
  chartRef,
  stockData,
  isLoading,
}) => {
  return (
    <div
      className={`${
        colorMode === "dark" ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow w-full`}
    >
      <div className="pb-0">
        <ChartControls
          colorMode={colorMode}
          stocks={stocks}
          selectedStock={selectedStock}
          timeGranularities={timeGranularities}
          selectedTimeGranularity={selectedTimeGranularity}
          chartTypes={chartTypes}
          selectedChartType={selectedChartType}
          isIndicatorsPopupOpen={isIndicatorsPopupOpen}
          setIsIndicatorsPopupOpen={setIsIndicatorsPopupOpen}
          handleStockChange={handleStockChange}
          setSelectedTimeGranularity={setSelectedTimeGranularity}
          setSelectedChartType={setSelectedChartType}
        />
      </div>
      <div className="px-2">
        <ChartSeriesSummary
          colorMode={colorMode}
          selectedSeries={selectedStock}
          selectedTimeGranularity={selectedTimeGranularity}
          stockData={stockData}
        />
      </div>
      {isLoading ? (
        <div
          className={`flex items-center justify-center h-[500px] ${
            colorMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Loading...
        </div>
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={chartOptions}
          ref={chartRef}
        />
      )}
    </div>
  );
};

export default ChartWithControls;
