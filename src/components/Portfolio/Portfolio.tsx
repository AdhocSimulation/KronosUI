import React, { useState } from 'react';
import SearchBar from './SearchBar';
import PortfolioGrid from './PortfolioGrid';
import Timeline from './Timeline';

interface PortfolioProps {
  colorMode: 'light' | 'dark';
}

const Portfolio: React.FC<PortfolioProps> = ({ colorMode }) => {
  const [selectedMode, setSelectedMode] = useState<'history' | 'open'>('open');
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const mockEvents = [
    {
      id: '1',
      date: '2024-03-14 10:30:00',
      type: 'Trade',
      description: 'Bought 0.5 BTC at $45,000',
    },
    {
      id: '2',
      date: '2024-03-14 11:15:00',
      type: 'Strategy',
      description: 'Moving Average Crossover signal triggered',
    },
    {
      id: '3',
      date: '2024-03-14 14:20:00',
      type: 'Portfolio',
      description: 'Rebalancing completed',
    },
    {
      id: '4',
      date: '2024-03-14 15:45:00',
      type: 'Trade',
      description: 'Sold 100 ETH at $2,800',
    },
    {
      id: '5',
      date: '2024-03-14 16:30:00',
      type: 'Strategy',
      description: 'RSI Divergence detected on BTC/USD',
    }
  ];

  return (
    <div className={`p-6 ${colorMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <div className="mb-6">
              <SearchBar
                colorMode={colorMode}
                onResultSelect={(result) => setSelectedResult(result)}
              />
            </div>

            <div className="mb-6">
              <div
                className={`inline-flex rounded-lg p-1 ${
                  colorMode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              >
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedMode === 'open'
                      ? colorMode === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 shadow'
                      : colorMode === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                  onClick={() => setSelectedMode('open')}
                >
                  Open Positions
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedMode === 'history'
                      ? colorMode === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 shadow'
                      : colorMode === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                  onClick={() => setSelectedMode('history')}
                >
                  History
                </button>
              </div>
            </div>

            <div className="mb-6">
              <PortfolioGrid colorMode={colorMode} mode={selectedMode} />
            </div>
          </div>

          <div className="lg:w-1/2">
            <Timeline colorMode={colorMode} events={mockEvents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;