import React, { useState } from "react";
import { FileCheck, Filter, AlertTriangle, CheckCircle } from "lucide-react";

interface DataCleanupWorkflowProps {
  colorMode: "light" | "dark";
}

interface CleanupRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high";
}

const DataCleanupWorkflow: React.FC<DataCleanupWorkflowProps> = ({
  colorMode,
}) => {
  const [rules, setRules] = useState<CleanupRule[]>([
    {
      id: "1",
      name: "Remove Outliers",
      description:
        "Filter out price data points that deviate significantly from the moving average",
      enabled: true,
      severity: "high",
    },
    {
      id: "2",
      name: "Fill Missing Values",
      description: "Interpolate missing values using linear interpolation",
      enabled: true,
      severity: "medium",
    },
    {
      id: "3",
      name: "Normalize Timestamps",
      description:
        "Convert all timestamps to UTC and ensure consistent intervals",
      enabled: true,
      severity: "high",
    },
    {
      id: "4",
      name: "Remove Duplicates",
      description:
        "Remove duplicate entries based on timestamp and trading pair",
      enabled: true,
      severity: "medium",
    },
    {
      id: "5",
      name: "Volume Validation",
      description: "Flag and correct suspicious volume spikes",
      enabled: false,
      severity: "low",
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    processed: number;
    cleaned: number;
    errors: number;
  } | null>(null);

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handleRunCleanup = async () => {
    setIsRunning(true);
    setResults(null);

    // Simulate cleanup process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setResults({
      processed: 1000000,
      cleaned: 15420,
      errors: 42,
    });
    setIsRunning(false);
  };

  const getSeverityColor = (severity: CleanupRule["severity"]) => {
    switch (severity) {
      case "high":
        return colorMode === "dark" ? "text-red-400" : "text-red-600";
      case "medium":
        return colorMode === "dark" ? "text-yellow-400" : "text-yellow-600";
      case "low":
        return colorMode === "dark" ? "text-blue-400" : "text-blue-600";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Data Cleanup</h1>
        <p
          className={`${
            colorMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Clean and normalize historical market data
        </p>
      </div>

      <div
        className={`rounded-lg ${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-sm overflow-hidden mb-6`}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Cleanup Rules</h2>
        </div>

        <div className="divide-y divide-gray-700">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 ${
                colorMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
              } transition-colors duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{rule.name}</h3>
                    <span
                      className={`text-xs font-medium uppercase ${getSeverityColor(
                        rule.severity
                      )}`}
                    >
                      {rule.severity}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {rule.description}
                  </p>
                </div>

                <div className="ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={rule.enabled}
                      onChange={() => handleToggleRule(rule.id)}
                    />
                    <div
                      className={`w-11 h-6 rounded-full peer ${
                        colorMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                      } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleRunCleanup}
          disabled={isRunning || !rules.some((r) => r.enabled)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isRunning || !rules.some((r) => r.enabled)
              ? "bg-gray-400 cursor-not-allowed"
              : colorMode === "dark"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors duration-200`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{isRunning ? "Running Cleanup..." : "Run Cleanup"}</span>
        </button>

        {results && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Processed: {results.processed.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cleaned: {results.cleaned.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Errors: {results.errors.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCleanupWorkflow;
