import React from 'react';
import { Plus, BarChart, CandlestickChart, LineChart, Activity } from 'lucide-react';

interface ChartControlsProps {
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
}

const ChartControls: React.FC<ChartControlsProps> = ({
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
}) => {
  return (
    <div className={`flex items-center space-x-4 ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
      {/* Add Series Button */}
      <div className="relative">
        <button
          onClick={() => setIsAddSeriesPopupOpen(!isAddSeriesPopupOpen)}
          className={`px-2 py-1 text-xs rounded ${colorMode === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded hover:bg-blue-600`}
          title="Add Series"
        >
          <Plus size={16} />
        </button>
        {isAddSeriesPopupOpen && (
          <div className={`absolute z-10 mt-2 w-48 rounded-md shadow-lg ${colorMode === 'dark' ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5`}>
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {stocks.map((stock) => (
                <button
                  key={stock}
                  onClick={() => handleAddSeries(stock)}
                  className={`block px-4 py-2 text-sm ${colorMode === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} hover:text-gray-900 w-full text-left`}
                  role="menuitem"
                >
                  {stock}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Time Granularity Selection */}
      <div className="flex space-x-1">
        {timeGranularities.map((granularity) => (
          <button
            key={granularity.value}
            onClick={() => setSelectedTimeGranularity(granularity.value)}
            className={`px-2 py-1 text-xs rounded ${
              selectedTimeGranularity === granularity.value
                ? colorMode === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : colorMode === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {granularity.label}
          </button>
        ))}
      </div>

      {/* Chart Type Selection */}
      <div className="flex space-x-1">
        {chartTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => setSelectedChartType(type.value)}
              className={`p-1 rounded ${
                selectedChartType === type.value
                  ? colorMode === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : colorMode === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={type.label}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      {/* Indicators Button */}
      <div className="relative">
        <button
          onClick={() => setIsIndicatorsPopupOpen(!isIndicatorsPopupOpen)}
          className={`px-2 py-1 text-xs rounded ${colorMode === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded hover:bg-blue-600`}
          //className={`flex items-center justify-center w-8 h-8 ${colorMode === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded hover:bg-blue-600`}
          title="Indicators"
        >
          <Activity size={16} />
        </button>
        {isIndicatorsPopupOpen && (
          <div className={`absolute z-10 mt-2 w-48 rounded-md shadow-lg ${colorMode === 'dark' ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5`}>
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="indicators-menu">
              {/* Add indicator selection options here */}
              <button className={`block px-4 py-2 text-sm ${colorMode === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} hover:text-gray-900 w-full text-left`}>
                EMA
              </button>
              <button className={`block px-4 py-2 text-sm ${colorMode === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} hover:text-gray-900 w-full text-left`}>
                Bollinger Bands
              </button>
              <button className={`block px-4 py-2 text-sm ${colorMode === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} hover:text-gray-900 w-full text-left`}>
                MACD
              </button>
              {/* Add more indicators as needed */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartControls;