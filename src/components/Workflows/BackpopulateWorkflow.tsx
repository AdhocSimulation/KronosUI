import React, { useState } from "react";
import { Calendar, Clock, Database, Download } from "lucide-react";
import AssetSelector from "../StrategyBuilder/AssetSelector";

interface BackpopulateWorkflowProps {
  colorMode: "light" | "dark";
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

const timeframes = [
  { value: "1m", label: "1 minute" },
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "4h", label: "4 hours" },
  { value: "1d", label: "1 day" },
];

const BackpopulateWorkflow: React.FC<BackpopulateWorkflowProps> = ({
  colorMode,
}) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Backpopulate Market Data</h1>
        <p
          className={`${
            colorMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Fetch and store historical market data for selected assets and
          timeframes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`p-6 rounded-lg ${
            colorMode === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Select Assets</span>
                </div>
              </label>
              <AssetSelector
                colorMode={colorMode}
                availableAssets={availableAssets}
                selectedAssets={selectedAssets}
                onAssetChange={setSelectedAssets}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Select Timeframes</span>
                </div>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeframes.map((timeframe) => (
                  <label
                    key={timeframe.value}
                    className={`flex items-center space-x-2 p-2 rounded ${
                      colorMode === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTimeframes.includes(timeframe.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTimeframes([
                            ...selectedTimeframes,
                            timeframe.value,
                          ]);
                        } else {
                          setSelectedTimeframes(
                            selectedTimeframes.filter(
                              (t) => t !== timeframe.value
                            )
                          );
                        }
                      }}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span>{timeframe.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Start Date</span>
                  </div>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${
                    colorMode === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>End Date</span>
                  </div>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${
                    colorMode === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={
              isRunning ||
              !selectedAssets.length ||
              !selectedTimeframes.length ||
              !startDate ||
              !endDate
            }
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isRunning ||
              !selectedAssets.length ||
              !selectedTimeframes.length ||
              !startDate ||
              !endDate
                ? "bg-gray-400 cursor-not-allowed"
                : colorMode === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors duration-200`}
          >
            <Download className="w-4 h-4" />
            <span>{isRunning ? "Running..." : "Start Backpopulation"}</span>
          </button>

          {isRunning && (
            <div className="flex items-center space-x-4">
              <div className="text-sm">{progress}% Complete</div>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default BackpopulateWorkflow;