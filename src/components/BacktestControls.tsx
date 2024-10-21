import React from 'react';

interface BacktestControlsProps {
  colorMode: 'light' | 'dark';
  backtestWindowSize: number;
  setBacktestWindowSize: (size: number) => void;
  backtestSeries: string;
  setBacktestSeries: (series: string) => void;
  isBacktestRunning: boolean;
  handleRunBacktest: () => void;
  handleCancelBacktest: () => void;
}

const BacktestControls: React.FC<BacktestControlsProps> = ({
  colorMode,
  backtestWindowSize,
  setBacktestWindowSize,
  backtestSeries,
  setBacktestSeries,
  isBacktestRunning,
  handleRunBacktest,
  handleCancelBacktest,
}) => {
  return (
    <div>
      <h3 className="font-bold mb-2">Backtest Controls</h3>
      <div className="space-y-2">
        <div>
          <label htmlFor="backtestWindowSize" className="block text-sm font-medium">
            Window Size (days)
          </label>
          <input
            type="number"
            id="backtestWindowSize"
            value={backtestWindowSize}
            onChange={(e) => setBacktestWindowSize(Number(e.target.value))}
            className={`mt-1 block w-full rounded-md ${
              colorMode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
            } border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          />
        </div>
        <div>
          <label htmlFor="backtestSeries" className="block text-sm font-medium">
            Series
          </label>
          <select
            id="backtestSeries"
            value={backtestSeries}
            onChange={(e) => setBacktestSeries(e.target.value)}
            className={`mt-1 block w-full rounded-md ${
              colorMode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
            } border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          >
            <option value="BTCUSDT">BTCUSDT</option>
            <option value="ETHUSDT">ETHUSDT</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRunBacktest}
            disabled={isBacktestRunning}
            className={`flex-1 py-2 px-4 rounded ${
              isBacktestRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : colorMode === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isBacktestRunning ? 'Running...' : 'Run Backtest'}
          </button>
          <button
            onClick={handleCancelBacktest}
            disabled={!isBacktestRunning}
            className={`flex-1 py-2 px-4 rounded ${
              !isBacktestRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : colorMode === 'dark'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BacktestControls;