import React, { useState } from "react";
import { ChevronDown, Edit } from "lucide-react";
import { Strategy } from "../../types/strategy";
import { strategyService } from "../../services/strategyService";
import BuildStrategy from "./BuildStrategy";

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
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );
  const [showBuildStrategy, setShowBuildStrategy] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const strategies = strategyService.getStrategies();

  const handleStrategySelect = (strategyId: string) => {
    const strategy = strategyService.getStrategy(strategyId);
    setSelectedStrategy(strategy || null);
  };

  const handleNewStrategy = () => {
    setSelectedStrategy(null);
    setIsEditing(false);
    setShowBuildStrategy(true);
  };

  const handleEditStrategy = () => {
    setIsEditing(true);
    setShowBuildStrategy(true);
  };

  const handleSaveStrategy = async (
    strategy: Omit<Strategy, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const savedStrategy =
        isEditing && selectedStrategy
          ? await strategyService.updateStrategy(selectedStrategy.id, strategy)
          : await strategyService.saveStrategy(strategy);
      setSelectedStrategy(savedStrategy);
      setShowBuildStrategy(false);
    } catch (error) {
      console.error("Error saving strategy:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Asset Selection */}
      <div
        className={`rounded-lg ${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } p-6`}
      >
        <h2 className="text-xl font-bold mb-4">Input Parameters</h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            Trading Asset
          </label>
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
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Strategy</label>
          <div className="space-y-2">
            <div className="relative">
              <select
                value={selectedStrategy?.id || ""}
                onChange={(e) => handleStrategySelect(e.target.value)}
                className={`w-full px-3 py-2 rounded appearance-none ${
                  colorMode === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select a strategy</option>
                {strategies.map((strategy) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleNewStrategy}
                className={`flex-1 px-3 py-2 rounded ${
                  colorMode === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Create New Strategy
              </button>
              {selectedStrategy && (
                <button
                  onClick={handleEditStrategy}
                  className={`px-3 py-2 rounded ${
                    colorMode === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Build Strategy Modal */}
      {showBuildStrategy && (
        <BuildStrategy
          colorMode={colorMode}
          selectedStrategy={isEditing ? selectedStrategy : null}
          onSave={handleSaveStrategy}
          onClose={() => setShowBuildStrategy(false)}
        />
      )}
    </div>
  );
};

export default InputParameters;
