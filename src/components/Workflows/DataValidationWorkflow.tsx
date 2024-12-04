import React, { useState } from "react";
import { GitCompare, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface DataValidationWorkflowProps {
  colorMode: "light" | "dark";
}

interface ValidationCheck {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "passed" | "failed" | "warning";
  details?: string;
  timestamp?: string;
}

const DataValidationWorkflow: React.FC<DataValidationWorkflowProps> = ({
  colorMode,
}) => {
  const [checks, setChecks] = useState<ValidationCheck[]>([
    {
      id: "1",
      name: "Price Continuity",
      description: "Check for gaps in price data",
      status: "pending",
    },
    {
      id: "2",
      name: "Volume Consistency",
      description: "Validate volume data against expected patterns",
      status: "pending",
    },
    {
      id: "3",
      name: "Timestamp Sequence",
      description: "Verify timestamp ordering and intervals",
      status: "pending",
    },
    {
      id: "4",
      name: "Data Range",
      description: "Check if values are within expected ranges",
      status: "pending",
    },
    {
      id: "5",
      name: "Cross-Exchange Correlation",
      description: "Compare data consistency across exchanges",
      status: "pending",
    },
  ]);

  const [isValidating, setIsValidating] = useState(false);

  const getStatusIcon = (status: ValidationCheck["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "running":
        return (
          <div className="w-5 h-5">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300"></div>;
    }
  };

  const handleRunValidation = async () => {
    setIsValidating(true);

    // Reset all checks to pending
    setChecks((prev) =>
      prev.map((check) => ({ ...check, status: "pending" as const }))
    );

    // Simulate validation process for each check
    for (let i = 0; i < checks.length; i++) {
      setChecks((prev) =>
        prev.map((check, index) =>
          index === i ? { ...check, status: "running" as const } : check
        )
      );

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate random results
      const result = Math.random();
      const status =
        result > 0.7 ? "passed" : result > 0.4 ? "warning" : "failed";
      const timestamp = new Date().toLocaleString();

      setChecks((prev) =>
        prev.map((check, index) =>
          index === i
            ? {
                ...check,
                status: status as ValidationCheck["status"],
                timestamp,
                details:
                  status === "failed"
                    ? "Validation failed due to data inconsistencies"
                    : status === "warning"
                    ? "Minor issues detected but within acceptable range"
                    : "All checks passed successfully",
              }
            : check
        )
      );
    }

    setIsValidating(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Data Validation</h1>
        <p
          className={`${
            colorMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Validate data quality and consistency
        </p>
      </div>

      <div
        className={`rounded-lg ${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-sm overflow-hidden mb-6`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Validation Checks</h2>
          <button
            onClick={handleRunValidation}
            disabled={isValidating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isValidating
                ? "bg-gray-400 cursor-not-allowed"
                : colorMode === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors duration-200`}
          >
            <GitCompare
              className={`w-4 h-4 ${isValidating ? "animate-spin" : ""}`}
            />
            <span>{isValidating ? "Validating..." : "Run Validation"}</span>
          </button>
        </div>

        <div className="divide-y divide-gray-700">
          {checks.map((check) => (
            <div
              key={check.id}
              className={`p-4 ${
                colorMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
              } transition-colors duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(check.status)}
                    <h3 className="font-medium">{check.name}</h3>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {check.description}
                  </p>
                  {check.details && (
                    <div
                      className={`mt-2 text-sm ${
                        check.status === "passed"
                          ? "text-green-500"
                          : check.status === "warning"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {check.details}
                    </div>
                  )}
                </div>

                {check.timestamp && (
                  <div
                    className={`text-xs ${
                      colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {check.timestamp}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataValidationWorkflow;
