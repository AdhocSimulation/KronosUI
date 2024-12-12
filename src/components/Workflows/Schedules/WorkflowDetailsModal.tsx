import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Terminal,
} from "lucide-react";

interface WorkflowDetailsModalProps {
  colorMode: "light" | "dark";
  workflow: {
    id: string;
    name: string;
    type: string;
  };
  onClose: () => void;
}

interface ExecutionLog {
  id: string;
  timestamp: string;
  status: "success" | "error" | "warning";
  message: string;
  duration: string;
  details?: string;
}

const WorkflowDetailsModal: React.FC<WorkflowDetailsModalProps> = ({
  colorMode,
  workflow,
  onClose,
}) => {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockLogs: ExecutionLog[] = Array.from({ length: 10 }, (_, i) => ({
      id: `log-${i}`,
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      status: ["success", "error", "warning"][Math.floor(Math.random() * 3)] as
        | "success"
        | "error"
        | "warning",
      message: `Execution ${i + 1} completed`,
      duration: `${Math.floor(Math.random() * 10)}m ${Math.floor(
        Math.random() * 60
      )}s`,
      details: `Detailed execution log for run ${i + 1}...`,
    }));
    setLogs(mockLogs);
  }, [workflow.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {workflow.name} Execution History
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Execution List */}
          <div
            className={`w-1/2 border-r ${
              colorMode === "dark" ? "border-gray-700" : "border-gray-200"
            } overflow-y-auto`}
          >
            {logs.map((log) => (
              <button
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`w-full p-4 flex items-start space-x-4 ${
                  selectedLog?.id === log.id
                    ? colorMode === "dark"
                      ? "bg-gray-700"
                      : "bg-gray-100"
                    : "hover:bg-opacity-50"
                } border-b ${
                  colorMode === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {getStatusIcon(log.status)}
                <div className="flex-1 text-left">
                  <div className="font-medium">{log.message}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 opacity-60" />
                    <span
                      className={`text-sm ${
                        colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Duration: {log.duration}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Log Details */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {selectedLog ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedLog.status)}
                  <h3 className="text-lg font-medium">{selectedLog.message}</h3>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    colorMode === "dark" ? "bg-gray-900" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Terminal className="w-4 h-4" />
                    <span className="font-medium">Execution Log</span>
                  </div>
                  <pre
                    className={`text-sm font-mono whitespace-pre-wrap ${
                      colorMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {selectedLog.details}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p
                  className={`text-sm ${
                    colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Select an execution to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetailsModal;
