import React, { useState } from "react";
import { format } from "date-fns";
import { Trade } from "../../types/backtest";
import { ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";

interface TradeHistoryProps {
  colorMode: "light" | "dark";
  trades: Trade[];
  onTradeSelect: (trade: Trade) => void;
  selectedTrade: Trade | null;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({
  colorMode,
  trades,
  onTradeSelect,
  selectedTrade,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy HH:mm");
  };

  if (isCollapsed) {
    return (
      <div
        className={`p-2 rounded-lg cursor-pointer ${
          colorMode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
        onClick={() => setIsCollapsed(false)}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Trade History</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsCollapsed(true)}
      >
        <h2 className="text-xl font-bold">Trade History</h2>
        <ChevronDown className="w-4 h-4" />
      </div>

      <div
        className={`rounded-lg ${
          colorMode === "dark" ? "bg-gray-700" : "bg-gray-100"
        } overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`text-xs ${
                  colorMode === "dark" ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Side</th>
                <th className="px-4 py-2 text-right">Entry</th>
                <th className="px-4 py-2 text-right">Exit</th>
                <th className="px-4 py-2 text-right">Commission</th>
                <th className="px-4 py-2 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr
                  key={trade.id}
                  onClick={() => onTradeSelect(trade)}
                  className={`text-sm cursor-pointer ${
                    selectedTrade?.id === trade.id
                      ? colorMode === "dark"
                        ? "bg-blue-900/30"
                        : "bg-blue-50"
                      : colorMode === "dark"
                      ? "hover:bg-gray-600"
                      : "hover:bg-gray-50"
                  } border-t ${
                    colorMode === "dark" ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <td className="px-4 py-2">{formatDate(trade.entryDate)}</td>
                  <td className="px-4 py-2 font-medium">{trade.symbol}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center space-x-1 ${
                        trade.direction === "long"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {trade.direction === "long" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>{trade.direction}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(trade.entryPrice)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(trade.exitPrice)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatCurrency(trade.commission)}
                  </td>
                  <td
                    className={`px-4 py-2 text-right font-medium ${
                      trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatCurrency(trade.pnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
