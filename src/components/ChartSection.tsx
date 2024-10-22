import React, { useState, useEffect } from 'react';

interface ChartSectionProps {
  colorMode: 'light' | 'dark';
  onStrategyChange: (strategies: string[]) => void;
}

const strategies = ['Moving Average Crossover', 'RSI Divergence', 'MACD Histogram', 'Bollinger Bands Squeeze'];

const ChartSection: React.FC<ChartSectionProps> = ({ colorMode, onStrategyChange }) => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);

  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedStrategies(selectedOptions);
  };

  useEffect(() => {
    onStrategyChange(selectedStrategies);
  }, [selectedStrategies, onStrategyChange]);

  return (
    <div className={`mb-6 ${colorMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h2 className="text-xl font-bold mb-2">Chart</h2>
      <div>
        <label htmlFor="strategy-select" className="block mb-2">Add Strategy:</label>
        <select
          id="strategy-select"
          multiple
          value={selectedStrategies}
          onChange={handleStrategyChange}
          className={`w-full p-2 rounded ${
            colorMode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
          }`}
        >
          {strategies.map((strategy) => (
            <option key={strategy} value={strategy}>
              {strategy}
            </option>
          ))}
        </select>
      </div>
      {selectedStrategies.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Selected Strategies:</h3>
          <ul className="list-disc list-inside">
            {selectedStrategies.map((strategy) => (
              <li key={strategy}>{strategy}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChartSection;