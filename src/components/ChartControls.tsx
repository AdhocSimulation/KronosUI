import React, { useState, useEffect, useRef } from "react";
import { Search, Activity } from "lucide-react";

interface ChartControlsProps {
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
}

const ChartControls: React.FC<ChartControlsProps> = ({
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
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStocks = stocks.filter((stock) =>
    stock.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`flex items-center space-x-4 ${
        colorMode === "dark" ? "bg-gray-800" : "bg-gray-100"
      } rounded-lg p-2`}
    >
      {/* Stock Search */}
      <div className="relative w-48" ref={searchRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="Search stocks..."
          className={`w-full px-3 py-1.5 pl-9 text-sm rounded-lg border ${
            colorMode === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
        <Search
          className={`absolute left-2.5 top-2 h-4 w-4 ${
            colorMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        />
        {isSearchOpen && filteredStocks.length > 0 && (
          <div
            className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${
              colorMode === "dark" ? "bg-gray-700" : "bg-white"
            } ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto`}
          >
            <div className="py-1" role="menu">
              {filteredStocks.map((stock) => (
                <button
                  key={stock}
                  onClick={() => {
                    handleStockChange(stock);
                    setSearchTerm("");
                    setIsSearchOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-left ${
                    stock === selectedStock
                      ? colorMode === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-900"
                      : colorMode === "dark"
                      ? "text-gray-200 hover:bg-gray-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {stock}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rest of the component remains the same */}
      <div className="flex space-x-1">
        {timeGranularities.map((granularity) => (
          <button
            key={granularity.value}
            onClick={() => setSelectedTimeGranularity(granularity.value)}
            className={`px-2 py-1 text-xs rounded ${
              selectedTimeGranularity === granularity.value
                ? colorMode === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : colorMode === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {granularity.label}
          </button>
        ))}
      </div>

      <div className="flex space-x-1">
        {chartTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => setSelectedChartType(type.value)}
              className={`p-1 rounded ${
                selectedChartType === type.value
                  ? colorMode === "dark"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : colorMode === "dark"
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title={type.label}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setIsIndicatorsPopupOpen(!isIndicatorsPopupOpen)}
        className={`px-2 py-1 rounded ${
          colorMode === "dark" ? "bg-blue-600" : "bg-blue-500"
        } text-white hover:opacity-90`}
        title="Indicators"
      >
        <Activity size={16} />
      </button>
    </div>
  );
};

export default ChartControls;
