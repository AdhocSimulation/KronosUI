import React, { useState } from "react";
import { RefreshCcw, Database, Check, AlertTriangle } from "lucide-react";

interface DataSyncWorkflowProps {
  colorMode: "light" | "dark";
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "syncing";
  lastSync?: string;
}

const DataSyncWorkflow: React.FC<DataSyncWorkflowProps> = ({ colorMode }) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Binance",
      type: "Exchange",
      status: "connected",
      lastSync: "2024-03-15 10:30:00",
    },
    {
      id: "2",
      name: "Coinbase",
      type: "Exchange",
      status: "connected",
      lastSync: "2024-03-15 10:15:00",
    },
    {
      id: "3",
      name: "Local Database",
      type: "Storage",
      status: "connected",
      lastSync: "2024-03-15 10:00:00",
    },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async (sourceId: string) => {
    setDataSources((prev) =>
      prev.map((source) =>
        source.id === sourceId
          ? { ...source, status: "syncing" as const }
          : source
      )
    );

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setDataSources((prev) =>
      prev.map((source) =>
        source.id === sourceId
          ? {
              ...source,
              status: "connected" as const,
              lastSync: new Date().toLocaleString(),
            }
          : source
      )
    );
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);

    for (const source of dataSources) {
      await handleSync(source.id);
    }

    setIsSyncing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Data Synchronization</h1>
        <p
          className={`${
            colorMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Keep market data synchronized across different sources
        </p>
      </div>

      <div
        className={`rounded-lg ${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-sm overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Data Sources</h2>
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isSyncing
                ? "bg-gray-400 cursor-not-allowed"
                : colorMode === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors duration-200`}
          >
            <RefreshCcw
              className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            <span>{isSyncing ? "Syncing..." : "Sync All"}</span>
          </button>
        </div>

        <div className="divide-y divide-gray-700">
          {dataSources.map((source) => (
            <div
              key={source.id}
              className={`p-4 ${
                colorMode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
              } transition-colors duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Database className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">{source.name}</h3>
                    <p
                      className={`text-sm ${
                        colorMode === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {source.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {source.status === "connected" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : source.status === "disconnected" ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : (
                        <RefreshCcw className="w-4 h-4 animate-spin text-blue-500" />
                      )}
                      <span
                        className={`capitalize ${
                          source.status === "connected"
                            ? "text-green-500"
                            : source.status === "disconnected"
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {source.status}
                      </span>
                    </div>
                    {source.lastSync && (
                      <div
                        className={`text-sm ${
                          colorMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Last sync: {source.lastSync}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSync(source.id)}
                    disabled={source.status === "syncing"}
                    className={`p-2 rounded-lg ${
                      source.status === "syncing"
                        ? "bg-gray-400 cursor-not-allowed"
                        : colorMode === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    } transition-colors duration-200`}
                  >
                    <RefreshCcw
                      className={`w-4 h-4 ${
                        source.status === "syncing" ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSyncWorkflow;
