import React from "react";
import { X } from "lucide-react";
import { BacktestResult } from "../../types/backtest";

interface BacktestTabsProps {
  colorMode: "light" | "dark";
  results: BacktestResult[];
  activeTab: number;
  onTabChange: (index: number) => void;
  onTabClose: (index: number) => void;
}

const BacktestTabs: React.FC<BacktestTabsProps> = ({
  colorMode,
  results,
  activeTab,
  onTabChange,
  onTabClose,
}) => {
  const getParameterSetColor = (index: number): string => {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-yellow-500",
      "border-purple-500",
      "border-pink-500",
    ];
    return colors[index % colors.length] || colors[0]; // Fallback to first color if index is out of bounds
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {results.map((result, index) => {
        // Find the parameter set index from the parameters
        const paramSetIndex = result.parameters.find(
          (p) => p.name === "parameterSetIndex"
        )?.value as number;

        // Get strategy name from parameters
        const strategyName = result.parameters.find(
          (p) => p.name === "strategy"
        )?.value as string;

        return (
          <div
            key={index}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors duration-200 text-xs ${
              activeTab === index
                ? colorMode === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900 shadow-sm"
                : colorMode === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } border-l-4 ${getParameterSetColor(
              typeof paramSetIndex === "number" ? paramSetIndex : index
            )}`}
            onClick={() => onTabChange(index)}
          >
            <div className="flex flex-col min-w-[120px]">
              <div className="font-medium flex items-center space-x-2">
                <span>{result.asset}</span>
                {strategyName && (
                  <span className="text-xs opacity-60">({strategyName})</span>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-0.5">
                <span
                  className={
                    result.metrics.totalReturn >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {formatNumber(result.metrics.totalReturn)}%
                </span>
                <span className="text-gray-400">
                  SR: {formatNumber(result.metrics.sharpeRatio, 1)}
                </span>
                <span className="text-red-500">
                  DD: {formatNumber(Math.abs(result.metrics.maxDrawdown))}%
                </span>
              </div>
            </div>
            {results.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(index);
                }}
                className={`p-0.5 rounded-full hover:bg-opacity-80 ${
                  colorMode === "dark"
                    ? "hover:bg-gray-600"
                    : "hover:bg-gray-300"
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BacktestTabs;
