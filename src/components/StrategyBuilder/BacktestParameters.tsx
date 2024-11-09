import React, { useState, useEffect } from "react";
import { Plus, Trash2, Play, RefreshCw } from "lucide-react";
import { Parameter } from "../../types/backtest";

interface BacktestParametersProps {
  colorMode: "light" | "dark";
  onRunBacktest: (parameterSets: Parameter[][]) => void;
  isBacktesting: boolean;
}

const defaultParameterSet: Parameter[] = [
  {
    name: "lookbackPeriod",
    value: 20,
    type: "number",
    min: 1,
    max: 100,
    step: 1,
    description: "Number of periods to look back",
  },
  {
    name: "profitTarget",
    value: 2.5,
    type: "number",
    min: 0.1,
    max: 10,
    step: 0.1,
    description: "Take profit target in %",
  },
  {
    name: "stopLoss",
    value: 1.5,
    type: "number",
    min: 0.1,
    max: 10,
    step: 0.1,
    description: "Stop loss in %",
  },
  {
    name: "trailingStop",
    value: true,
    type: "boolean",
    description: "Enable trailing stop loss",
  },
  {
    name: "timeframe",
    value: "1h",
    type: "string",
    description: "Trading timeframe",
  },
];

const BacktestParameters: React.FC<BacktestParametersProps> = ({
  colorMode,
  onRunBacktest,
  isBacktesting,
}) => {
  const [parameterSets, setParameterSets] = useState<Parameter[][]>([
    defaultParameterSet,
  ]);
  const [expandedSet, setExpandedSet] = useState<number | null>(0);

  const handleParameterChange = (
    setIndex: number,
    paramIndex: number,
    value: number | string | boolean
  ) => {
    const newParameterSets = [...parameterSets];
    newParameterSets[setIndex] = [...newParameterSets[setIndex]];
    newParameterSets[setIndex][paramIndex] = {
      ...newParameterSets[setIndex][paramIndex],
      value,
    };
    setParameterSets(newParameterSets);
  };

  const handleAddParameterSet = () => {
    setParameterSets([
      ...parameterSets,
      JSON.parse(JSON.stringify(defaultParameterSet)),
    ]);
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
    setParameterSets([JSON.parse(JSON.stringify(defaultParameterSet))]);
    setExpandedSet(0);
  };

  const getParameterSetColor = (
    index: number
  ): { border: string; bg: string } => {
    const colors = [
      { border: "border-blue-500", bg: "bg-blue-500/10" },
      { border: "border-green-500", bg: "bg-green-500/10" },
      { border: "border-yellow-500", bg: "bg-yellow-500/10" },
      { border: "border-purple-500", bg: "bg-purple-500/10" },
      { border: "border-pink-500", bg: "bg-pink-500/10" },
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      className={`rounded-lg ${
        colorMode === "dark" ? "bg-gray-800" : "bg-white"
      } p-6`}
    >
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
                      (LP: {paramSet[0].value}, PT: {paramSet[1].value}%, SL:{" "}
                      {paramSet[2].value}%)
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
                  {paramSet.map((param, paramIndex) => (
                    <div key={param.name}>
                      <label className="block text-sm font-medium mb-1">
                        {param.name}
                        {param.description && (
                          <span
                            className={`ml-2 text-xs ${
                              colorMode === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            ({param.description})
                          </span>
                        )}
                      </label>

                      {param.type === "number" && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            value={param.value as number}
                            onChange={(e) =>
                              handleParameterChange(
                                setIndex,
                                paramIndex,
                                parseFloat(e.target.value)
                              )
                            }
                            className="flex-1"
                          />
                          <input
                            type="number"
                            value={param.value as number}
                            onChange={(e) =>
                              handleParameterChange(
                                setIndex,
                                paramIndex,
                                parseFloat(e.target.value)
                              )
                            }
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            className={`w-20 px-2 py-1 rounded ${
                              colorMode === "dark"
                                ? "bg-gray-700 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          />
                        </div>
                      )}

                      {param.type === "boolean" && (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={param.value as boolean}
                            onChange={(e) =>
                              handleParameterChange(
                                setIndex,
                                paramIndex,
                                e.target.checked
                              )
                            }
                            className="rounded text-blue-500 focus:ring-blue-500"
                          />
                          <span>Enabled</span>
                        </label>
                      )}

                      {param.type === "string" && (
                        <select
                          value={param.value as string}
                          onChange={(e) =>
                            handleParameterChange(
                              setIndex,
                              paramIndex,
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
                      )}
                    </div>
                  ))}
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
