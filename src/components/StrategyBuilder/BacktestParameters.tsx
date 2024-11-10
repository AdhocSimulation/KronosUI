import React, { useState } from "react";
import { Plus, Trash2, Play, RefreshCw } from "lucide-react";
import { BacktestParameters as BacktestParams } from "../../types/backtest";
import { getParameterSetColor } from "../../utils/colors";

interface BacktestParametersProps {
  colorMode: "light" | "dark";
  onRunBacktest: (parameterSets: BacktestParams[]) => void;
  isBacktesting: boolean;
}

const defaultParameterSet: BacktestParams = {
  lookbackPeriod: 20,
  profitTarget: 2.5,
  stopLoss: 1.5,
  trailingStop: true,
  timeframe: "1h",
};

const BacktestParameters: React.FC<BacktestParametersProps> = ({
  colorMode,
  onRunBacktest,
  isBacktesting,
}) => {
  const [parameterSets, setParameterSets] = useState<BacktestParams[]>([defaultParameterSet]);
  const [expandedSet, setExpandedSet] = useState<number | null>(0);

  const handleParameterChange = (
    setIndex: number,
    field: keyof BacktestParams,
    value: number | string | boolean
  ) => {
    const newParameterSets = [...parameterSets];
    newParameterSets[setIndex] = {
      ...newParameterSets[setIndex],
      [field]: value,
    };
    setParameterSets(newParameterSets);
  };

  const handleAddParameterSet = () => {
    setParameterSets([...parameterSets, { ...defaultParameterSet }]);
    setExpandedSet(parameterSets.length);
  };

  const handleRemoveParameterSet = (index: number) => {
    const newParameterSets = parameterSets.filter((_, i) => i !== index);
    setParameterSets(newParameterSets);
    if (expandedSet === index) {
      setExpandedSet(null);
    } else if (expandedSet !== null && expandedSet > index) {
      setExpandedSet(expandedSet - 1);
    }
  };

  const handleReset = () => {
    setParameterSets([{ ...defaultParameterSet }]);
    setExpandedSet(0);
  };

  return (
    <div className={`rounded-lg ${
      colorMode === "dark" ? "bg-gray-800" : "bg-white"
    } p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Backtest Parameters</h2>
        <button
          onClick={handleAddParameterSet}
          className={`w-6 h-6 flex items-center justify-center rounded ${
            colorMode === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          } transition-colors`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {parameterSets.map((paramSet, setIndex) => {
          const colors = getParameterSetColor(setIndex);
          return (
            <div
              key={setIndex}
              className={`border-l-4 ${colors.border} rounded-lg overflow-hidden`}
            >
              <div
                className={`p-2 ${expandedSet === setIndex ? colors.bg : ""} ${
                  colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
                } flex items-center justify-between cursor-pointer`}
                onClick={() =>
                  setExpandedSet(expandedSet === setIndex ? null : setIndex)
                }
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    Parameter Set {setIndex + 1}
                  </span>
                  {expandedSet !== setIndex && (
                    <span className="text-xs opacity-60">
                      (LP: {paramSet.lookbackPeriod}, PT: {paramSet.profitTarget}%, SL:{" "}
                      {paramSet.stopLoss}%)
                    </span>
                  )}
                </div>
                {parameterSets.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveParameterSet(setIndex);
                    }}
                    className="p-1 rounded-full hover:bg-opacity-80"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>

              {expandedSet === setIndex && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Lookback Period
                      <span className={`ml-2 text-xs ${
                        colorMode === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}>
                        (Number of periods to look back)
                      </span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={1}
                        max={100}
                        step={1}
                        value={paramSet.lookbackPeriod}
                        onChange={(e) =>
                          handleParameterChange(
                            setIndex,
                            "lookbackPeriod",
                            parseInt(e.target.value)
                          )
                        }
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={paramSet.lookbackPeriod}
                        onChange={(e) =>
                          handleParameterChange(
                            setIndex,
                            "lookbackPeriod",
                            parseInt(e.target.value)
                          )
                        }
                        min={1}
                        max={100}
                        step={1}
                        className={`w-20 px-2 py-1 rounded ${
                          colorMode === "dark"
                            ? "bg-gray-700 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Profit Target
                      <span className={`ml-2 text-xs ${
                        colorMode === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}>
                        (Take profit target in %)
                      </span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={paramSet.profitTarget}
                        onChange={(e) =>
                          handleParameterChange(
                            setIndex,
                            "profitTarget",
                            parseFloat(e.target.value)
                          )
                        }
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={paramSet.profitTarget}
                        onChange={(e) =>
                          handleParameterChange(
                            setIndex,
                            "profitTarget",
                            parseFloat(e.target.value)
                          )
                        }
                        min={0.1}
                        max={10}
                        step={0.1}
                        className={`w-20 px-2 py-1 rounded ${
                          colorMode === "dark"
                            ? "bg-gray-700 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Stop Loss
                      <span className={`ml-2 text-xs ${
                        colorMode === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}>
                        (Stop loss in %)
                      </span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={paramSet.stopLoss}
                        onChange={(e) =>
                          handleParameterChange(
                            setIndex,
                            "stopLoss",
                            parseFloat(e.target.value)
                          )
                        }
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={paramSet.stopLoss}
                        onChange={(e) =>
                          handleParameterChange(
                            setIndex,
                            "stopLoss",
                            parseFloat(e.target.value)
                          )
                        }
                        min={0.1}
                        max={10}
                        step={0.1}
                        className={`w-20 px-2 py-1 rounded ${
                          colorMode === "dark"
                            ? "bg-gray-700 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={paramSet.trailingStop}
                        onChange={(e) =>
                          handleParameterChange(
                            setIndex,
                            "trailingStop",
                            e.target.checked
                          )
                        }
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <span>Enable Trailing Stop</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Timeframe
                    </label>
                    <select
                      value={paramSet.timeframe}
                      onChange={(e) =>
                        handleParameterChange(
                          setIndex,
                          "timeframe",
                          e.target.value
                        )
                      }
                      className={`w-full px-3 py-2 rounded ${
                        colorMode === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <option value="1m">1 minute</option>
                      <option value="5m">5 minutes</option>
                      <option value="15m">15 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="4h">4 hours</option>
                      <option value="1d">1 day</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => onRunBacktest(parameterSets)}
          disabled={isBacktesting}
          className={`flex-1 py-2 px-4 rounded flex items-center justify-center space-x-2 ${
            isBacktesting
              ? "bg-gray-400 cursor-not-allowed"
              : colorMode === "dark"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors duration-200`}
        >
          {isBacktesting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Run Backtest</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={isBacktesting}
          className={`px-4 py-2 rounded ${
            colorMode === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          } transition-colors duration-200`}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default BacktestParameters;