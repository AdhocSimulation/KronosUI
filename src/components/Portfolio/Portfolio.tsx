import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChart } from "../../contexts/ChartContext";
import SearchBar from "./SearchBar";
import PortfolioGrid from "./PortfolioGrid";
import Timeline from "./Timeline";
import MetaInfo from "./MetaInfo";
import PerformanceChart from "./PerformanceChart";
import { Activity } from "lucide-react";

interface PortfolioProps {
  colorMode: "light" | "dark";
}

interface Position {
  id: string;
  executionTime: string;
  asset: string;
  quantity: number;
  quoteCurrency: string;
  price: number;
  currentPrice: number;
  direction: "Long" | "Short";
  exchange: string;
  currentValue: number;
  pnl: number;
  dayChange: number;
  dayChangePercent: number;
  strategy: string;
}

function Portfolio({ colorMode }: PortfolioProps) {
  const navigate = useNavigate();
  const { updateChartState } = useChart();
  const [selectedMode, setSelectedMode] = useState<"history" | "open">("open");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const mockEvents = [
    {
      id: "1",
      date: "2024-03-14 10:30:00",
      type: "Trade",
      description: "Bought 0.5 BTC at $45,000",
    },
    {
      id: "2",
      date: "2024-03-14 11:15:00",
      type: "Strategy",
      description: "Moving Average Crossover signal triggered",
    },
    {
      id: "3",
      date: "2024-03-14 14:20:00",
      type: "Portfolio",
      description: "Rebalancing completed",
    },
  ];

  const handleResultSelect = (result: any) => {
    setSelectedItem({
      ...result,
      stats: {
        totalPnl: 125000,
        yearlyPnlPercent: 45.8,
        monthlyPnlPercent: 12.3,
        tradesPerDay: 8.5,
        tradesPerMonth: 255,
        tradesToday: 12,
        winRate: 68.5,
        sharpeRatio: 2.1,
        maxDrawdown: -15.4,
      },
    });
  };

  const handleRowClick = (position: Position) => {
    // Get the execution date and set it to the start of the day
    const executionDate = new Date(position.executionTime);
    executionDate.setHours(0, 0, 0, 0);
    const executionTimestamp = executionDate.getTime();

    const DAY_IN_MS = 24 * 60 * 60 * 1000;
    const startDate = executionTimestamp - 10 * DAY_IN_MS;
    const endDate = executionTimestamp + 10 * DAY_IN_MS;

    // First update the chart state
    updateChartState({
      selectedStock: position.asset,
      selectedStrategies: [{ name: position.strategy }],
      selectedSignals: [],
      selectedGranularity: "1m",
      chartExtremes: {
        min: startDate,
        max: endDate,
      },
    });

    // Then navigate to the chart
    navigate("/chart");
  };

  const performanceData = generatePerformanceData();

  return (
    <div
      className={`p-6 ${
        colorMode === "dark" ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen`}
    >
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-2xl">
            <SearchBar
              colorMode={colorMode}
              onResultSelect={handleResultSelect}
            />
          </div>
          {selectedItem && (
            <div className="flex-1 ml-6">
              <MetaInfo colorMode={colorMode} selectedItem={selectedItem} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="mb-6">
              <div
                className={`inline-flex rounded-lg p-1 ${
                  colorMode === "dark" ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedMode === "open"
                      ? colorMode === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 shadow"
                      : colorMode === "dark"
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                  onClick={() => setSelectedMode("open")}
                >
                  Open Positions
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedMode === "history"
                      ? colorMode === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 shadow"
                      : colorMode === "dark"
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                  onClick={() => setSelectedMode("history")}
                >
                  History
                </button>
              </div>
            </div>

            <PortfolioGrid
              colorMode={colorMode}
              mode={selectedMode}
              onRowClick={handleRowClick}
            />
          </div>

          <div className="col-span-4">
            <Timeline colorMode={colorMode} events={mockEvents} />
          </div>
        </div>

        {selectedItem && (
          <div className="mt-6">
            <PerformanceChart
              colorMode={colorMode}
              data={performanceData}
              type={selectedItem.type}
              name={selectedItem.name}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const generatePerformanceData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const value =
      10000 *
      (1 + Math.sin(i / 30) * 0.2 + (i / 365) * 0.5 + Math.random() * 0.1);
    data.push({ timestamp: date.getTime(), value });
  }

  return data;
};

export default Portfolio;
