import React from "react";
import { Strategy } from "../../types/strategy";
import { strategyService } from "../../services/strategyService";
import BuildStrategy from "./BuildStrategy";
import AssetSelector from "./AssetSelector";
import { Edit, Plus } from "lucide-react";

interface InputParametersProps {
  colorMode: "light" | "dark";
  selectedAssets: string[];
  onAssetChange: (assets: string[]) => void;
  selectedStrategy: Strategy | null;
  onStrategyChange: (strategy: Strategy | null) => void;
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
  selectedAssets,
  onAssetChange,
  selectedStrategy,
  onStrategyChange,
}) => {
  const [showBuildStrategy, setShowBuildStrategy] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const strategies = strategyService.getStrategies();

  const handleStrategySelect = (strategyId: string) => {
    const strategy = strategyService.getStrategy(strategyId);
    onStrategyChange(strategy || null);
  };

  const handleNewStrategy = () => {
    onStrategyChange(null);
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
      const savedStrategy = isEditing && selectedStrategy
        ? await strategyService.updateStrategy(selectedStrategy.id, strategy)
        : await strategyService.saveStrategy(strategy);
      onStrategyChange(savedStrategy);
      setShowBuildStrategy(false);
    } catch (error) {
      console.error("Error saving strategy:", error);
    }
  };

  return (
    <div className={`rounded-lg ${
      colorMode === "dark" ? "bg-gray-800" : "bg-white"
    } p-6 mb-6`}>
      <h2 className="text-xl font-bold mb-4">Input Parameters</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Trading Assets</label>
          <AssetSelector
            colorMode={colorMode}
            availableAssets={availableAssets}
            selectedAssets={selectedAssets}
            onAssetChange={onAssetChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Strategy</label>
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
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleNewStrategy}
                className={`flex-1 px-3 py-2 rounded flex items-center justify-center space-x-2 ${
                  colorMode === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                <Plus className="w-4 h-4" />
                <span>Create New Strategy</span>
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

        {selectedStrategy && (
          <div className={`mt-4 p-4 rounded-lg ${
            colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
          }`}>
            <h3 className="font-medium mb-2">{selectedStrategy.name}</h3>
            <p className={`text-sm ${
              colorMode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              {selectedStrategy.description}
            </p>
            <div className="mt-2 space-y-1">
              {selectedStrategy.expressions.map((expr, index) => (
                <div
                  key={expr.id}
                  className={`text-xs font-mono ${
                    colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {index + 1}. {expr.expression} × {expr.weight}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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