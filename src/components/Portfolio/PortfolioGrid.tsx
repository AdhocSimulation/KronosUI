import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

interface Position {
  id: string;
  executionTime: string;
  asset: string;
  quantity: number;
  quoteCurrency: string;
  price: number;
  direction: 'Long' | 'Short';
  exchange: string;
  currentValue: number;
  pnl: number;
}

interface PortfolioGridProps {
  colorMode: 'light' | 'dark';
  mode: 'history' | 'open';
}

const generateMockPositions = (isHistory: boolean): Position[] => {
  const assets = ['BTC', 'ETH', 'SOL', 'MATIC', 'DOT'];
  const exchanges = ['Binance', 'Coinbase', 'Kraken'];
  const positions: Position[] = [];

  const generateRandomPrice = (asset: string) => {
    const basePrices: { [key: string]: number } = {
      BTC: 45000, ETH: 2800, SOL: 120, MATIC: 1.5, DOT: 20
    };
    return basePrices[asset] * (0.9 + Math.random() * 0.2);
  };

  const numPositions = isHistory ? 20 : 8;

  for (let i = 0; i < numPositions; i++) {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const price = generateRandomPrice(asset);
    const quantity = parseFloat((0.1 + Math.random() * 5).toFixed(3));
    const direction = Math.random() > 0.5 ? 'Long' : 'Short';
    const currentValue = price * (1 + (Math.random() * 0.1 - 0.05));
    const pnl = direction === 'Long' 
      ? (currentValue - price) * quantity
      : (price - currentValue) * quantity;

    const date = new Date();
    if (isHistory) {
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    } else {
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    }

    positions.push({
      id: `${i + 1}`,
      executionTime: date.toISOString().replace('T', ' ').substring(0, 19),
      asset,
      quantity,
      quoteCurrency: 'USD',
      price,
      direction,
      exchange: exchanges[Math.floor(Math.random() * exchanges.length)],
      currentValue,
      pnl
    });
  }

  return positions;
};

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ colorMode, mode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sortField, setSortField] = useState<keyof Position | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterValues, setFilterValues] = useState<Partial<Record<keyof Position, string>>>({});
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const newPositions = generateMockPositions(mode === 'history');
    setPositions(newPositions);
  }, [mode]);

  const handleSort = (field: keyof Position) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedPositions = [...positions].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      const multiplier = newDirection === 'asc' ? 1 : -1;
      return aValue < bValue ? -1 * multiplier : aValue > bValue ? 1 * multiplier : 0;
    });

    setPositions(sortedPositions);
  };

  const handleFilter = (field: keyof Position, value: string) => {
    const newFilterValues = { ...filterValues, [field]: value };
    setFilterValues(newFilterValues);

    const basePositions = generateMockPositions(mode === 'history');
    const filteredPositions = basePositions.filter(position => {
      return Object.entries(newFilterValues).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const positionValue = String(position[key as keyof Position]).toLowerCase();
        return positionValue.includes(filterValue.toLowerCase());
      });
    });

    setPositions(filteredPositions);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  if (isCollapsed) {
    return (
      <div
        className={`p-2 rounded-lg cursor-pointer ${
          colorMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}
        onClick={() => setIsCollapsed(false)}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">
            {mode === 'history' ? 'Trading History' : 'Open Positions'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }

  const columns = [
    { key: 'asset', label: 'Asset', width: 'w-20' },
    { key: 'quantity', label: 'Qty', width: 'w-24' },
    { key: 'price', label: 'Price', width: 'w-24' },
    { key: 'direction', label: 'Side', width: 'w-20' },
    { key: 'exchange', label: 'Exchange', width: 'w-24' },
    { key: 'pnl', label: 'PnL', width: 'w-24' }
  ];

  return (
    <div className={`rounded-lg ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'} text-sm`}>
      <div
        className="p-2 flex items-center justify-between cursor-pointer border-b"
        onClick={() => setIsCollapsed(true)}
      >
        <span className="font-medium text-sm">
          {mode === 'history' ? 'Trading History' : 'Open Positions'}
        </span>
        <ChevronUp className="h-4 w-4" />
      </div>

      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr className={`${colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-xs`}>
              {columns.map(({ key, label, width }) => (
                <th
                  key={key}
                  className={`px-2 py-1.5 text-left font-medium ${width} ${
                    colorMode === 'dark' ? 'text-gray-200' : 'text-gray-700'
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
                      colorMode === 'dark'
                        ? 'bg-gray-600 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      colorMode === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="Filter..."
                    onChange={(e) => handleFilter(key as keyof Position, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr
                key={position.id}
                className={`border-t ${
                  colorMode === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } hover:bg-${colorMode === 'dark' ? 'gray-700' : 'gray-50'}`}
              >
                <td className="px-2 py-1.5 font-medium">{position.asset}</td>
                <td className="px-2 py-1.5">{formatNumber(position.quantity, 4)}</td>
                <td className="px-2 py-1.5">${formatNumber(position.price)}</td>
                <td className={`px-2 py-1.5 ${
                  position.direction === 'Long'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {position.direction}
                </td>
                <td className="px-2 py-1.5">{position.exchange}</td>
                <td className={`px-2 py-1.5 font-medium ${
                  position.pnl >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  ${formatNumber(position.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioGrid;