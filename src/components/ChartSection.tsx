import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Signal, Strategy } from "../types/chart";
import { useChart } from "../contexts/ChartContext";

interface ChartSectionProps {
  colorMode: "light" | "dark";
}

const signals: Signal[] = [
  { name: "Price Momentum", type: "Measure" },
  { name: "Volume Profile", type: "Measure" },
  { name: "News Sentiment", type: "External" },
  { name: "Social Media Impact", type: "External" },
  { name: "Market Breadth", type: "Measure" },
  { name: "Options Flow", type: "External" },
];

const strategies: Strategy[] = [
  { name: "Moving Average Crossover" },
  { name: "RSI Divergence" },
  { name: "MACD Histogram" },
  { name: "Bollinger Bands Squeeze" },
];

const ChartSection: React.FC<ChartSectionProps> = ({ colorMode }) => {
  const { selectedStrategies, selectedSignals, toggleStrategy, toggleSignal } =
    useChart();
  const [isStrategyDropdownOpen, setIsStrategyDropdownOpen] = useState(false);
  const [isSignalDropdownOpen, setIsSignalDropdownOpen] = useState(false);
  const strategyDropdownRef = useRef<HTMLDivElement>(null);
  const signalDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        strategyDropdownRef.current &&
        !strategyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStrategyDropdownOpen(false);
      }
      if (
        signalDropdownRef.current &&
        !signalDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSignalDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSignalTypeColor = (type: "Measure" | "External") => {
    return type === "Measure"
      ? colorMode === "dark"
        ? "text-emerald-400"
        : "text-emerald-600"
      : colorMode === "dark"
      ? "text-amber-400"
      : "text-amber-600";
  };

  return (
    <div
      className={`mb-6 ${
        colorMode === "dark" ? "text-white" : "text-gray-800"
      }`}
    >
      <h2 className="text-xl font-bold mb-2">Chart</h2>

      {/* Strategy Section */}
      <h3 className="text-lg font-semibold mb-2">Add Strategy</h3>
      <div className="relative mb-4" ref={strategyDropdownRef}>
        <button
          onClick={() => setIsStrategyDropdownOpen(!isStrategyDropdownOpen)}
          className={`w-full p-2 text-left rounded ${
            colorMode === "dark"
              ? "bg-gray-700 text-white"
              : "bg-white text-gray-800"
          } border ${
            colorMode === "dark" ? "border-gray-600" : "border-gray-300"
          }`}
        >
          {selectedStrategies.length > 0
            ? `${selectedStrategies.length} selected`
            : "Select strategies"}
        </button>
        {isStrategyDropdownOpen && (
          <div
            className={`absolute z-10 w-full mt-1 rounded shadow-lg ${
              colorMode === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            {strategies.map((strategy) => (
              <div
                key={strategy.name}
                className={`p-2 cursor-pointer ${
                  selectedStrategies.some((s) => s.name === strategy.name)
                    ? colorMode === "dark"
                      ? "bg-blue-600"
                      : "bg-blue-100"
                    : colorMode === "dark"
                    ? "hover:bg-gray-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => toggleStrategy(strategy)}
              >
                <div className="flex justify-between items-center">
                  <span>{strategy.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signal Section */}
      <h3 className="text-lg font-semibold mb-2">Add Signal</h3>
      <div className="relative mb-4" ref={signalDropdownRef}>
        <button
          onClick={() => setIsSignalDropdownOpen(!isSignalDropdownOpen)}
          className={`w-full p-2 text-left rounded ${
            colorMode === "dark"
              ? "bg-gray-700 text-white"
              : "bg-white text-gray-800"
          } border ${
            colorMode === "dark" ? "border-gray-600" : "border-gray-300"
          }`}
        >
          {selectedSignals.length > 0
            ? `${selectedSignals.length} selected`
            : "Select signals"}
        </button>
        {isSignalDropdownOpen && (
          <div
            className={`absolute z-10 w-full mt-1 rounded shadow-lg ${
              colorMode === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            {signals.map((signal) => (
              <div
                key={signal.name}
                className={`p-2 cursor-pointer ${
                  selectedSignals.some((s) => s.name === signal.name)
                    ? colorMode === "dark"
                      ? "bg-blue-600"
                      : "bg-blue-100"
                    : colorMode === "dark"
                    ? "hover:bg-gray-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => toggleSignal(signal)}
              >
                <div className="flex justify-between items-center">
                  <span>{signal.name}</span>
                  <span
                    className={`text-xs font-mono ${getSignalTypeColor(
                      signal.type
                    )}`}
                  >
                    {signal.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Items Display */}
      {(selectedStrategies.length > 0 || selectedSignals.length > 0) && (
        <div className="mt-4">
          {selectedStrategies.length > 0 && (
            <div className="mb-3">
              <h3 className="font-bold mb-2">Selected Strategies</h3>
              <div className="flex flex-wrap gap-2">
                {selectedStrategies.map((strategy) => (
                  <div
                    key={strategy.name}
                    className={`flex items-center px-2 py-1 rounded ${
                      colorMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <span className="mr-2">{strategy.name}</span>
                    <button
                      onClick={() => toggleStrategy(strategy)}
                      className="ml-2 focus:outline-none"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSignals.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Selected Signals</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSignals.map((signal) => (
                  <div
                    key={signal.name}
                    className={`flex items-center px-2 py-1 rounded ${
                      colorMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <span className="mr-2">{signal.name}</span>
                    <span
                      className={`text-xs font-mono ${getSignalTypeColor(
                        signal.type
                      )}`}
                    >
                      {signal.type}
                    </span>
                    <button
                      onClick={() => toggleSignal(signal)}
                      className="ml-2 focus:outline-none"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartSection;
