import React from "react";
import { ChevronDown } from "lucide-react";

interface InputParametersProps {
  colorMode: "light" | "dark";
  selectedAsset: string;
  onAssetChange: (asset: string) => void;
}

const availableAssets = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "DOTUSDT",
  "AVAXUSDT",
  "MATICUSDT",
];

const InputParameters: React.FC<InputParametersProps> = ({
  colorMode,
  selectedAsset,
  onAssetChange,
}) => {
  return (
    <div
      className={`rounded-lg ${
        colorMode === "dark" ? "bg-gray-800" : "bg-white"
      } p-6`}
    >
      <h2 className="text-xl font-bold mb-4">Input Parameters</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Trading Asset</label>
        <div className="relative">
          <select
            value={selectedAsset}
            onChange={(e) => onAssetChange(e.target.value)}
            className={`w-full px-3 py-2 rounded appearance-none ${
              colorMode === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-gray-100 text-gray-900 border-gray-300"
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {availableAssets.map((asset) => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
        <p
          className={`mt-1 text-xs ${
            colorMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Select the asset to backtest your strategy on
        </p>
      </div>
    </div>
  );
};

export default InputParameters;
