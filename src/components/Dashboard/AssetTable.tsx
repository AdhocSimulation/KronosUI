import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  LineChart,
  Sigma,
  Zap,
} from "lucide-react";
import { AssetMetrics } from "./types";
import { formatters } from "./utils";

interface AssetTableProps {
  colorMode: "light" | "dark";
  assets: AssetMetrics[];
  sortField: keyof AssetMetrics;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof AssetMetrics) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({
  colorMode,
  assets,
  sortField,
  sortDirection,
  onSort,
}) => {
  const getIndicatorColor = (value: number): string => {
    if (value > 0.5)
      return colorMode === "dark" ? "text-green-400" : "text-green-600";
    if (value < -0.5)
      return colorMode === "dark" ? "text-red-400" : "text-red-600";
    return colorMode === "dark" ? "text-gray-400" : "text-gray-600";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr
            className={`text-sm ${
              colorMode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <th
              className="px-4 py-2 text-left font-medium cursor-pointer"
              onClick={() => onSort("symbol")}
            >
              Asset
            </th>
            <th
              className="px-4 py-2 text-right font-medium cursor-pointer"
              onClick={() => onSort("price")}
            >
              Price
            </th>
            <th
              className="px-4 py-2 text-right font-medium cursor-pointer"
              onClick={() => onSort("change24h")}
            >
              24h Change
            </th>
            <th
              className="px-4 py-2 text-right font-medium cursor-pointer"
              onClick={() => onSort("volume24h")}
            >
              24h Volume
            </th>
            <th
              className="px-4 py-2 text-right font-medium cursor-pointer"
              onClick={() => onSort("marketCap")}
            >
              Market Cap
            </th>
            <th className="px-4 py-2 text-center font-medium">Tags</th>
            <th className="px-4 py-2 text-center font-medium">
              <div className="flex items-center justify-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>Cross MA</span>
              </div>
            </th>
            <th className="px-4 py-2 text-center font-medium">
              <div className="flex items-center justify-center space-x-1">
                <LineChart className="w-4 h-4" />
                <span>β Trend/Vol</span>
              </div>
            </th>
            <th className="px-4 py-2 text-center font-medium">
              <div className="flex items-center justify-center space-x-1">
                <Sigma className="w-4 h-4" />
                <span>O-U</span>
              </div>
            </th>
            <th className="px-4 py-2 text-center font-medium">
              <div className="flex items-center justify-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>PCA</span>
              </div>
            </th>
            <th className="px-4 py-2 text-center font-medium">
              <div className="flex items-center justify-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>Z-Score</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr
              key={asset.symbol}
              className={`border-t ${
                colorMode === "dark" ? "border-gray-700" : "border-gray-200"
              } hover:bg-opacity-50 hover:bg-gray-700`}
            >
              <td className="px-4 py-4">
                <div className="flex items-center space-x-2">
                  <div>
                    <div className="font-medium">{asset.symbol}</div>
                    <div
                      className={`text-sm ${
                        colorMode === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {asset.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-right font-medium">
                {formatters.formatCurrency(asset.price)}
              </td>
              <td
                className={`px-4 py-4 text-right font-medium ${
                  asset.change24h >= 0
                    ? colorMode === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                    : colorMode === "dark"
                    ? "text-red-400"
                    : "text-red-600"
                }`}
              >
                <div className="flex items-center justify-end space-x-1">
                  {asset.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{formatters.formatPercent(asset.change24h)}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-right">
                {formatters.formatCurrency(asset.volume24h)}
              </td>
              <td className="px-4 py-4 text-right">
                {formatters.formatCurrency(asset.marketCap)}
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-1">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        colorMode === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td
                className={`px-4 py-4 text-center font-medium ${getIndicatorColor(
                  asset.indicators.crossMA
                )}`}
              >
                {formatters.formatNumber(asset.indicators.crossMA)}
              </td>
              <td className="px-4 py-4 text-center">
                <div className="space-x-2">
                  <span
                    className={getIndicatorColor(asset.indicators.betaTrend)}
                  >
                    {formatters.formatNumber(asset.indicators.betaTrend)}
                  </span>
                  <span>/</span>
                  <span className={getIndicatorColor(asset.indicators.betaVol)}>
                    {formatters.formatNumber(asset.indicators.betaVol)}
                  </span>
                </div>
              </td>
              <td
                className={`px-4 py-4 text-center font-medium ${getIndicatorColor(
                  asset.indicators.ornsteinUhlenbeck
                )}`}
              >
                {formatters.formatNumber(asset.indicators.ornsteinUhlenbeck)}
              </td>
              <td
                className={`px-4 py-4 text-center font-medium ${getIndicatorColor(
                  asset.indicators.residualPCA
                )}`}
              >
                {formatters.formatNumber(asset.indicators.residualPCA)}
              </td>
              <td
                className={`px-4 py-4 text-center font-medium ${getIndicatorColor(
                  asset.indicators.zScore1Y
                )}`}
              >
                {formatters.formatNumber(asset.indicators.zScore1Y)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
