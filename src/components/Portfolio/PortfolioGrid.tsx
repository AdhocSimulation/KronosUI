import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";

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

interface PortfolioGridProps {
  colorMode: "light" | "dark";
  mode: "history" | "open";
  onRowClick: (position: Position) => void;
}

const strategies = [
  "Moving Average Crossover",
  "RSI Divergence",
  "MACD Histogram",
  "Bollinger Bands Squeeze",
];

const assets = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "AMZN",
  "META",
  "NVDA",
  "TSLA",
  "JPM",
  "V",
  "WMT",
  "PG",
  "JNJ",
  "UNH",
  "HD",
  "BAC",
];

const generateMockPositions = (isHistory: boolean): Position[] => {
  const exchanges = ["Binance", "Coinbase", "Kraken"];
  const positions: Position[] = [];

  const generateRandomPrice = (asset: string) => {
    const basePrices: { [key: string]: number } = {
      AAPL: 175,
      GOOGL: 140,
      MSFT: 380,
      AMZN: 170,
      META: 480,
      NVDA: 850,
      TSLA: 175,
      JPM: 175,
      V: 275,
      WMT: 175,
      PG: 155,
      JNJ: 155,
      UNH: 475,
      HD: 375,
      BAC: 35,
    };
    return basePrices[asset] * (0.9 + Math.random() * 0.2);
  };

  const numPositions = isHistory ? 20 : 8;

  for (let i = 0; i < numPositions; i++) {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const price = generateRandomPrice(asset);
    const currentPrice = price * (1 + (Math.random() * 0.1 - 0.05));
    const quantity = parseFloat((0.1 + Math.random() * 5).toFixed(3));
    const direction = Math.random() > 0.5 ? "Long" : "Short";
    const dayChange = currentPrice - price;
    const dayChangePercent = (dayChange / price) * 100;
    const pnl =
      direction === "Long"
        ? (currentPrice - price) * quantity
        : (price - currentPrice) * quantity;

    const date = new Date();
    if (isHistory) {
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    } else {
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    }

    positions.push({
      id: `${i + 1}`,
      executionTime: date.toISOString().replace("T", " ").substring(0, 19),
      asset,
      quantity,
      quoteCurrency: "USD",
      price,
      currentPrice,
      direction,
      exchange: exchanges[Math.floor(Math.random() * exchanges.length)],
      currentValue: currentPrice * quantity,
      pnl,
      dayChange,
      dayChangePercent,
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
    });
  }

  return positions;
};

const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  colorMode,
  mode,
  onRowClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sortField, setSortField] = useState<keyof Position | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterValues, setFilterValues] = useState<
    Partial<Record<keyof Position, string>>
  >({});
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const newPositions = generateMockPositions(mode === "history");
    setPositions(newPositions);
  }, [mode]);

  const handleSort = (field: keyof Position) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);

    const sortedPositions = [...positions].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      const multiplier = newDirection === "asc" ? 1 : -1;
      return aValue < bValue
        ? -1 * multiplier
        : aValue > bValue
        ? 1 * multiplier
        : 0;
    });

    setPositions(sortedPositions);
  };

  const handleFilter = (field: keyof Position, value: string) => {
    const newFilterValues = { ...filterValues, [field]: value };
    setFilterValues(newFilterValues);

    const basePositions = generateMockPositions(mode === "history");
    const filteredPositions = basePositions.filter((position) => {
      return Object.entries(newFilterValues).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const positionValue = String(
          position[key as keyof Position]
        ).toLowerCase();
        return positionValue.includes(filterValue.toLowerCase());
      });
    });

    setPositions(filteredPositions);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatCurrency = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  if (isCollapsed) {
    return (
      <div
        className={`p-2 rounded-lg cursor-pointer ${
          colorMode === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}
        onClick={() => setIsCollapsed(false)}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">
            {mode === "history" ? "Trading History" : "Open Positions"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }

  const columns = [
    { key: "executionTime", label: "Time", width: "w-36" },
    { key: "asset", label: "Asset", width: "w-20" },
    { key: "quantity", label: "Qty", width: "w-24" },
    { key: "price", label: "Entry", width: "w-28" },
    { key: "currentPrice", label: "Current", width: "w-28" },
    { key: "direction", label: "Side", width: "w-20" },
    { key: "exchange", label: "Exchange", width: "w-28" },
    { key: "dayChange", label: "24h Δ", width: "w-32" },
    { key: "pnl", label: "PnL", width: "w-28" },
    { key: "strategy", label: "Strategy", width: "w-48" },
  ];

  return (
    <div
      className={`rounded-lg ${
        colorMode === "dark" ? "bg-gray-800" : "bg-white"
      } text-sm`}
    >
      <div
        className="p-2 flex items-center justify-between cursor-pointer border-b"
        onClick={() => setIsCollapsed(true)}
      >
        <span className="font-medium text-sm">
          {mode === "history" ? "Trading History" : "Open Positions"}
        </span>
        <ChevronUp className="h-4 w-4" />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`${
                colorMode === "dark" ? "bg-gray-700" : "bg-gray-50"
              } text-xs`}
            >
              {columns.map(({ key, label, width }) => (
                <th
                  key={key}
                  className={`px-2 py-1.5 text-left font-medium ${width} ${
                    colorMode === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    <ArrowUpDown
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleSort(key as keyof Position)}
                    />
                  </div>
                  <input
                    type="text"
                    className={`mt-1 w-full px-1 py-0.5 text-xs rounded ${
                      colorMode === "dark"
                        ? "bg-gray-600 text-white"
                        : "bg-white text-gray-900"
                    } border ${
                      colorMode === "dark"
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                    placeholder="Filter..."
                    onChange={(e) =>
                      handleFilter(key as keyof Position, e.target.value)
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr
                key={position.id}
                onClick={() => onRowClick(position)}
                className={`border-t ${
                  colorMode === "dark" ? "border-gray-700" : "border-gray-200"
                } hover:bg-${
                  colorMode === "dark" ? "gray-700" : "gray-50"
                } cursor-pointer`}
              >
                <td className="px-2 py-1.5">{position.executionTime}</td>
                <td className="px-2 py-1.5 font-medium">{position.asset}</td>
                <td className="px-2 py-1.5">
                  {formatNumber(position.quantity, 4)}
                </td>
                <td className="px-2 py-1.5">
                  {formatCurrency(position.price)}
                </td>
                <td className="px-2 py-1.5">
                  {formatCurrency(position.currentPrice)}
                </td>
                <td
                  className={`px-2 py-1.5 ${
                    position.direction === "Long"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {position.direction}
                </td>
                <td className="px-2 py-1.5">{position.exchange}</td>
                <td
                  className={`px-2 py-1.5 ${
                    position.dayChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatCurrency(position.dayChange)} (
                  {formatNumber(position.dayChangePercent)}%)
                </td>
                <td
                  className={`px-2 py-1.5 font-medium ${
                    position.pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatCurrency(position.pnl)}
                </td>
                <td className="px-2 py-1.5">{position.strategy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioGrid;
