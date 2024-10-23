import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  type: 'portfolio' | 'strategy' | 'asset' | 'watchlist';
  description?: string;
  tags?: string[];
}

interface SearchBarProps {
  colorMode: 'light' | 'dark';
  onResultSelect: (result: SearchResult) => void;
}

const mockData: SearchResult[] = [
  // Portfolios
  { id: '1', name: 'Tech Portfolio', type: 'portfolio', description: 'Technology sector investments', tags: ['tech', 'growth'] },
  { id: '2', name: 'Crypto Holdings', type: 'portfolio', description: 'Cryptocurrency investments', tags: ['crypto', 'high-risk'] },
  { id: '3', name: 'DeFi Portfolio', type: 'portfolio', description: 'Decentralized Finance tokens', tags: ['defi', 'yield'] },
  
  // Strategies
  { id: '4', name: 'Momentum Strategy', type: 'strategy', description: 'Trend following strategy', tags: ['technical', 'momentum'] },
  { id: '5', name: 'Mean Reversion', type: 'strategy', description: 'Statistical arbitrage', tags: ['mean-reversion', 'statistical'] },
  { id: '6', name: 'Grid Trading', type: 'strategy', description: 'Automated grid trading system', tags: ['automated', 'scalping'] },
  
  // Assets
  { id: '7', name: 'Bitcoin (BTC)', type: 'asset', description: 'Leading cryptocurrency', tags: ['crypto', 'store-of-value'] },
  { id: '8', name: 'Ethereum (ETH)', type: 'asset', description: 'Smart contract platform', tags: ['smart-contracts', 'defi'] },
  { id: '9', name: 'Solana (SOL)', type: 'asset', description: 'High-performance blockchain', tags: ['layer-1', 'scalability'] },
  
  // Watchlists
  { id: '10', name: 'DeFi Tokens', type: 'watchlist', description: 'Promising DeFi projects', tags: ['defi', 'yield'] },
  { id: '11', name: 'Layer 1 Chains', type: 'watchlist', description: 'Alternative blockchain platforms', tags: ['layer-1', 'scalability'] }
];

const SearchBar: React.FC<SearchBarProps> = ({ colorMode, onResultSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length >= 1) {
      const filtered = mockData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setResults(filtered);
      setIsResultsVisible(true);
    } else {
      setResults([]);
      setIsResultsVisible(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result);
    setIsResultsVisible(false);
    setSearchTerm('');
  };

  const groupedResults = results.reduce((acc, result) => {
    const group = result.type;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'portfolio': return '💼';
      case 'strategy': return '📈';
      case 'asset': return '💰';
      case 'watchlist': return '👀';
      default: return '📋';
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search portfolios, strategies, assets, and more..."
          className={`w-full px-3 py-1.5 pl-9 text-sm rounded-lg border ${
            colorMode === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
        <Search
          className={`absolute left-2.5 top-2 h-4 w-4 ${
            colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
      </div>

      {isResultsVisible && results.length > 0 && (
        <div
          className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg ${
            colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
          } border ${
            colorMode === 'dark' ? 'border-gray-700' : 'border-gray-200'
          } max-h-96 overflow-y-auto text-sm`}
        >
          {Object.entries(groupedResults).map(([group, groupResults]) => (
            <div key={group}>
              <div className={`px-3 py-1.5 text-xs font-semibold ${
                colorMode === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-50'
              }`}>
                {getTypeIcon(group)} {group.charAt(0).toUpperCase() + group.slice(1)}s
              </div>
              {groupResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`px-3 py-2 cursor-pointer ${
                    colorMode === 'dark'
                      ? 'hover:bg-gray-700 text-white'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium">{result.name}</div>
                  {result.description && (
                    <div className={`text-xs ${
                      colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {result.description}
                    </div>
                  )}
                  {result.tags && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            colorMode === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;