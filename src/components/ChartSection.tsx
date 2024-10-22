import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ChartSectionProps {
  colorMode: 'light' | 'dark';
  onStrategyChange: (strategies: string[]) => void;
}

const strategies = ['Moving Average Crossover', 'RSI Divergence', 'MACD Histogram', 'Bollinger Bands Squeeze'];

const ChartSection: React.FC<ChartSectionProps> = ({ colorMode, onStrategyChange }) => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleStrategyToggle = (strategy: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  useEffect(() => {
    onStrategyChange(selectedStrategies);
  }, [selectedStrategies, onStrategyChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`mb-6 ${colorMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h2 className="text-xl font-bold mb-2">Chart</h2>
      <h3 className="text-lg font-semibold mb-2">Add Strategy</h3>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full p-2 text-left rounded ${
            colorMode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
          } border ${colorMode === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
        >
          {selectedStrategies.length > 0 ? `${selectedStrategies.length} selected` : 'Select strategies'}
        </button>
        {isDropdownOpen && (
          <div className={`absolute z-10 w-full mt-1 rounded shadow-lg ${
            colorMode === 'dark' ? 'bg-gray-700' : 'bg-white'
          }`}>
            {strategies.map((strategy) => (
              <div
                key={strategy}
                className={`p-2 cursor-pointer ${
                  selectedStrategies.includes(strategy)
                    ? colorMode === 'dark' ? 'bg-blue-600' : 'bg-blue-100'
                    : colorMode === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleStrategyToggle(strategy)}
              >
                {strategy}
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedStrategies.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Selected Strategies</h3>
          <div className="flex flex-wrap gap-2">
            {selectedStrategies.map((strategy) => (
              <div
                key={strategy}
                className={`flex items-center px-2 py-1 rounded ${
                  colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              >
                {strategy}
                <button
                  onClick={() => handleStrategyToggle(strategy)}
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
  );
};

export default ChartSection;